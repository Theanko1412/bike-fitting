// Form steps configuration
export const steps = [
	{
		id: 0,
		title: "General Information",
	},
	{
		id: 1,
		title: "Full Body Assessment",
	},
	{
		id: 2,
		title: "Initial Bike Measurement",
	},
	{
		id: 3,
		title: "Final Bike Measurement",
	},
	{
		id: 4,
		title: "Shoe Setup",
	},
];

export const fitters = [
	{
		fullName: "Juraj Segin",
		email: "segin1996@gmail.com",
		phone: "+385 95 904 2077",
	},
];

export const cyclingExperience = [
	"Beginner",
	"Intermediate",
	"Experienced",
	"Advanced",
	"Professional",
];

export const cyclingFrequency = ["1-2", "3-4", "5-6", "7-8", "9-10"];

// Generate bike years (current year back 12 years)
const currentYear = new Date().getFullYear();
export const bikeYears = Array.from({ length: 11 }, (_, i) => currentYear - i);

// Value ranges for drawer selections
export const ranges = {
	ischialTuberosity: Array.from({ length: 15 }, (_, i) => 80 + i * 5), // 80-150mm in 5mm steps
	hamstringROM: Array.from({ length: 19 }, (_, i) => i * 5), // 0-90° in 5° steps
	shoulderROM: Array.from({ length: 37 }, (_, i) => i * 5), // 0-180° in 5° steps
	hipROM: Array.from({ length: 37 }, (_, i) => i * 5), // 0-180° in 5° steps
	ankleROMPlantar: Array.from({ length: 15 }, (_, i) => -20 + i * 5), // -20 to +50° in 5° steps
	ankleROMDorsal: Array.from({ length: 15 }, (_, i) => -20 + i * 5), // -20 to +50° in 5° steps
	qAngle: Array.from({ length: 26 }, (_, i) => i), // 0-25° in 1° steps
	activeHipROM: Array.from({ length: 37 }, (_, i) => i * 5), // 0-180° in 5° steps
	saddleHeight: Array.from({ length: 51 }, (_, i) => 600 + i * 5), // 600-850mm in 5mm steps
	saddleWidth: Array.from({ length: 9 }, (_, i) => 120 + i * 5), // 120-160mm in 5mm steps
	saddleOffset: Array.from({ length: 21 }, (_, i) => -50 + i * 5), // -50 to 50mm in 5mm steps
	shoeSize: Array.from({ length: 16 }, (_, i) => 35 + i), // 35-50 in 1 size steps
	stemLength: Array.from({ length: 15 }, (_, i) => 60 + i * 5), // 60-130mm in 5mm steps
	stemAngle: Array.from({ length: 25 }, (_, i) => -17 + i * 2), // -17 to +30° in 2° steps
	handlebarWidth: [36, 38, 40, 42, 44, 46], // Common handlebar widths in cm
	reachToHandlebar: Array.from({ length: 21 }, (_, i) => 350 + i * 10), // 350-550mm in 10mm steps
	reachToGrips: Array.from({ length: 21 }, (_, i) => 450 + i * 10), // 450-650mm in 10mm steps
	reachToHoods: Array.from({ length: 16 }, (_, i) => 350 + i * 10), // 350-500mm in 10mm steps
	barDropFromSaddle: Array.from({ length: 13 }, (_, i) => -60 + i * 5), // -60 to 0mm in 5mm steps
	crankLength: [160, 165, 167.5, 170, 172.5, 175, 177.5, 180], // Common crank lengths in mm
	cleatRotation: Array.from({ length: 21 }, (_, i) => -10 + i), // -10 to +10° in 1° steps
	cleatLateral: Array.from({ length: 21 }, (_, i) => -10 + i), // -10 to +10mm in 1mm steps
	cleatLift: Array.from({ length: 16 }, (_, i) => i), // 0-15mm in 1mm steps
};

// String options for drawers (5+ options)
export const forefootAngulationTypes = [
	"Neutral",
	"Varus",
	"Valgus",
	"Supinated",
	"Pronated",
];

// Bike brand options
export const bikeBrands = [
	"Trek",
	"Specialized",
	"Giant",
	"Cannondale",
	"Scott",
	"Cervélo",
	"Pinarello",
].sort();

// Pedal brand options
export const pedalBrands = [
	"Shimano",
	"Look",
	"Speedplay",
	"Time",
	"Crankbrothers",
	"Favero",
	"Garmin",
].sort();

// Default form data
export const getDefaultFormData = () => ({
	// Step 0: General Information
	date: new Date(),
	fullName: "",
	email: "",
	phone: "",
	fitter: fitters[0],
	cyclingExperience: "Professional",
	cyclingFrequency: "9-10",
	cyclingProblem: "",
	cyclingConcerns: "",
	// Step 1: Full Body Assessment (defaults to middle of ranges)
	ischialTuberosity: 115, // middle of 80-150
	forefootAngulationTypeLeft: "Neutral",
	forefootAngulationTypeRight: "Neutral",
	forefootAngulationSeverityLeft: "",
	forefootAngulationSeverityRight: "",
	rearFootStructureLeft: "",
	rearFootStructureRight: "",
	neutralArchHeightLeft: "",
	neutralArchHeightRight: "",
	lowerExtremityAlignmentLeft: "",
	lowerExtremityAlignmentRight: "",
	advLowerExtremityAlignment: "",
	levelPelvis: "",
	spinalCurveEvaluation: "",
	advScapularPositionType: "",
	advScapularPositionSeverity: "",
	cervicalSpineROM: "",
	shoulderROM: 90, // middle of 0-180
	hamstringROMLeft: 45, // middle of 0-90
	hamstringROMRight: 45,
	hipROMLeft: 90, // middle of 0-180
	hipROMRight: 90,
	advPassiveHipROMLeft: "",
	advPassiveHipROMRight: "",
	ankleROMPlantar‌Left: 15, // middle of -20 to +50
	ankleROMPlantar‌Right: 15,
	ankleROMDorsalLeft: 15,
	ankleROMDorsalRight: 15,
	advQAngle: 12, // middle of 0-25
	pelvicRotation: "",
	legLengthDiscrepancy: "",

	// Thomas Test
	itBandLeft: "",
	itBandRight: "",
	hipLeft: "",
	hipRight: "",
	quadLeft: "",
	quadRight: "",

	// One Third Knee Band
	kneeTypeLeft: "",
	kneeTypeRight: "",
	kneeSeverityLeft: "",
	kneeSeverityRight: "",
	footLeft: "",
	footRight: "",
	hipPositionLeft: "",
	hipPositionRight: "",
	torsoLeft: "",
	torsoRight: "",
	advActiveHipROMLeft: 90, // middle of 0-180
	advActiveHipROMRight: 90,
	forwardSpinalFlexionPhoto: "", // Full body assessment spinal flexion photo

	// Step 2: Initial Bike Measurement
	bikeBrand: "Trek",
	bikeModel: "",
	bikeYear: currentYear,
	saddleBrand: "",
	saddleModel: "",
	saddleWidth: 140, // middle of 120-160
	shoeBrand: "",
	shoeSize: 42, // middle of 35-50
	saddleHeight: 725, // middle of 600-850
	saddleOffset: 0, // middle of -50 to 50
	saddleDirection: "",
	handlebarWidth: 42, // middle of common sizes
	stemLength: 95, // middle of 60-130
	stemAngle: 6, // middle of -17 to 30
	reachToHandlebar: 450, // middle of 350-550
	reachToGrips: 550, // middle of 450-650
	reachToHoods: 425, // middle of 350-500
	barDropFromSaddle: -30, // middle of -60 to 0
	pedalsBrand: "Shimano",
	footbedLeft: "",
	footbedRight: "",
	crankLength: 172.5, // common default
	initialRiderPhoto: "", // Initial bike measurement rider photo

	// Step 3: Final Bike Measurement
	finalBikeBrand: "Trek",
	finalBikeModel: "",
	finalBikeYear: currentYear,
	finalSaddleBrand: "",
	finalSaddleModel: "",
	finalSaddleWidth: 140, // middle of 120-160
	finalShoeBrand: "",
	finalShoeSize: 42, // middle of 35-50
	finalSaddleHeight: 725, // middle of 600-850
	finalSaddleOffset: 0, // middle of -50 to 50
	finalSaddleDirection: "",
	finalHandlebarWidth: 42, // middle of common sizes
	finalStemLength: 95, // middle of 60-130
	finalStemAngle: 6, // middle of -17 to 30
	finalReachToHandlebar: 450, // middle of 350-550
	finalReachToGrips: 550, // middle of 450-650
	finalReachToHoods: 425, // middle of 350-500
	finalBarDropFromSaddle: -30, // middle of -60 to 0
	finalPedalsBrand: "Shimano",
	finalFootbedLeft: "",
	finalFootbedRight: "",
	finalCrankLength: 172.5, // common default
	finalRiderPhoto: "", // Final bike measurement rider photo

	// Step 4: Shoe Setup
	forefootWedgeLeft: "",
	forefootWedgeRight: "",
	cleatWedgeLeft: "",
	cleatWedgeRight: "",
	cleatRotationLeft: 0, // middle of -10 to +10
	cleatRotationRight: 0,
	cleatLateralLeft: 0,
	cleatLateralRight: 0,
	cleatForAftPlacementLeft: "",
	cleatForAftPlacementRight: "",
	cleatLiftLeft: 0, // 0-15mm
	cleatLiftRight: 0,
});
