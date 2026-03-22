package curlin.danko.bikefitting.controller

import curlin.danko.bikefitting.model.dao.toRecordDetail
import curlin.danko.bikefitting.model.dto.BikeFittingRecord
import curlin.danko.bikefitting.model.dto.BikeFittingRecordDetail
import curlin.danko.bikefitting.model.dto.InputForm
import curlin.danko.bikefitting.model.dto.PagedResponse
import curlin.danko.bikefitting.service.BikeFittingCsvExportService
import curlin.danko.bikefitting.service.BikeFittingService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class BikeFittingController(
    private val bikeFittingService: BikeFittingService,
    private val csvExportService: BikeFittingCsvExportService,
) {

    /**
     * Sanitizes a filename to be ASCII-safe for HTTP headers.
     * Transliterates common non-ASCII characters to ASCII equivalents.
     */
    private fun sanitizeFilename(name: String): String {
        var result = name
        // Transliterate common characters
        val replacements = mapOf(
            "č" to "c", "ć" to "c", "đ" to "d", "š" to "s", "ž" to "z",
            "Č" to "C", "Ć" to "C", "Đ" to "D", "Š" to "S", "Ž" to "Z",
            "á" to "a", "é" to "e", "í" to "i", "ó" to "o", "ú" to "u", "ý" to "y",
            "Á" to "A", "É" to "E", "Í" to "I", "Ó" to "O", "Ú" to "U", "Ý" to "Y",
            "ä" to "a", "ë" to "e", "ï" to "i", "ö" to "o", "ü" to "u",
            "Ä" to "A", "Ë" to "E", "Ï" to "I", "Ö" to "O", "Ü" to "U",
            "ñ" to "n", "Ñ" to "N",
        )

        replacements.forEach { (from, to) ->
            result = result.replace(from, to)
        }

        // Replace any remaining non-ASCII characters and unsafe characters with dash
        result = result.replace(Regex("[^\\p{ASCII}]"), "")
        result = result.replace(Regex("[^a-zA-Z0-9._-]"), "-")
        result = result.replace(Regex("-+"), "-") // Replace multiple dashes with single dash
        result = result.trimStart('-').trimEnd('-') // Remove leading/trailing dashes

        return result
    }

    @GetMapping("/records")
    fun getRecords(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "50") size: Int,
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "desc") direction: String,
    ): ResponseEntity<PagedResponse<BikeFittingRecord>> {
        val response = bikeFittingService.searchRecords(page, size, search, direction)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/records/{id}")
    fun getRecordById(@PathVariable id: String): ResponseEntity<BikeFittingRecordDetail> {
        val record = bikeFittingService.getRecordById(id)
        return ResponseEntity.ok(record.toRecordDetail())
    }

    @GetMapping("/records/{id}/csv", produces = ["text/csv; charset=UTF-8"])
    fun getRecordCsv(@PathVariable id: String, response: HttpServletResponse) {
        csvExportService.writeSingleRecordCsv(id, response)
    }

    @GetMapping("/records/{id}/pdf")
    fun getRecordPdf(@PathVariable id: String): ResponseEntity<ByteArray> {
        val pdfData = bikeFittingService.getPdfDownloadData(id)

        // Create filename: fullName-date-bike-fitting-report.pdf
        val cleanFullName = sanitizeFilename(pdfData.fullName.replace(" ", ""))
        val dateString = pdfData.date.toString() // yyyy-mm-dd format
        val filename = "$cleanFullName-$dateString-bike-fitting-report.pdf"

        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_PDF
        headers.setContentDispositionFormData("attachment", filename)
        headers.contentLength = pdfData.pdfFile.size.toLong()

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdfData.pdfFile)
    }

    @PostMapping("/records/{id}/pdf/regenerate")
    @PreAuthorize("hasRole('ADMIN')")
    fun regenerateRecordPdf(@PathVariable id: String): ResponseEntity<ByteArray> {
        val pdfData = bikeFittingService.regeneratePdf(id)

        // Create filename: fullName-date-bike-fitting-report.pdf
        val cleanFullName = sanitizeFilename(pdfData.fullName.replace(" ", ""))
        val dateString = pdfData.date.toString() // yyyy-mm-dd format
        val filename = "$cleanFullName-$dateString-bike-fitting-report-regenerated.pdf"

        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_PDF
        headers.setContentDispositionFormData("attachment", filename)
        headers.contentLength = pdfData.pdfFile.size.toLong()

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdfData.pdfFile)
    }

    @PostMapping("/form")
    fun submitForm(@RequestBody inputForm: InputForm): ResponseEntity<BikeFittingRecord> {
        val savedRecord = bikeFittingService.saveRecord(inputForm)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord)
    }
}
