package curlin.danko.bikefitting.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import curlin.danko.bikefitting.export.BikeFittingCsvSchema
import curlin.danko.bikefitting.export.CsvRowMeta
import curlin.danko.bikefitting.model.dao.BikeFittingExportDAO
import curlin.danko.bikefitting.model.dao.ExportStatus
import curlin.danko.bikefitting.model.dto.BikeFittingExportSummary
import curlin.danko.bikefitting.model.dto.ExportCsvRequest
import curlin.danko.bikefitting.model.dto.InputForm
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.repository.IBikeFittingExportRepository
import curlin.danko.bikefitting.repository.IBikeFittingRepository
import jakarta.servlet.http.HttpServletResponse
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.io.OutputStream
import java.io.OutputStreamWriter
import java.nio.charset.StandardCharsets
import java.sql.ResultSet
import java.time.Instant
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID
import java.io.ByteArrayOutputStream

@Service
class BikeFittingCsvExportService(
    private val namedJdbc: NamedParameterJdbcTemplate,
    private val objectMapper: ObjectMapper,
    private val exportRepository: IBikeFittingExportRepository,
    private val bikeFittingRepository: IBikeFittingRepository,
) {

    private val logger = LoggerFactory.getLogger(BikeFittingCsvExportService::class.java)

    @PreAuthorize("hasRole('ADMIN')")
    fun listExports(page: Int, size: Int): PagedResponse<BikeFittingExportSummary> {
        val pageable = PageRequest.of(page, size.coerceIn(1, 100), Sort.by(Sort.Direction.DESC, "startedAt"))
        val result = exportRepository.findAllByOrderByStartedAtDesc(pageable)
        val data = result.content.map { it.toSummary() }
        return PagedResponse(
            data = data,
            nextPage = if (result.hasNext()) page + 1 else null,
            hasMore = result.hasNext(),
        )
    }

    @PreAuthorize("hasRole('ADMIN')")
    fun getDistinctFitters(): List<String> = bikeFittingRepository.findDistinctFitterFullNames()

    /**
     * Writes UTF-8 BOM + Excel CSV on the request thread (no StreamingResponseBody / async dispatch).
     * Sets response headers before writing the body.
     */
    @PreAuthorize("hasRole('ADMIN')")
    fun writeMassExportCsv(request: ExportCsvRequest, response: HttpServletResponse) {
        if (request.from.isAfter(request.to)) {
            throw IllegalArgumentException("'from' must be on or before 'to'")
        }

        val exportId = UUID.randomUUID().toString()
        val fitterFilter = request.fitterNames?.map { it.trim() }?.filter { it.isNotEmpty() } ?: emptyList()
        val filterJson = objectMapper.writeValueAsString(fitterFilter)
        val suggestedFilename = buildSuggestedFilename(request.from, request.to)
        val username = SecurityContextHolder.getContext().authentication?.name

        val audit = BikeFittingExportDAO(
            id = exportId,
            requestedByUsername = username,
            filterFrom = request.from,
            filterTo = request.to,
            filterFittersJson = filterJson,
            startedAt = Instant.now(),
            status = ExportStatus.RUNNING,
            suggestedFilename = suggestedFilename,
        )
        exportRepository.save(audit)

        response.characterEncoding = StandardCharsets.UTF_8.name()
        response.contentType = "text/csv; charset=UTF-8"
        response.setHeader(
            "Content-Disposition",
            "attachment; filename=\"${sanitizeFilename(audit.suggestedFilename ?: "bikefitting-export.csv")}\"",
        )
        response.setHeader("X-Export-Id", audit.id)

        try {
            // Buffer full CSV in memory first (no socket writes during generation). Then one write with
            // Content-Length — avoids dev-proxy / chunked streaming resets (ClientAbort mid-stream).
            val buffer = ByteArrayOutputStream(256 * 1024)
            val rowCount = writeMassCsvContent(request, fitterFilter, buffer)
            val bytes = buffer.toByteArray()
            response.setContentLength(bytes.size)
            response.outputStream.write(bytes)
            response.outputStream.flush()
            markCompleted(exportId, rowCount)
        } catch (e: Exception) {
            if (isClientDisconnected(e)) {
                // Browser closed the tab, user cancelled download, or network dropped — not a server bug.
                logger.debug("Client disconnected during CSV export id={}", exportId, e)
                markFailed(exportId, "Client disconnected before export finished")
                return
            }
            logger.warn("CSV export failed for id=$exportId", e)
            markFailed(exportId, (e.message ?: "export failed").take(2000))
            throw e
        }
    }

    /**
     * True when the failure is because the HTTP client closed the connection while we were writing
     * (Tomcat ClientAbortException, broken pipe, etc.).
     */
    private fun isClientDisconnected(t: Throwable): Boolean {
        var c: Throwable? = t
        while (c != null) {
            val className = c.javaClass.name
            if (className.contains("ClientAbortException")) return true
            val msg = c.message ?: ""
            if (c is java.io.IOException) {
                // Avoid matching generic "aborted" — some IO errors are misclassified and look like disconnects.
                if (msg.contains("Broken pipe", ignoreCase = true)) return true
                if (msg.contains("connection reset", ignoreCase = true)) return true
                if (msg.contains("connection was aborted", ignoreCase = true)) return true
            }
            c = c.cause
        }
        return false
    }

    private fun writeMassCsvContent(
        request: ExportCsvRequest,
        fitterFilter: List<String>,
        outputStream: OutputStream,
    ): Int {
        var rowCount = 0
        OutputStreamWriter(outputStream, StandardCharsets.UTF_8).use { writer ->
            writer.write("\uFEFF")
            val format = CSVFormat.EXCEL.builder()
                .setRecordSeparator("\r\n")
                .build()
            CSVPrinter(writer, format).use { printer ->
                printer.printRecord(BikeFittingCsvSchema.HEADERS)
                var offset = 0
                while (true) {
                    val batch = fetchExportBatch(
                        from = request.from,
                        to = request.to,
                        fitterNames = fitterFilter,
                        limit = PAGE_SIZE,
                        offset = offset,
                    )
                    if (batch.isEmpty()) break
                    for (row in batch) {
                        val (form, jsonErr) = parseJsonForm(row.jsonFormText)
                        val cells = BikeFittingCsvSchema.rowValues(
                            CsvRowMeta(
                                id = row.id,
                                fullName = row.fullName,
                                fitterFullName = row.fitterFullName,
                                sessionInstant = row.sessionInstant,
                                submissionDate = row.submissionDate,
                                hasPdf = row.hasPdf,
                            ),
                            form,
                            jsonErr,
                        )
                        printer.printRecord(cells)
                        rowCount++
                    }
                    offset += batch.size
                    if (batch.size < PAGE_SIZE) break
                }
            }
        }
        return rowCount
    }

    private fun sanitizeFilename(name: String): String {
        var result = name
        val replacements = mapOf(
            "č" to "c", "ć" to "c", "đ" to "d", "š" to "s", "ž" to "z",
            "Č" to "C", "Ć" to "C", "Đ" to "D", "Š" to "S", "Ž" to "Z",
        )
        replacements.forEach { (from, to) ->
            result = result.replace(from, to)
        }
        result = result.replace(Regex("[^\\p{ASCII}]"), "")
        result = result.replace(Regex("[^a-zA-Z0-9._-]"), "-")
        result = result.replace(Regex("-+"), "-")
        result = result.trimStart('-').trimEnd('-')
        return result.ifBlank { "bikefitting-export.csv" }
    }

    /**
     * One row, same columns as mass export (no audit row). Any authenticated user may download
     * a CSV for a record they can open in the app (same policy as GET /api/records/{id}).
     */
    @PreAuthorize("isAuthenticated()")
    fun writeSingleRecordCsv(recordId: String, response: HttpServletResponse) {
        val params = MapSqlParameterSource().addValue("id", recordId)
        val row = namedJdbc.query(SELECT_BY_ID_SQL, params) { rs, _ -> mapExportRow(rs) }
            .firstOrNull()
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found with id: $recordId")

        val filename = singleRecordFilename(row)
        response.characterEncoding = StandardCharsets.UTF_8.name()
        response.contentType = "text/csv; charset=UTF-8"
        response.setHeader(
            "Content-Disposition",
            "attachment; filename=\"${sanitizeFilename(filename)}\"",
        )
        try {
            OutputStreamWriter(response.outputStream, StandardCharsets.UTF_8).use { writer ->
                writer.write("\uFEFF")
                val format = CSVFormat.EXCEL.builder()
                    .setRecordSeparator("\r\n")
                    .build()
                CSVPrinter(writer, format).use { printer ->
                    printer.printRecord(BikeFittingCsvSchema.HEADERS)
                    val (form, jsonErr) = parseJsonForm(row.jsonFormText)
                    val cells = BikeFittingCsvSchema.rowValues(
                        CsvRowMeta(
                            id = row.id,
                            fullName = row.fullName,
                            fitterFullName = row.fitterFullName,
                            sessionInstant = row.sessionInstant,
                            submissionDate = row.submissionDate,
                            hasPdf = row.hasPdf,
                        ),
                        form,
                        jsonErr,
                    )
                    printer.printRecord(cells)
                }
            }
        } catch (e: Exception) {
            if (isClientDisconnected(e)) {
                logger.debug("Client disconnected during single-record CSV id={}", recordId, e)
                return
            }
            throw e
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun markCompleted(exportId: String, rowCount: Int) {
        exportRepository.findById(exportId).ifPresent {
            it.status = ExportStatus.COMPLETED
            it.completedAt = Instant.now()
            it.rowCount = rowCount
            exportRepository.save(it)
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun markFailed(exportId: String, message: String) {
        exportRepository.findById(exportId).ifPresent {
            it.status = ExportStatus.FAILED
            it.completedAt = Instant.now()
            it.errorMessage = message
            exportRepository.save(it)
        }
    }

    private fun parseJsonForm(json: String?): Pair<InputForm?, String?> {
        if (json.isNullOrBlank()) {
            return null to "empty json_form"
        }
        return try {
            objectMapper.readValue<InputForm>(json) to null
        } catch (e: Exception) {
            logger.debug("Failed to parse json_form for export row: {}", e.message)
            null to (e.message?.take(500) ?: "json parse error")
        }
    }

    private fun fetchExportBatch(
        from: LocalDate,
        to: LocalDate,
        fitterNames: List<String>,
        limit: Int,
        offset: Int,
    ): List<RawExportRow> {
        val sql = if (fitterNames.isEmpty()) {
            """
            SELECT id, full_name, fitter_full_name, "date", submission_date,
                   (pdf_file IS NOT NULL) AS has_pdf,
                   json_form::text AS json_form_text
            FROM bike_fitting
            WHERE submission_date BETWEEN :from AND :to
            ORDER BY id
            LIMIT :limit OFFSET :offset
            """.trimIndent()
        } else {
            """
            SELECT id, full_name, fitter_full_name, "date", submission_date,
                   (pdf_file IS NOT NULL) AS has_pdf,
                   json_form::text AS json_form_text
            FROM bike_fitting
            WHERE submission_date BETWEEN :from AND :to
              AND fitter_full_name IN (:fitters)
            ORDER BY id
            LIMIT :limit OFFSET :offset
            """.trimIndent()
        }

        val params = MapSqlParameterSource()
            .addValue("from", from)
            .addValue("to", to)
            .addValue("limit", limit)
            .addValue("offset", offset)
        if (fitterNames.isNotEmpty()) {
            params.addValue("fitters", fitterNames)
        }

        return namedJdbc.query(sql, params) { rs, _ -> mapExportRow(rs) }
    }

    private fun singleRecordFilename(row: RawExportRow): String {
        val clean = row.fullName.replace(Regex("\\s+"), "")
        val sd = row.submissionDate.toString()
        return "$clean-$sd-bike-fitting.csv"
    }

    private fun mapExportRow(rs: ResultSet): RawExportRow {
        val dateCol = rs.getTimestamp("date")
        val sessionInstant = dateCol?.toInstant()
            ?: throw IllegalStateException("session date is null for row ${rs.getString("id")}")
        return RawExportRow(
            id = rs.getString("id"),
            fullName = rs.getString("full_name") ?: "",
            fitterFullName = rs.getString("fitter_full_name") ?: "",
            sessionInstant = sessionInstant,
            submissionDate = rs.getObject("submission_date", LocalDate::class.java)
                ?: throw IllegalStateException("submission_date null"),
            hasPdf = rs.getBoolean("has_pdf"),
            jsonFormText = rs.getString("json_form_text"),
        )
    }

    private fun BikeFittingExportDAO.toSummary(): BikeFittingExportSummary {
        val fitterList: List<String> = try {
            objectMapper.readValue(filterFittersJson)
        } catch (e: Exception) {
            emptyList()
        }
        return BikeFittingExportSummary(
            id = id,
            requestedByUsername = requestedByUsername,
            filterFrom = filterFrom,
            filterTo = filterTo,
            filterFitters = fitterList,
            startedAt = startedAt,
            completedAt = completedAt,
            status = status.name,
            rowCount = rowCount,
            errorMessage = errorMessage,
            suggestedFilename = suggestedFilename,
        )
    }

    private data class RawExportRow(
        val id: String,
        val fullName: String,
        val fitterFullName: String,
        val sessionInstant: Instant,
        val submissionDate: LocalDate,
        val hasPdf: Boolean,
        val jsonFormText: String?,
    )

    companion object {
        private const val PAGE_SIZE = 500

        private val FILENAME_TS: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")

        private val SELECT_BY_ID_SQL =
            """
            SELECT id, full_name, fitter_full_name, "date", submission_date,
                   (pdf_file IS NOT NULL) AS has_pdf,
                   json_form::text AS json_form_text
            FROM bike_fitting
            WHERE id = :id
            """.trimIndent()

        private fun buildSuggestedFilename(from: LocalDate, to: LocalDate): String {
            val ts = FILENAME_TS.format(Instant.now().atZone(java.time.ZoneId.systemDefault()))
            return "bikefitting-export-${from}_to_${to}_$ts.csv"
        }
    }
}
