package curlin.danko.bikefitting.model.dto

import java.time.Instant
import java.time.LocalDate

/**
 * Single-record API payload: form JSON without embedding the PDF blob (use GET …/pdf).
 */
data class BikeFittingRecordDetail(
    val id: String,
    val fullName: String,
    val fitterFullName: String,
    val date: Instant,
    val submissionDate: LocalDate,
    val jsonForm: InputForm,
    val hasFile: Boolean,
)
