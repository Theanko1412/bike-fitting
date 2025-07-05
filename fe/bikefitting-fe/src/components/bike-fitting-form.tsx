import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FormSaveIndicator } from "@/components/ui/form-save-indicator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getDefaultFormData, steps } from "@/config/form-config";
import {
	FORM_VERSION,
	STORAGE_KEY,
	useFormPersistence,
} from "@/hooks/useFormPersistence";
import { useVisibilityChange } from "@/hooks/useVisibilityChange";
import { isFormDataModified } from "@/utils/debugFormPersistence";
import { FinalBikeMeasurementStep } from "./steps/final-bike-measurement-step";
import { FullBodyAssessmentStep } from "./steps/full-body-assessment-step";
import { GeneralInformationStep } from "./steps/general-information-step";
import { InitialBikeMeasurementStep } from "./steps/initial-bike-measurement-step";
import { ShoeSetupStep } from "./steps/shoe-setup-step";

export function BikeFittingForm() {
	const [currentStep, setCurrentStep] = useState(0);
	const [hasPopulatedStep3, setHasPopulatedStep3] = useState(false);
	const [formData, setFormData] = useState(getDefaultFormData());
	const [isAutoSaving, setIsAutoSaving] = useState(false);
	const [showRestorePrompt, setShowRestorePrompt] = useState(false);

	const {
		saveFormData,
		loadFormData,
		clearFormData,
		hasStoredData,
		getStoredDataAge,
	} = useFormPersistence();

	// Check for stored data on component mount (only once)
	useEffect(() => {
		const checkStoredData = () => {
			const hasStored = hasStoredData();

			if (hasStored) {
				setShowRestorePrompt(true);
			} else {
				setShowRestorePrompt(false);
			}
		};

		// Small delay to ensure component is fully mounted
		const timer = setTimeout(checkStoredData, 100);
		return () => clearTimeout(timer);
	}, []);

	// Auto-save form data when it changes
	useEffect(() => {
		// Don't save if we're showing restore prompt (user hasn't decided yet)
		if (showRestorePrompt) {
			return;
		}

		// Skip saving if this is the initial default data (no user changes yet)
		if (!isFormDataModified(formData)) {
			return;
		}

		// Save to localStorage after 30 seconds and show "Saved" when complete
		saveFormData(formData, () => {
			setIsAutoSaving(true);
			setTimeout(() => setIsAutoSaving(false), 2000); // Show "Saved" for 2 seconds
		});
	}, [formData, saveFormData, showRestorePrompt]);

	// Handle restoring data from storage
	const handleRestoreData = () => {
		const storedData = loadFormData();
		if (storedData) {
			setShowRestorePrompt(false);
			// Set form data after hiding prompt to prevent auto-save during restore
			setTimeout(() => {
				setFormData(storedData);
			}, 50);
		}
	};

	// Handle discarding stored data
	const handleDiscardData = () => {
		clearFormData();
		setShowRestorePrompt(false);
	};

	// Save data when user leaves the app (switch tabs, close browser, etc.)
	useVisibilityChange(() => {
		if (!showRestorePrompt && isFormDataModified(formData)) {
			// Force immediate save when leaving the app
			try {
				const storageData = {
					data: formData,
					timestamp: Date.now(),
					version: FORM_VERSION,
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
			} catch (error) {
				console.warn("Failed to save form data on visibility change:", error);
			}
		}
	});

	const nextStep = () => {
		const newStep = Math.min(currentStep + 1, steps.length - 1);

		// Copy step 2 values to step 3 when moving to step 3 (only once per form session)
		if (currentStep === 2 && newStep === 3 && !hasPopulatedStep3) {
			setFormData((prev) => ({
				...prev,
				finalBikeBrand: prev.bikeBrand,
				finalBikeModel: prev.bikeModel,
				finalBikeYear: prev.bikeYear,
				finalSaddleBrand: prev.saddleBrand,
				finalSaddleModel: prev.saddleModel,
				finalSaddleWidth: prev.saddleWidth,
				finalShoeBrand: prev.shoeBrand,
				finalShoeSize: prev.shoeSize,
				finalSaddleHeight: prev.saddleHeight,
				finalSaddleOffset: prev.saddleOffset,
				finalSaddleDirection: prev.saddleDirection,
				finalHandlebarWidth: prev.handlebarWidth,
				finalStemLength: prev.stemLength,
				finalStemAngle: prev.stemAngle,
				finalReachToHandlebar: prev.reachToHandlebar,
				finalReachToGrips: prev.reachToGrips,
				finalReachToHoods: prev.reachToHoods,
				finalBarDropFromSaddle: prev.barDropFromSaddle,
				finalPedalsBrand: prev.pedalsBrand,
				finalFootbedLeft: prev.footbedLeft,
				finalFootbedRight: prev.footbedRight,
				finalCrankLength: prev.crankLength,
			}));
			setHasPopulatedStep3(true);
		}

		setCurrentStep(newStep);
		// Scroll to top when moving to next step
		window.scrollTo(0, 0);
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
		// Scroll to top when moving to previous step
		window.scrollTo(0, 0);
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = () => {
		console.log("Form submitted:", formData);
		alert("Bike fitting form submitted successfully!");

		// Clear stored data after successful submission
		clearFormData();

		// Reset the population flag for next form session
		setHasPopulatedStep3(false);

		// Reset form to initial state
		setFormData(getDefaultFormData());
		setCurrentStep(0);
	};

	const progress = (currentStep / (steps.length - 1)) * 100;

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			{/* Form save indicator */}
			<FormSaveIndicator
				isAutoSaving={isAutoSaving}
				hasStoredData={showRestorePrompt}
				storedDataAge={getStoredDataAge()}
				onRestoreData={handleRestoreData}
				onDiscardData={handleDiscardData}
			/>

			<div className="flex-1 flex flex-col p-4 pb-32">
				<div className="w-full max-w-[500px] mx-auto flex-1 flex flex-col">
					<Card className="flex-1 flex flex-col pt-0 pb-4">
						<CardHeader className="pt-6 pb-4 flex-shrink-0 top-0 z-10">
							<CardTitle className="text-xl">
								{steps[currentStep].title}
							</CardTitle>
							<CardDescription>
								Step {currentStep} of {steps.length - 1}
							</CardDescription>
							<Progress value={progress} className="w-full" />
						</CardHeader>

						<CardContent className="flex-1 flex flex-col p-0">
							<ScrollArea className="flex-1 px-4">
								<div className="space-y-6 pb-4">
									{/* Step 0: General Information */}
									{currentStep === 0 && (
										<GeneralInformationStep
											formData={formData}
											handleInputChange={handleInputChange}
										/>
									)}

									{/* Step 1: Full Body Assessment */}
									{currentStep === 1 && (
										<FullBodyAssessmentStep
											formData={formData}
											handleInputChange={handleInputChange}
										/>
									)}

									{/* Step 2: Initial Bike Measurement */}
									{currentStep === 2 && (
										<InitialBikeMeasurementStep
											formData={formData}
											handleInputChange={handleInputChange}
										/>
									)}

									{/* Step 3: Final Bike Measurement */}
									{currentStep === 3 && (
										<FinalBikeMeasurementStep
											formData={formData}
											handleInputChange={handleInputChange}
										/>
									)}

									{/* Step 4: Shoe Setup */}
									{currentStep === 4 && (
										<ShoeSetupStep
											formData={formData}
											handleInputChange={handleInputChange}
										/>
									)}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Fixed Navigation Buttons at Bottom */}
			<div className="bg-white/60 dark:bg-black/60 backdrop-blur-md fixed bottom-0 left-0 right-0 py-2">
				<div className="w-full max-w-[500px] mx-auto px-4">
					<Progress value={progress} className="w-full mb-2" />
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={prevStep}
							disabled={currentStep === 0}
							size="lg"
							className="flex-1"
						>
							<ChevronLeft className="w-4 h-4 mr-2" />
							Previous
						</Button>

						{currentStep === steps.length - 1 ? (
							<Button onClick={handleSubmit} size="lg" className="flex-[5]">
								Submit
							</Button>
						) : (
							<Button onClick={nextStep} size="lg" className="flex-[5]">
								Next
								<ChevronRight className="w-4 h-4 ml-2" />
							</Button>
						)}
					</div>
					<div className="flex flex-col items-center align-center p-2">
						<h1 className="leading-none font-semibold">
							{steps[currentStep].title}
						</h1>
						<p className="text-muted-foreground text-sm">
							Step {currentStep} of {steps.length - 1}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
