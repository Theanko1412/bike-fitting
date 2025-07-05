import { HybridSelector } from "@/components/ui/hybrid-selector";
import { Label } from "@/components/ui/label";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { ranges } from "@/config/form-config";

interface ShoeSetupStepProps {
	formData: any;
	handleInputChange: (field: string, value: any) => void;
}

export function ShoeSetupStep({
	formData,
	handleInputChange,
}: ShoeSetupStepProps) {
	return (
		<>
			<div className="space-y-2">
				<Label className="text-base font-medium">Forefoot Wedge</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "none", label: "None" },
								{ value: "1-wedge", label: "1 Wedge" },
								{ value: "2-wedges", label: "2 Wedges" },
							]}
							value={formData.forefootWedgeLeft}
							onChange={(value) =>
								handleInputChange("forefootWedgeLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "none", label: "None" },
								{ value: "1-wedge", label: "1 Wedge" },
								{ value: "2-wedges", label: "2 Wedges" },
							]}
							value={formData.forefootWedgeRight}
							onChange={(value) =>
								handleInputChange("forefootWedgeRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Cleat Wedge</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "none", label: "None" },
								{ value: "1-wedge", label: "1 Wedge" },
								{ value: "2-wedges", label: "2 Wedges" },
							]}
							value={formData.cleatWedgeLeft}
							onChange={(value) => handleInputChange("cleatWedgeLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "none", label: "None" },
								{ value: "1-wedge", label: "1 Wedge" },
								{ value: "2-wedges", label: "2 Wedges" },
							]}
							value={formData.cleatWedgeRight}
							onChange={(value) => handleInputChange("cleatWedgeRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Cleat Rotation</Label>
				<div className="grid grid-cols-2 gap-4">
					<HybridSelector
						label="Left"
						value={formData.cleatRotationLeft}
						onChange={(value) => handleInputChange("cleatRotationLeft", value)}
						options={ranges.cleatRotation}
						unit="°"
					/>
					<HybridSelector
						label="Right"
						value={formData.cleatRotationRight}
						onChange={(value) => handleInputChange("cleatRotationRight", value)}
						options={ranges.cleatRotation}
						unit="°"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Cleat Lateral Placement</Label>
				<div className="grid grid-cols-2 gap-4">
					<HybridSelector
						label="Left"
						value={formData.cleatLateralLeft}
						onChange={(value) => handleInputChange("cleatLateralLeft", value)}
						options={ranges.cleatLateral}
						unit="mm"
					/>
					<HybridSelector
						label="Right"
						value={formData.cleatLateralRight}
						onChange={(value) => handleInputChange("cleatLateralRight", value)}
						options={ranges.cleatLateral}
						unit="mm"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Cleat For/Aft Placement</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "neutral", label: "Neutral" },
								{ value: "forward", label: "Forward" },
								{ value: "backward", label: "Backward" },
							]}
							value={formData.cleatForAftPlacementLeft}
							onChange={(value) =>
								handleInputChange("cleatForAftPlacementLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "neutral", label: "Neutral" },
								{ value: "forward", label: "Forward" },
								{ value: "backward", label: "Backward" },
							]}
							value={formData.cleatForAftPlacementRight}
							onChange={(value) =>
								handleInputChange("cleatForAftPlacementRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Cleat Lift</Label>
				<div className="grid grid-cols-2 gap-4">
					<HybridSelector
						label="Left"
						value={formData.cleatLiftLeft}
						onChange={(value) => handleInputChange("cleatLiftLeft", value)}
						options={ranges.cleatLift}
						unit="mm"
					/>
					<HybridSelector
						label="Right"
						value={formData.cleatLiftRight}
						onChange={(value) => handleInputChange("cleatLiftRight", value)}
						options={ranges.cleatLift}
						unit="mm"
					/>
				</div>
			</div>
		</>
	);
}
