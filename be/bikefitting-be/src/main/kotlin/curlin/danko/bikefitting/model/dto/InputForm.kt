package curlin.danko.bikefitting.model.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import curlin.danko.bikefitting.model.dao.generateNumericNanoId
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId

/**
 * Stored as JSONB: schema can evolve. Jackson ignores unknown properties; missing or invalid
 * values deserialize as null (strings/numbers/dates/fitter). Treat null as "not set" for legacy rows.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class InputForm(
    // Step 0: General Information
    val date: LocalDate? = null,
    val fullName: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val fitter: Fitter? = null,
    val cyclingExperienceLevel: String? = null,
    val cyclingExperienceYears: Double? = null,
    val cyclingFrequency: String? = null,
    val cyclingProblem: String? = null,
    val cyclingConcerns: String? = null,

    // Step 1: Full Body Assessment
    val ischialTuberosity: Double? = null,
    val height: Double? = null,
    val inseam: Double? = null,
    val shoulderWidth: Double? = null,
    val footLengthLeft: Double? = null,
    val footLengthRight: Double? = null,
    val footWidthLeft: Double? = null,
    val footWidthRight: Double? = null,
    val forefootAngulationTypeLeft: String? = null,
    val forefootAngulationTypeRight: String? = null,
    val forefootAngulationSeverityLeft: String? = null,
    val forefootAngulationSeverityRight: String? = null,
    val rearFootStructureLeft: String? = null,
    val rearFootStructureRight: String? = null,
    val neutralArchHeightLeft: String? = null,
    val neutralArchHeightRight: String? = null,
    val lowerExtremityAlignmentLeft: String? = null,
    val lowerExtremityAlignmentRight: String? = null,
    val advLowerExtremityAlignment: String? = null,
    val levelPelvis: String? = null,
    val spinalCurveEvaluation: String? = null,
    val advScapularPositionType: String? = null,
    val advScapularPositionSeverity: String? = null,
    val cervicalSpineROM: String? = null,
    val shoulderROM: String? = null,
    val hamstringROMLeft: Double? = null,
    val hamstringROMRight: Double? = null,
    val hipROMLeft: Double? = null,
    val hipROMRight: Double? = null,
    val advPassiveHipROMLeft: String? = null,
    val advPassiveHipROMRight: String? = null,
    val ankleROMPlantarLeft: String? = null,
    val ankleROMPlantarRight: String? = null,
    val ankleROMDorsalLeft: String? = null,
    val ankleROMDorsalRight: String? = null,
    val advQAngle: Double? = null,
    val pelvicRotation: String? = null,
    val legLengthDiscrepancy: String? = null,
    val legLengthDiscrepancyDifference: Double? = null,

    // Thomas Test
    val itBandLeft: String? = null,
    val itBandRight: String? = null,
    val hipLeft: String? = null,
    val hipRight: String? = null,
    val quadLeft: String? = null,
    val quadRight: String? = null,

    // One Third Knee Band
    val kneeTypeLeft: String? = null,
    val kneeTypeRight: String? = null,
    val kneeSeverityLeft: String? = null,
    val kneeSeverityRight: String? = null,
    val footLeft: String? = null,
    val footRight: String? = null,
    val hipPositionLeft: String? = null,
    val hipPositionRight: String? = null,
    val torsoLeft: String? = null,
    val torsoRight: String? = null,
    val advActiveHipROMLeft: String? = null,
    val advActiveHipROMRight: String? = null,
    val forwardSpinalFlexionPhoto: String? = null,

    // Step 2: Initial Bike Measurement
    val bikeBrand: String? = null,
    val bikeType: String? = null,
    val bikeModel: String? = null,
    val bikeSize: String? = null,
    val bikeYear: Double? = null,
    val saddleBrand: String? = null,
    val saddleModel: String? = null,
    val saddleWidth: Double? = null,
    val shoeBrand: String? = null,
    val shoeSize: Double? = null,
    val saddleHeight: Double? = null,
    val saddleOffset: Double? = null,
    val handlebarWidth: Double? = null,
    val stemLength: Double? = null,
    val stemAngle: Double? = null,
    val reachToHandlebar: Double? = null,
    val reachToGrips: Double? = null,
    val reachToHoods: Double? = null,
    val barDropFromSaddle: Double? = null,
    val pedalsBrand: String? = null,
    val footbedLeft: Double? = null,
    val footbedRight: Double? = null,
    val crankLength: Double? = null,
    val initialRiderPhoto: String? = null,

    // Step 3: Final Bike Measurement
    val finalBikeBrand: String? = null,
    val finalBikeType: String? = null,
    val finalBikeModel: String? = null,
    val finalBikeSize: String? = null,
    val finalBikeYear: Double? = null,
    val finalSaddleBrand: String? = null,
    val finalSaddleModel: String? = null,
    val finalSaddleWidth: Double? = null,
    val finalShoeBrand: String? = null,
    val finalShoeSize: Double? = null,
    val finalSaddleHeight: Double? = null,
    val finalSaddleOffset: Double? = null,
    val finalHandlebarWidth: Double? = null,
    val finalStemLength: Double? = null,
    val finalStemAngle: Double? = null,
    val finalReachToHandlebar: Double? = null,
    val finalReachToGrips: Double? = null,
    val finalReachToHoods: Double? = null,
    val finalBarDropFromSaddle: Double? = null,
    val finalPedalsBrand: String? = null,
    val finalFootbedLeft: Double? = null,
    val finalFootbedRight: Double? = null,
    val finalCrankLength: Double? = null,
    val finalRiderPhoto: String? = null,

    // Step 4: Shoe Setup
    val forefootWedgeLeft: String? = null,
    val forefootWedgeRight: String? = null,
    val cleatWedgeLeft: String? = null,
    val cleatWedgeRight: String? = null,
    val cleatRotationLeft: Double? = null,
    val cleatRotationRight: Double? = null,
    val cleatLateralLeft: Double? = null,
    val cleatLateralRight: Double? = null,
    val cleatForAftPlacementLeft: String? = null,
    val cleatForAftPlacementRight: String? = null,
    val cleatLiftLeft: Double? = null,
    val cleatLiftRight: Double? = null,
) {
    /**
     * Run on new submissions only. Must not run when Hibernate deserializes stored JSON.
     */
    fun validateForSubmit() {
        val emailStr = email ?: ""
        if (!emailStr.matches(Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))) {
            throw IllegalArgumentException(
                "Invalid email format: $emailStr - must be a valid email address.",
            )
        }
        val name = fullName ?: ""
        if (name.isBlank()) {
            throw IllegalArgumentException(
                "Full name cannot be empty.",
            )
        }
        if (name.length > 100) {
            throw IllegalArgumentException(
                "Full name is too long (max 100 characters).",
            )
        }
        if ((phone ?: "").length > 20) {
            throw IllegalArgumentException(
                "Phone number is too long (max 20 characters).",
            )
        }
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class Fitter(
    val fullName: String? = null,
    val email: String? = null,
    val phone: String? = null,
)

fun InputForm.toDAO(): BikeFittingDAO {
    val zone = ZoneId.systemDefault()
    val selectedDate = date ?: LocalDate.now(zone)
    val sessionInstant = LocalDateTime.of(selectedDate, LocalTime.now(zone)).atZone(zone).toInstant()
    return BikeFittingDAO(
        id = generateNumericNanoId(),
        fullName = fullName ?: "",
        fitterFullName = fitter?.fullName ?: "",
        date = sessionInstant,
        jsonForm = this,
        pdfFile = null,
    )
}
