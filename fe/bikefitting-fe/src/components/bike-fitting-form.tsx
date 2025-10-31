import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { BikeFittingService } from "../services/bikeFittingService";
import { SubmissionFailureDialog } from "./SubmissionFailureDialog";
import { FinalBikeMeasurementStep } from "./steps/final-bike-measurement-step";
import { FullBodyAssessmentStep } from "./steps/full-body-assessment-step";
import { GeneralInformationStep } from "./steps/general-information-step";
import { InitialBikeMeasurementStep } from "./steps/initial-bike-measurement-step";
import { ShoeSetupStep } from "./steps/shoe-setup-step";

export function BikeFittingForm() {
	const [currentStep, setCurrentStep] = useState(0);
	const [hasPopulatedStep3, setHasPopulatedStep3] = useState(false);
	const [formData, setFormData] = useState(() => {
		const defaults = getDefaultFormData();
		// Ensure all photo fields are explicitly set
		return {
			...defaults,
			initialRiderPhoto: defaults.initialRiderPhoto || "",
			forwardSpinalFlexionPhoto: defaults.forwardSpinalFlexionPhoto || "",
			finalRiderPhoto: defaults.finalRiderPhoto || "",
		};
	});
	const [isAutoSaving, setIsAutoSaving] = useState(false);
	const [showRestorePrompt, setShowRestorePrompt] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showFailureDialog, setShowFailureDialog] = useState(false);
	const [failureError, setFailureError] = useState("");
	const [failedFormData, setFailedFormData] = useState<any>(null);
	const navigate = useNavigate();

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
				// Normalize restored data to ensure all fields are present
				const normalizedData = normalizeFormData(storedData);
				setFormData(normalizedData);
			}, 50);
		}
	};

	// Handle discarding stored data
	const handleDiscardData = () => {
		clearFormData();
		setShowRestorePrompt(false);
		// Reset form data to defaults to prevent false positive modifications
		setFormData(() => {
			const defaults = getDefaultFormData();
			// Ensure all photo fields are explicitly set
			return {
				...defaults,
				initialRiderPhoto: defaults.initialRiderPhoto || "",
				forwardSpinalFlexionPhoto: defaults.forwardSpinalFlexionPhoto || "",
				finalRiderPhoto: defaults.finalRiderPhoto || "",
			};
		});
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
				finalBikeType: prev.bikeType,
				finalBikeModel: prev.bikeModel,
				finalBikeSize: prev.bikeSize,
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

	const handleHomeNavigation = () => {
		// Check if user has made any changes to the form
		if (isFormDataModified(formData)) {
			// Force immediate save before navigating home (same as visibility change logic)
			try {
				const storageData = {
					data: formData,
					timestamp: Date.now(),
					version: FORM_VERSION,
				};
				localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));

				toast.info("Form progress saved", {
					description:
						"Your changes have been saved and you can continue later",
					duration: 5000,
				});
			} catch (error) {
				console.warn("Failed to save form data before home navigation:", error);
				toast.error("Failed to save progress", {
					description: "There was an error saving your changes",
					duration: 5000,
				});
			}
		}

		// Navigate to home
		navigate({ to: "/" });
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Ensure all required fields are present before submission
	const normalizeFormData = (data: any) => {
		const defaults = getDefaultFormData();
		const normalized = { ...defaults, ...data };

		// Ensure photo fields are always strings (never undefined)
		normalized.initialRiderPhoto = normalized.initialRiderPhoto || "";
		normalized.forwardSpinalFlexionPhoto =
			normalized.forwardSpinalFlexionPhoto || "";
		normalized.finalRiderPhoto = normalized.finalRiderPhoto || "";

		return normalized;
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);

		try {
			// Normalize form data to ensure all required fields are present
			const normalizedData = normalizeFormData(formData);
			// Submit to backend using service layer
			const response = await BikeFittingService.submitForm(normalizedData);

			// Show success notification
			toast.success("Form submitted successfully!", {
				duration: 5000,
			});

			// Clear stored data after successful submission
			clearFormData();

			// Reset the population flag for next form session
			setHasPopulatedStep3(false);

			// Reset form to initial state
			setFormData(getDefaultFormData());
			setCurrentStep(0);

			// Navigate to the view page
			navigate({ to: `/view/${response.id}` });
		} catch (error) {
			console.error("Form submission failed:", error);

			const errorMessage =
				error instanceof Error ? error.message : "An unexpected error occurred";

			// Check if this is a validation error (BAD_REQUEST)
			// Backend provides proper validation feedback, so just show toast
			const isBadRequest = errorMessage.startsWith("BAD_REQUEST:");

			if (isBadRequest) {
				// Show warning toast for validation errors - backend handles these properly
				// Remove the "BAD_REQUEST: " prefix from the message
				const cleanMessage = errorMessage.replace("BAD_REQUEST: ", "");
				toast.warning("Validation failed", {
					description: cleanMessage,
					duration: 5000,
				});
			} else {
				// For all other errors (network, server errors, etc.) show failure dialog
				const normalizedData = normalizeFormData(formData);
				setFailedFormData(normalizedData);
				setFailureError(errorMessage);
				setShowFailureDialog(true);

				// Also show toast notification that request failed
				toast.error("Request failed", {
					description: errorMessage,
					duration: 5000,
				});
			}
		} finally {
			setIsSubmitting(false);
		}
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
						{currentStep === 0 ? (
							<Button
								variant="outline"
								onClick={handleHomeNavigation}
								size="lg"
								className="flex-1"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Home
							</Button>
						) : (
							<Button
								variant="outline"
								onClick={prevStep}
								size="lg"
								className="flex-1"
							>
								<ChevronLeft className="w-4 h-4 mr-2" />
								Previous
							</Button>
						)}

						{currentStep === steps.length - 1 ? (
							<Button
								onClick={handleSubmit}
								size="lg"
								className="flex-[5]"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Submit"}
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

			{/* Submission Failure Dialog */}
			<SubmissionFailureDialog
				open={showFailureDialog}
				onOpenChange={setShowFailureDialog}
				formData={failedFormData}
				error={failureError}
			/>
		</div>
	);
}
