package curlin.danko.bikefitting.model.dto

import java.time.LocalDate

data class BikeFittingRecord(
    val id: Long,
    val fullName: String,
    val date: LocalDate,
    val hasFile: Boolean,
)
