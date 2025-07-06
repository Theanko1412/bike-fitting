import { Button } from "./button";
import { Label } from "./label";

export const ToggleGroup = ({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: { value: any; label: string }[];
	value: any;
	onChange: (value: any) => void;
}) => {
	// Helper function to compare values (handles objects and primitives)
	const isSelected = (optionValue: any, currentValue: any) => {
		// If both are objects, compare by fullName property (for fitter objects)
		if (
			typeof optionValue === "object" &&
			typeof currentValue === "object" &&
			optionValue !== null &&
			currentValue !== null &&
			"fullName" in optionValue &&
			"fullName" in currentValue
		) {
			return optionValue.fullName === currentValue.fullName;
		}
		// Otherwise use strict equality
		return optionValue === currentValue;
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Label className="text-base font-medium">{label}</Label>
			</div>
			<div className="flex flex-col gap-2">
				{options.map((option, index) => (
					<Button
						key={index}
						variant={isSelected(option.value, value) ? "default" : "outline"}
						onClick={() => onChange(option.value)}
						className="justify-start h-12 text-left"
					>
						{option.label}
					</Button>
				))}
			</div>
		</div>
	);
};
