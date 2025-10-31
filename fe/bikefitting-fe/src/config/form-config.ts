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

// Fitter type definition
export interface Fitter {
	fullName: string;
	email: string;
	phone: string;
}

// Load fitters from environment variables (sensitive data)
export const fitters: Fitter[] = (() => {
	try {
		const fittersJson = import.meta.env.VITE_FITTERS;
		if (!fittersJson) {
			console.warn("VITE_FITTERS environment variable not set, using fallback");
			return [
				{
					fullName: "Default Fitter",
					email: "email@email.com",
					phone: "+385 00 000 0000",
				},
			];
		}
		return JSON.parse(fittersJson) as Fitter[];
	} catch (error) {
		console.error("Failed to parse VITE_FITTERS:", error);
		return [
			{
				fullName: "Default Fitter",
				email: "email@email.com",
				phone: "+385 00 000 0000",
			},
		];
	}
})();

export const cyclingExperienceLevel = [
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
	cyclingExperienceYears: Array.from({ length: 20 }, (_, i) => i * 2 + 1), // 1-40 years in 2 years steps
	ischialTuberosity: Array.from({ length: 15 }, (_, i) => 80 + i * 5), // 80-150mm in 5mm steps
	height: Array.from({ length: 13 }, (_, i) => 150 + i * 5), // 150-210cm in 5cm steps
	inseam: Array.from({ length: 6 }, (_, i) => 65 + i * 5), // 65-95 in 5cm steps
	shoulderWidth: Array.from({ length: 12 }, (_, i) => 35 + i * 5), // 35-90 in 5cm steps
	footLength: Array.from({ length: 10 }, (_, i) => 220 + i * 10), // 220-320mm in 10mm steps
	footWidth: Array.from({ length: 10 }, (_, i) => 80 + i * 10), // 80-180mm in 10mm steps
	hamstringROM: Array.from({ length: 19 }, (_, i) => i * 5), // 0-90° in 5° steps
	shoulderROM: Array.from({ length: 37 }, (_, i) => i * 5), // 0-180° in 5° steps
	hipROM: Array.from({ length: 37 }, (_, i) => i * 5), // 0-180° in 5° steps
	ankleROMPlantar: Array.from({ length: 15 }, (_, i) => -20 + i * 5), // -20 to +50° in 5° steps
	ankleROMDorsal: Array.from({ length: 15 }, (_, i) => -20 + i * 5), // -20 to +50° in 5° steps
	qAngle: Array.from({ length: 26 }, (_, i) => i), // 0-25° in 1° steps
	legLengthDiscrepancyDifference: Array.from({ length: 17 }, (_, i) => i * 3), // 0-50mm in 3mm steps
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
	footbed: Array.from({ length: 6 }, (_, i) => i), // 0-5 in 1 step
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

export const bikeTypes = [
	"Road",
	"Gravel",
	"Mountain",
	"Hybrid",
	"Electric",
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
	cyclingExperienceLevel: "Professional",
	cyclingExperienceYears: 5,
	cyclingFrequency: "9-10",
	cyclingProblem: "",
	cyclingConcerns: "",
	// Step 1: Full Body Assessment (defaults to middle of ranges)
	ischialTuberosity: 115, // middle of 80-150
	height: 170, // middle of 150-210,
	inseam: 80, // middle of 65-95,
	shoulderWidth: 40, // middle of 35-90,
	footLengthLeft: 260,
	footLengthRight: 260,
	footWidthLeft: 100,
	footWidthRight: 100,
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
	hamstringROMLeft: 60, // middle of 0-90
	hamstringROMRight: 60,
	hipROMLeft: 100, // middle of 0-180
	hipROMRight: 100,
	advPassiveHipROMLeft: "",
	advPassiveHipROMRight: "",
	advQAngle: 12, // middle of 0-25
	legLengthDiscrepancy: "none",
	legLengthDiscrepancyDifference: 0,
	pelvicRotation: "",

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
	bikeType: "Road",
	bikeSize: "",
	bikeModel: "",
	bikeYear: currentYear,
	saddleBrand: "",
	saddleModel: "",
	saddleWidth: 140, // middle of 120-160
	shoeBrand: "",
	shoeSize: 42, // middle of 35-50
	saddleHeight: 725, // middle of 600-850
	saddleOffset: 0, // middle of -50 to 50
	handlebarWidth: 42, // middle of common sizes
	stemLength: 95, // middle of 60-130
	stemAngle: -7,
	reachToHandlebar: 450, // middle of 350-550
	reachToGrips: 550, // middle of 450-650
	reachToHoods: 425, // middle of 350-500
	barDropFromSaddle: -30, // middle of -60 to 0
	pedalsBrand: "Shimano",
	footbedLeft: 0,
	footbedRight: 0,
	crankLength: 172.5, // common default
	initialRiderPhoto: "", // Initial bike measurement rider photo

	// Step 3: Final Bike Measurement
	finalBikeBrand: "Trek",
	finalBikeType: "Road",
	finalBikeModel: "",
	finalBikeSize: "",
	finalBikeYear: currentYear,
	finalSaddleBrand: "",
	finalSaddleModel: "",
	finalSaddleWidth: 140, // middle of 120-160
	finalShoeBrand: "",
	finalShoeSize: 42, // middle of 35-50
	finalSaddleHeight: 725, // middle of 600-850
	finalSaddleOffset: 0, // middle of -50 to 50
	finalHandlebarWidth: 42, // middle of common sizes
	finalStemLength: 95, // middle of 60-130
	finalStemAngle: 6, // middle of -17 to 30
	finalReachToHandlebar: 450, // middle of 350-550
	finalReachToGrips: 550, // middle of 450-650
	finalReachToHoods: 425, // middle of 350-500
	finalBarDropFromSaddle: -30, // middle of -60 to 0
	finalPedalsBrand: "Shimano",
	finalFootbedLeft: 0,
	finalFootbedRight: 0,
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
