import { HybridSelector } from "@/components/ui/hybrid-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { forefootAngulationTypes, ranges } from "@/config/form-config";
import { bikeFittingImageToBase64 } from "@/lib/utils";

interface FullBodyAssessmentStepProps {
	formData: any;
	handleInputChange: (field: string, value: any) => void;
}

export function FullBodyAssessmentStep({
	formData,
	handleInputChange,
}: FullBodyAssessmentStepProps) {
	return (
		<>
			<HybridSelector
				label="Ischial Tuberosity Width"
				value={formData.ischialTuberosity}
				onChange={(value) => handleInputChange("ischialTuberosity", value)}
				options={ranges.ischialTuberosity}
				unit="mm"
			/>

			<HybridSelector
				label="Height"
				value={formData.height}
				onChange={(value) => handleInputChange("height", value)}
				options={ranges.height}
				unit="cm"
			/>

			<HybridSelector
				label="Inseam"
				value={formData.inseam}
				onChange={(value) => handleInputChange("inseam", value)}
				options={ranges.inseam}
				unit="cm"
			/>

			<HybridSelector
				label="Shoulder width"
				value={formData.shoulderWidth}
				onChange={(value) => handleInputChange("shoulderWidth", value)}
				options={ranges.shoulderWidth}
				unit="cm"
			/>

			<div className="space-y-2">
				<Label className="text-base font-medium">Foot Length</Label>
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.footLengthLeft}
						onChange={(value) => handleInputChange("footLengthLeft", value)}
						options={ranges.footLength}
						unit="mm"
					/>
					<HybridSelector
						label="Right"
						value={formData.footLengthRight}
						onChange={(value) => handleInputChange("footLengthRight", value)}
						options={ranges.footLength}
						unit="mm"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Foot Width</Label>
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.footWidthLeft}
						onChange={(value) => handleInputChange("footWidthLeft", value)}
						options={ranges.footWidth}
						unit="mm"
					/>
					<HybridSelector
						label="Right"
						value={formData.footWidthRight}
						onChange={(value) => handleInputChange("footWidthRight", value)}
						options={ranges.footWidth}
						unit="mm"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Forefoot Angulation Type
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<HybridSelector
							label=""
							value={formData.forefootAngulationTypeLeft}
							onChange={(value) =>
								handleInputChange("forefootAngulationTypeLeft", value)
							}
							options={forefootAngulationTypes}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<HybridSelector
							label=""
							value={formData.forefootAngulationTypeRight}
							onChange={(value) =>
								handleInputChange("forefootAngulationTypeRight", value)
							}
							options={forefootAngulationTypes}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Forefoot Angulation Severity
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.forefootAngulationSeverityLeft}
							onChange={(value) =>
								handleInputChange("forefootAngulationSeverityLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.forefootAngulationSeverityRight}
							onChange={(value) =>
								handleInputChange("forefootAngulationSeverityRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Rear Foot Structure</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "neutral", label: "Neutral" },
								{ value: "pronation", label: "Pronation" },
								{ value: "supination", label: "Supination" },
							]}
							value={formData.rearFootStructureLeft}
							onChange={(value) =>
								handleInputChange("rearFootStructureLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "neutral", label: "Neutral" },
								{ value: "pronation", label: "Pronation" },
								{ value: "supination", label: "Supination" },
							]}
							value={formData.rearFootStructureRight}
							onChange={(value) =>
								handleInputChange("rearFootStructureRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Neutral Arch Height</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "low", label: "Low" },
								{ value: "medium", label: "Medium" },
								{ value: "high", label: "High" },
							]}
							value={formData.neutralArchHeightLeft}
							onChange={(value) =>
								handleInputChange("neutralArchHeightLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "low", label: "Low" },
								{ value: "medium", label: "Medium" },
								{ value: "high", label: "High" },
							]}
							value={formData.neutralArchHeightRight}
							onChange={(value) =>
								handleInputChange("neutralArchHeightRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Lower Extremity Alignment
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "Normal", label: "Normal" },
								{ value: "Varus", label: "Varus" },
								{ value: "Valgus", label: "Valgus" },
							]}
							value={formData.lowerExtremityAlignmentLeft}
							onChange={(value) =>
								handleInputChange("lowerExtremityAlignmentLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "Normal", label: "Normal" },
								{ value: "Varus", label: "Varus" },
								{ value: "Valgus", label: "Valgus" },
							]}
							value={formData.lowerExtremityAlignmentRight}
							onChange={(value) =>
								handleInputChange("lowerExtremityAlignmentRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">
					Advanced Lower Extremity Alignment
				</Label>
				<ToggleGroup
					label=""
					options={[
						{ value: "Tibia", label: "Tibia" },
						{ value: "Curved", label: "Curved" },
						{ value: "Normal", label: "Normal" },
					]}
					value={formData.advLowerExtremityAlignment}
					onChange={(value) =>
						handleInputChange("advLowerExtremityAlignment", value)
					}
				/>
			</div>

			<ToggleGroup
				label="Level Pelvis"
				options={[
					{ value: "level", label: "Level" },
					{ value: "tilted-left", label: "Tilted Left" },
					{ value: "tilted-right", label: "Tilted Right" },
				]}
				value={formData.levelPelvis}
				onChange={(value) => handleInputChange("levelPelvis", value)}
			/>

			<ToggleGroup
				label="Spinal Curve Evaluation"
				options={[
					{ value: "normal", label: "Normal" },
					{ value: "kyphotic", label: "Kyphotic" },
					{ value: "lordotic", label: "Lordotic" },
					{ value: "scoliosis", label: "Scoliosis" },
				]}
				value={formData.spinalCurveEvaluation}
				onChange={(value) => handleInputChange("spinalCurveEvaluation", value)}
			/>

			<ToggleGroup
				label="Advanced Scapular Position (Type)"
				options={[
					{ value: "neutral", label: "Neutral" },
					{ value: "protracted", label: "Protracted" },
					{ value: "retracted", label: "Retracted" },
					{ value: "winged", label: "Winged" },
				]}
				value={formData.advScapularPositionType}
				onChange={(value) =>
					handleInputChange("advScapularPositionType", value)
				}
			/>

			<ToggleGroup
				label="Advanced Scapular Position (Severity)"
				options={[
					{ value: "normal", label: "Normal" },
					{ value: "mild", label: "Mild" },
					{ value: "moderate", label: "Moderate" },
					{ value: "severe", label: "Severe" },
				]}
				value={formData.advScapularPositionSeverity}
				onChange={(value) =>
					handleInputChange("advScapularPositionSeverity", value)
				}
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Forward Spinal Flexion</Label>
				<Input
					type="file"
					accept="image/*"
					placeholder="Upload photo"
					className="h-12"
					onChange={async (e) => {
						const file = e.target.files?.[0];
						if (file) {
							try {
								const base64 = await bikeFittingImageToBase64(file);
								handleInputChange("forwardSpinalFlexionPhoto", base64);
							} catch (error) {
								console.error("Error converting file to base64:", error);
							}
						} else {
							handleInputChange("forwardSpinalFlexionPhoto", "");
						}
					}}
				/>
				{formData.forwardSpinalFlexionPhoto && (
					<div className="mt-2">
						<img
							src={formData.forwardSpinalFlexionPhoto}
							alt="Forward spinal flexion photo"
							className="object-contain rounded border"
						/>
					</div>
				)}
			</div>

			<ToggleGroup
				label="Cervical Spine ROM"
				options={[
					{ value: "limited", label: "Limited" },
					{ value: "full", label: "Full" },
				]}
				value={formData.cervicalSpineROM}
				onChange={(value) => handleInputChange("cervicalSpineROM", value)}
			/>

			<ToggleGroup
				label="Shoulder ROM"
				options={[
					{ value: "limited", label: "Limited" },
					{ value: "full", label: "Full" },
				]}
				value={formData.shoulderROM}
				onChange={(value) => handleInputChange("shoulderROM", value)}
			/>

			<div className="space-y-2">
				<Label className="text-base font-medium">Hamstring ROM</Label>
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.hamstringROMLeft}
						onChange={(value) => handleInputChange("hamstringROMLeft", value)}
						options={ranges.hamstringROM}
						unit="°"
					/>
					<HybridSelector
						label="Right"
						value={formData.hamstringROMRight}
						onChange={(value) => handleInputChange("hamstringROMRight", value)}
						options={ranges.hamstringROM}
						unit="°"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Hip ROM</Label>
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.hipROMLeft}
						onChange={(value) => handleInputChange("hipROMLeft", value)}
						options={ranges.hipROM}
						unit="°"
					/>
					<HybridSelector
						label="Right"
						value={formData.hipROMRight}
						onChange={(value) => handleInputChange("hipROMRight", value)}
						options={ranges.hipROM}
						unit="°"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Advanced Passive Hip ROM
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "limited (external)", label: "Limited - External" },
								{ value: "limited (internal)", label: "Limited - Internal" },
								{ value: "full", label: "Full" },
							]}
							value={formData.advPassiveHipROMLeft}
							onChange={(value) =>
								handleInputChange("advPassiveHipROMLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "limited (external)", label: "Limited - External" },
								{ value: "limited (internal)", label: "Limited - Internal" },
								{ value: "full", label: "Full" },
							]}
							value={formData.advPassiveHipROMRight}
							onChange={(value) =>
								handleInputChange("advPassiveHipROMRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Ankle ROM Plantar</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "limited", label: "Limited" },
								{ value: "full", label: "Full" },
							]}
							value={formData.ankleROMPlantarLeft}
							onChange={(value) =>
								handleInputChange("ankleROMPlantarLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "limited", label: "Limited" },
								{ value: "full", label: "Full" },
							]}
							value={formData.ankleROMPlantarRight}
							onChange={(value) =>
								handleInputChange("ankleROMPlantarRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Ankle ROM Dorsal</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "limited", label: "Limited" },
								{ value: "full", label: "Full" },
							]}
							value={formData.ankleROMDorsalLeft}
							onChange={(value) =>
								handleInputChange("ankleROMDorsalLeft", value)
							}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "limited", label: "Limited" },
								{ value: "full", label: "Full" },
							]}
							value={formData.ankleROMDorsalRight}
							onChange={(value) =>
								handleInputChange("ankleROMDorsalRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<HybridSelector
				label="Advanced Q Angle"
				value={formData.advQAngle}
				onChange={(value) => handleInputChange("advQAngle", value)}
				options={ranges.qAngle}
				unit="°"
			/>

			<ToggleGroup
				label="Pelvic Rotation"
				options={[
					{ value: "neutral", label: "Neutral" },
					{ value: "anterior-tilt", label: "Anterior Tilt" },
					{ value: "posterior-tilt", label: "Posterior Tilt" },
				]}
				value={formData.pelvicRotation}
				onChange={(value) => handleInputChange("pelvicRotation", value)}
			/>

			<ToggleGroup
				label="Leg Length Discrepancy"
				options={[
					{ value: "none", label: "None" },
					{ value: "right tibia longer", label: "Right Tibia Longer" },
					{ value: "left tibia longer", label: "Left Tibia Longer" },
					{ value: "right fibula longer", label: "Right Fibula Longer" },
					{ value: "left fibula longer", label: "Left Fibula Longer" },
				]}
				value={formData.legLengthDiscrepancy}
				onChange={(value) => handleInputChange("legLengthDiscrepancy", value)}
			/>

			{formData.legLengthDiscrepancy !== "none" && (
				<HybridSelector
					label="Leg Length Discrepancy - Difference"
					value={formData.legLengthDiscrepancyDifference}
					onChange={(value) =>
						handleInputChange("legLengthDiscrepancyDifference", value)
					}
					options={ranges.legLengthDiscrepancyDifference}
					unit="mm"
				/>
			)}

			{/* Thomas Test */}
			<div className="space-y-2">
				<Label className="text-base font-medium">
					Thomas Test - IT Band Assessment
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.itBandLeft}
							onChange={(value) => handleInputChange("itBandLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.itBandRight}
							onChange={(value) => handleInputChange("itBandRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Advanced Thomas Test - Hip Assessment
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.hipLeft}
							onChange={(value) => handleInputChange("hipLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.hipRight}
							onChange={(value) => handleInputChange("hipRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Advanced Thomas Test - Quad Assessment
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.quadLeft}
							onChange={(value) => handleInputChange("quadLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "significant", label: "Significant" },
							]}
							value={formData.quadRight}
							onChange={(value) => handleInputChange("quadRight", value)}
						/>
					</div>
				</div>
			</div>

			{/* One Third Knee Band */}
			<div className="space-y-2">
				<Label className="text-base font-medium">
					One Third Knee Band - Knee Type
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "aligned", label: "Aligned" },
								{ value: "valgus", label: "Valgus" },
								{ value: "varus", label: "Varus" },
							]}
							value={formData.kneeTypeLeft}
							onChange={(value) => handleInputChange("kneeTypeLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "aligned", label: "Aligned" },
								{ value: "valgus", label: "Valgus" },
								{ value: "varus", label: "Varus" },
							]}
							value={formData.kneeTypeRight}
							onChange={(value) => handleInputChange("kneeTypeRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					One Third Knee Band - Knee Severity
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "severe", label: "Severe" },
							]}
							value={formData.kneeSeverityLeft}
							onChange={(value) => handleInputChange("kneeSeverityLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "normal", label: "Normal" },
								{ value: "mild", label: "Mild" },
								{ value: "moderate", label: "Moderate" },
								{ value: "severe", label: "Severe" },
							]}
							value={formData.kneeSeverityRight}
							onChange={(value) =>
								handleInputChange("kneeSeverityRight", value)
							}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					One Third Knee Band - Foot Position
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "stable", label: "Stable" },
								{ value: "unstable", label: "Unstable" },
							]}
							value={formData.footLeft}
							onChange={(value) => handleInputChange("footLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "stable", label: "Stable" },
								{ value: "unstable", label: "Unstable" },
							]}
							value={formData.footRight}
							onChange={(value) => handleInputChange("footRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Advanced One Third Knee Band - Hip Position
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "neutral", label: "Neutral" },
								{ value: "internally-rotated", label: "Internally Rotated" },
								{ value: "externally-rotated", label: "Externally Rotated" },
							]}
							value={formData.hipPositionLeft}
							onChange={(value) => handleInputChange("hipPositionLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "neutral", label: "Neutral" },
								{ value: "internally-rotated", label: "Internally Rotated" },
								{ value: "externally-rotated", label: "Externally Rotated" },
							]}
							value={formData.hipPositionRight}
							onChange={(value) => handleInputChange("hipPositionRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">
					Advanced One Third Knee Band - Torso Position
				</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "upright", label: "Upright" },
								{ value: "rotated", label: "Rotated" },
								{ value: "side-bent", label: "Side-bent" },
							]}
							value={formData.torsoLeft}
							onChange={(value) => handleInputChange("torsoLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "upright", label: "Upright" },
								{ value: "rotated", label: "Rotated" },
								{ value: "side-bent", label: "Side-bent" },
							]}
							value={formData.torsoRight}
							onChange={(value) => handleInputChange("torsoRight", value)}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Advanced Active Hip ROM</Label>
				<div>
					<Label className="text-sm text-muted-foreground block">Left</Label>
					<ToggleGroup
						label=""
						options={[
							{ value: "neutral", label: "Neutral" },
							{ value: "externally rotated", label: "Externally Rotated" },
							{ value: "internally rotated", label: "Internally Rotated" },
						]}
						value={formData.advActiveHipROMLeft}
						onChange={(value) =>
							handleInputChange("advActiveHipROMLeft", value)
						}
					/>
				</div>
				<div>
					<Label className="text-sm text-muted-foreground block">Right</Label>
					<ToggleGroup
						label=""
						options={[
							{ value: "neutral", label: "Neutral" },
							{ value: "externally rotated", label: "Externally Rotated" },
							{ value: "internally rotated", label: "Internally Rotated" },
						]}
						value={formData.advActiveHipROMRight}
						onChange={(value) =>
							handleInputChange("advActiveHipROMRight", value)
						}
					/>
				</div>
			</div>
		</>
	);
}
