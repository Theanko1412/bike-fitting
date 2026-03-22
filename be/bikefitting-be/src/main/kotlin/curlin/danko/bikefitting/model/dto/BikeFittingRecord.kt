package curlin.danko.bikefitting.model.dto

import java.time.Instant

data class BikeFittingRecord(
    val id: String,
    val fullName: String,
    val date: Instant,
    val hasFile: Boolean,
)
