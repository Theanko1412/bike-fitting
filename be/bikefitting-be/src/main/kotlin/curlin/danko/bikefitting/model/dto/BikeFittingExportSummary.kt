package curlin.danko.bikefitting.model.dto

import java.time.Instant
import java.time.LocalDate

data class BikeFittingExportSummary(
    val id: String,
    val requestedByUsername: String?,
    val filterFrom: LocalDate,
    val filterTo: LocalDate,
    val filterFitters: List<String>,
    val startedAt: Instant,
    val completedAt: Instant?,
    val status: String,
    val rowCount: Int?,
    val errorMessage: String?,
    val suggestedFilename: String?,
)
