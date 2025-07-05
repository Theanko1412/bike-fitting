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

interface GeneralInformationStepProps {
	formData: any;
	handleInputChange: (field: string, value: any) => void;
}

export function GeneralInformationStep({
	formData,
	handleInputChange,
}: GeneralInformationStepProps) {
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
					onChange={(e) => handleInputChange("fullName", e.target.value)}
					placeholder="Name Surname"
					className="h-12"
				/>
			</div>
			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Email</Label>
				<Input
					value={formData.email}
					onChange={(e) => handleInputChange("email", e.target.value)}
					placeholder="Email"
					className="h-12"
				/>
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
