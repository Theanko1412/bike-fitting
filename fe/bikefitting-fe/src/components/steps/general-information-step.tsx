import { DatePicker } from "@/components/ui/date-picker";
import { HybridSelector } from "@/components/ui/hybrid-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
	cyclingExperience,
	cyclingFrequency,
	fitters,
} from "@/config/form-config";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GeneralInformationStepProps {
	formData: any;
	handleInputChange: (field: string, value: any) => void;
	onValidationChange?: (isValid: boolean) => void;
}

export function GeneralInformationStep({
	formData,
	handleInputChange,
	onValidationChange,
}: GeneralInformationStepProps) {
	const [validationErrors, setValidationErrors] = useState<{
		fullName?: string;
		email?: string;
	}>({});

	// Email validation regex
	const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

	const validateFullName = (value: string): string | undefined => {
		if (!value || value.trim().length === 0) {
			return "Full name is required";
		}
		return undefined;
	};

	const validateEmail = (value: string): string | undefined => {
		if (!value || value.trim().length === 0) {
			return "Email is required";
		}
		if (!emailRegex.test(value)) {
			return "Please enter a valid email address";
		}
		return undefined;
	};

	const handleFieldChange = (field: string, value: any) => {
		// Update the form data
		handleInputChange(field, value);

		// Validate the specific field
		if (field === "fullName") {
			const error = validateFullName(value);
			setValidationErrors((prev) => ({
				...prev,
				fullName: error,
			}));
		} else if (field === "email") {
			const error = validateEmail(value);
			setValidationErrors((prev) => ({
				...prev,
				email: error,
			}));
		}
	};

	// Check validation status and notify parent
	useEffect(() => {
		const fullNameError = validateFullName(formData.fullName);
		const emailError = validateEmail(formData.email);

		const isValid = !fullNameError && !emailError;

		// Update validation errors if needed
		setValidationErrors({
			fullName: fullNameError,
			email: emailError,
		});

		// Notify parent of validation status
		if (onValidationChange) {
			onValidationChange(isValid);
		}
	}, [formData.fullName, formData.email, onValidationChange]);

	return (
		<>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Date</Label>
				<DatePicker
					value={formData.date}
					onChange={(date) => handleInputChange("date", date)}
					placeholder="Select date"
				/>
			</div>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Full Name</Label>
				<Input
					value={formData.fullName}
					onChange={(e) => handleFieldChange("fullName", e.target.value)}
					placeholder="Name Surname"
					className={cn(
						"h-12",
						validationErrors.fullName &&
							"border-red-500 focus-visible:ring-red-500",
					)}
				/>
				{validationErrors.fullName && (
					<p className="text-sm text-red-500">{validationErrors.fullName}</p>
				)}
			</div>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Email</Label>
				<Input
					value={formData.email}
					onChange={(e) => handleFieldChange("email", e.target.value)}
					placeholder="Email"
					type="email"
					autoComplete="username"
					autoCapitalize="none"
					autoCorrect="off"
					spellCheck="false"
					className={cn(
						"h-12",
						validationErrors.email &&
							"border-red-500 focus-visible:ring-red-500",
					)}
				/>
				{validationErrors.email && (
					<p className="text-sm text-red-500">{validationErrors.email}</p>
				)}
			</div>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Phone</Label>
				<PhoneInput
					value={formData.phone}
					onChange={(value) => handleInputChange("phone", value)}
					placeholder="Country code added automatically"
					defaultCountry="HR"
					international={false}
					className="h-12"
				/>
			</div>
			<div className="space-y-2">
				<ToggleGroup
					label="Fitter"
					options={fitters.map((fitter) => ({
						value: fitter,
						label: fitter.fullName,
					}))}
					value={formData.fitter}
					onChange={(value) => handleInputChange("fitter", value)}
				/>
			</div>
			<div className="space-y-2">
				<HybridSelector
					label="Cycling Experience"
					value={formData.cyclingExperience}
					onChange={(value) => handleInputChange("cyclingExperience", value)}
					options={cyclingExperience}
					unit=""
				/>
			</div>
			<div className="space-y-2">
				<HybridSelector
					label="Cycling Frequency per week"
					value={formData.cyclingFrequency}
					onChange={(value) => handleInputChange("cyclingFrequency", value)}
					options={cyclingFrequency}
					unit=""
				/>
			</div>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Cycling Problem</Label>
				<Input
					value={formData.cyclingProblem}
					onChange={(e) => handleInputChange("cyclingProblem", e.target.value)}
					placeholder="Enter cycling problem"
					className="h-12"
				/>
			</div>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Cycling Concerns</Label>
				<Input
					value={formData.cyclingConcerns}
					onChange={(e) => handleInputChange("cyclingConcerns", e.target.value)}
					placeholder="Enter cycling concerns"
					className="h-12"
				/>
			</div>
		</>
	);
}
