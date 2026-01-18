import { useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export const NumberInput = ({
	label,
	value,
	onChange,
	unit = "",
	min,
	max,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	unit?: string;
	min?: number;
	max?: number;
}) => {
	const [inputValue, setInputValue] = useState(value.toString());

	// Sync input value when prop changes (e.g., from +/- buttons)
	useEffect(() => {
		setInputValue(value.toString());
	}, [value]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		
		// Allow empty string while typing
		if (val === "") {
			setInputValue("");
			return;
		}
		
		// Only allow numeric input (digits only)
		if (!/^\d*$/.test(val)) {
			return; // Prevent non-numeric input
		}
		
		const numValue = Number.parseFloat(val);
		if (!isNaN(numValue)) {
			// If value exceeds max, clamp it immediately
			if (max !== undefined && numValue > max) {
				setInputValue(max.toString());
				onChange(max);
				return;
			}
			
			// Allow values below min while typing (so user can type multi-digit numbers)
			// We'll enforce min on blur
			setInputValue(val);
			onChange(numValue);
		} else {
			// Invalid number, don't update
			setInputValue(val);
		}
	};

	const handleBlur = () => {
		// Parse and validate on blur
		if (inputValue === "") {
			// Reset to current value if empty
			setInputValue(value.toString());
		} else {
			const numValue = Number.parseFloat(inputValue);
			if (isNaN(numValue)) {
				// Reset to current value if invalid
				setInputValue(value.toString());
			} else {
				// Ensure value is within bounds
				let finalValue = numValue;
				if (min !== undefined && finalValue < min) {
					finalValue = min;
				} else if (max !== undefined && finalValue > max) {
					finalValue = max;
				}
				onChange(finalValue);
				setInputValue(finalValue.toString());
			}
		}
	};

	const handleDecrement = () => {
		const newValue = value - 1;
		if (min === undefined || newValue >= min) {
			onChange(newValue);
		} else {
			onChange(min);
		}
	};

	const handleIncrement = () => {
		const newValue = value + 1;
		if (max === undefined || newValue <= max) {
			onChange(newValue);
		} else {
			onChange(max);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-1">
				<Label className="text-base font-medium">{label}</Label>
			</div>
			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="icon"
					onClick={handleDecrement}
					disabled={min !== undefined && value <= min}
					className="h-12 w-12 flex-shrink-0"
				>
					-
				</Button>

				<div className="relative flex-1">
					<Input
						type="number"
						inputMode="numeric"
						min={min}
						max={max}
						value={inputValue}
						onChange={handleInputChange}
						onBlur={handleBlur}
						className="h-12 text-center text-lg font-medium pr-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
					/>
					{unit && (
						<span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-lg font-medium text-muted-foreground">
							{unit}
						</span>
					)}
				</div>

				<Button
					variant="outline"
					size="icon"
					onClick={handleIncrement}
					disabled={max !== undefined && value >= max}
					className="h-12 w-12 flex-shrink-0"
				>
					+
				</Button>
			</div>
		</div>
	);
};
