package curlin.danko.bikefitting.model.dto

import java.time.LocalDate

data class ExportCsvRequest(
    val from: LocalDate,
    val to: LocalDate,
    /** Empty or null means include all fitters. */
    val fitterNames: List<String>? = null,
)
