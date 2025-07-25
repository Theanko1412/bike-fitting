import { useState } from "react";
import { Button } from "./button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./drawer";
import { Input } from "./input";
import { Label } from "./label";

export const HybridSelector = ({
	label,
	value,
	onChange,
	options,
	unit = "",
}: {
	label: string;
	value: number | string;
	onChange: (value: number | string) => void;
	options: (number | string)[];
	unit?: string;
}) => {
	const [customValue, setCustomValue] = useState("");
	const [isCustomEditing, setIsCustomEditing] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const isNumericMode = typeof value === "number";
	const numericOptions = isNumericMode ? (options as number[]) : [];
	const min = isNumericMode ? Math.min(...numericOptions) : 0;
	const max = isNumericMode ? Math.max(...numericOptions) : 0;

	const handleCustomSubmit = () => {
		if (isNumericMode) {
			const val = Number.parseFloat(customValue);
			if (val >= min && val <= max) {
				onChange(val);
				setCustomValue("");
				setIsCustomEditing(false);
				setIsDrawerOpen(false);
			}
		} else {
			// String mode - just accept any text input
			if (customValue.trim()) {
				onChange(customValue.trim());
				setCustomValue("");
				setIsCustomEditing(false);
				setIsDrawerOpen(false);
			}
		}
	};

	const handleCustomKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleCustomSubmit();
		} else if (e.key === "Escape") {
			setCustomValue("");
			setIsCustomEditing(false);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-1">
				<Label className="text-base font-medium">{label}</Label>
			</div>
			<div className="flex items-center gap-1">
				{isNumericMode && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => onChange(Math.max(min, (value as number) - 1))}
						disabled={(value as number) <= min}
						className="h-12 w-12 flex-shrink-0"
					>
						-
					</Button>
				)}

				<Drawer
					open={isDrawerOpen}
					onOpenChange={(open) => {
						setIsDrawerOpen(open);
						if (!open) {
							setIsCustomEditing(false);
							setCustomValue("");
						}
					}}
				>
					<Button
						variant="outline"
						className="flex-1 h-12 justify-center px-3"
						onClick={() => setIsDrawerOpen(true)}
					>
						<span className="text-lg font-medium">
							{value}
							{unit}
						</span>
					</Button>
					<DrawerContent className="max-h-[80vh] flex flex-col pb-4">
						<DrawerHeader>
							<DrawerTitle>{label}</DrawerTitle>
						</DrawerHeader>
						<div className="flex-1 overflow-y-auto px-4 pb-4">
							<div className="grid grid-cols-4 gap-2">
								{options.map((option) => (
									<Button
										key={option}
										variant={value === option ? "default" : "outline"}
										className="h-12"
										onClick={() => {
											onChange(option);
											setIsDrawerOpen(false);
										}}
									>
										{option}
										{unit}
									</Button>
								))}
								{isCustomEditing ? (
									<div className="relative">
										<Input
											type={isNumericMode ? "number" : "text"}
											min={isNumericMode ? min : undefined}
											max={isNumericMode ? max : undefined}
											value={customValue}
											onChange={(e) => setCustomValue(e.target.value)}
											onKeyDown={handleCustomKeyDown}
											onBlur={() => {
												if (customValue) {
													handleCustomSubmit();
												} else {
													setIsCustomEditing(false);
												}
											}}
											placeholder={
												isNumericMode ? `${min}-${max}` : "Enter custom value"
											}
											className="h-12 text-center"
											autoFocus
										/>
									</div>
								) : (
									<Button
										variant="outline"
										className="h-12"
										onClick={() => setIsCustomEditing(true)}
									>
										Custom
									</Button>
								)}
							</div>
						</div>
					</DrawerContent>
				</Drawer>

				{isNumericMode && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => onChange(Math.min(max, (value as number) + 1))}
						disabled={(value as number) >= max}
						className="h-12 w-12 flex-shrink-0"
					>
						+
					</Button>
				)}
			</div>
		</div>
	);
};
