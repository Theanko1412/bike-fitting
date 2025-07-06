package curlin.danko.bikefitting.model.dto

import curlin.danko.bikefitting.model.dao.BikeFittingDAO
import java.time.LocalDate

data class InputForm(
    // Step 0: General Information
    val date: LocalDate,
    val fullName: String,
    val email: String,
    val phone: String,
    val fitter: Fitter,
    val cyclingExperience: String,
    val cyclingFrequency: String,
    val cyclingProblem: String,
    val cyclingConcerns: String,

    // Step 1: Full Body Assessment
    val ischialTuberosity: Double,
    val forefootAngulationTypeLeft: String,
    val forefootAngulationTypeRight: String,
    val forefootAngulationSeverityLeft: String,
    val forefootAngulationSeverityRight: String,
    val rearFootStructureLeft: String,
    val rearFootStructureRight: String,
    val neutralArchHeightLeft: String,
    val neutralArchHeightRight: String,
    val lowerExtremityAlignmentLeft: String,
    val lowerExtremityAlignmentRight: String,
    val advLowerExtremityAlignment: String,
    val levelPelvis: String,
    val spinalCurveEvaluation: String,
    val advScapularPositionType: String,
    val advScapularPositionSeverity: String,
    val cervicalSpineROM: String,
    val shoulderROM: Double,
    val hamstringROMLeft: Double,
    val hamstringROMRight: Double,
    val hipROMLeft: Double,
    val hipROMRight: Double,
    val advPassiveHipROMLeft: String,
    val advPassiveHipROMRight: String,
    val ankleROMPlantarLeft: Double,
    val ankleROMPlantarRight: Double,
    val ankleROMDorsalLeft: Double,
    val ankleROMDorsalRight: Double,
    val advQAngle: Double,
    val pelvicRotation: String,
    val legLengthDiscrepancy: String,

    // Thomas Test
    val itBandLeft: String,
    val itBandRight: String,
    val hipLeft: String,
    val hipRight: String,
    val quadLeft: String,
    val quadRight: String,

    // One Third Knee Band
    val kneeTypeLeft: String,
    val kneeTypeRight: String,
    val kneeSeverityLeft: String,
    val kneeSeverityRight: String,
    val footLeft: String,
    val footRight: String,
    val hipPositionLeft: String,
    val hipPositionRight: String,
    val torsoLeft: String,
    val torsoRight: String,
    val advActiveHipROMLeft: Double,
    val advActiveHipROMRight: Double,
    val forwardSpinalFlexionPhoto: String,

    // Step 2: Initial Bike Measurement
    val bikeBrand: String,
    val bikeModel: String,
    val bikeYear: Double,
    val saddleBrand: String,
    val saddleModel: String,
    val saddleWidth: Double,
    val shoeBrand: String,
    val shoeSize: Double,
    val saddleHeight: Double,
    val saddleOffset: Double,
    val saddleDirection: String,
    val handlebarWidth: Double,
    val stemLength: Double,
    val stemAngle: Double,
    val reachToHandlebar: Double,
    val reachToGrips: Double,
    val reachToHoods: Double,
    val barDropFromSaddle: Double,
    val pedalsBrand: String,
    val footbedLeft: String,
    val footbedRight: String,
    val crankLength: Double,
    val initialRiderPhoto: String,

    // Step 3: Final Bike Measurement
    val finalBikeBrand: String,
    val finalBikeModel: String,
    val finalBikeYear: Double,
    val finalSaddleBrand: String,
    val finalSaddleModel: String,
    val finalSaddleWidth: Double,
    val finalShoeBrand: String,
    val finalShoeSize: Double,
    val finalSaddleHeight: Double,
    val finalSaddleOffset: Double,
    val finalSaddleDirection: String,
    val finalHandlebarWidth: Double,
    val finalStemLength: Double,
    val finalStemAngle: Double,
    val finalReachToHandlebar: Double,
    val finalReachToGrips: Double,
    val finalReachToHoods: Double,
    val finalBarDropFromSaddle: Double,
    val finalPedalsBrand: String,
    val finalFootbedLeft: String,
    val finalFootbedRight: String,
    val finalCrankLength: Double,
    val finalRiderPhoto: String,

    // Step 4: Shoe Setup
    val forefootWedgeLeft: String,
    val forefootWedgeRight: String,
    val cleatWedgeLeft: String,
    val cleatWedgeRight: String,
    val cleatRotationLeft: Double,
    val cleatRotationRight: Double,
    val cleatLateralLeft: Double,
    val cleatLateralRight: Double,
    val cleatForAftPlacementLeft: String,
    val cleatForAftPlacementRight: String,
    val cleatLiftLeft: Double,
    val cleatLiftRight: Double
) {
    init {
        if(!email.matches(Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))) throw IllegalArgumentException(
            "Invalid email format: $email - must be a valid email address."
        )
        if(fullName.isBlank()) throw IllegalArgumentException(
            "Full name cannot be empty."
        )
    }
}

data class Fitter(
    val fullName: String,
    val email: String,
    val phone: String
)

fun InputForm.toDAO(): BikeFittingDAO {
    return BikeFittingDAO(
        fullName = this.fullName,
        fitterFullName = this.fitter.fullName,
        date = this.date,
        jsonForm = this,
        pdfFile = null
    )
}