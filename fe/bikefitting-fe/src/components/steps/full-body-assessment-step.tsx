import { HybridSelector } from "@/components/ui/hybrid-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { forefootAngulationTypes, ranges } from "@/config/form-config";

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
								{ value: "severe", label: "Severe" },
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
								{ value: "severe", label: "Severe" },
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
								{ value: "neutral", label: "Neutral" },
								{ value: "knock-knee", label: "Knock-knee" },
								{ value: "bow-leg", label: "Bow-leg" },
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
								{ value: "neutral", label: "Neutral" },
								{ value: "knock-knee", label: "Knock-knee" },
								{ value: "bow-leg", label: "Bow-leg" },
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
				<Input
					value={formData.advLowerExtremityAlignment}
					onChange={(e) =>
						handleInputChange("advLowerExtremityAlignment", e.target.value)
					}
					placeholder="Enter additional notes"
					className="h-12"
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
					{ value: "flat", label: "Flat" },
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
				/>
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

			<HybridSelector
				label="Shoulder ROM"
				value={formData.shoulderROM}
				onChange={(value) => handleInputChange("shoulderROM", value)}
				options={ranges.shoulderROM}
				unit="°"
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
								{ value: "limited", label: "Limited" },
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
								{ value: "limited", label: "Limited" },
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
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.ankleROMPlantar‌Left}
						onChange={(value) =>
							handleInputChange("ankleROMPlantar‌Left", value)
						}
						options={ranges.ankleROMPlantar}
						unit="°"
					/>
					<HybridSelector
						label="Right"
						value={formData.ankleROMPlantar‌Right}
						onChange={(value) =>
							handleInputChange("ankleROMPlantar‌Right", value)
						}
						options={ranges.ankleROMPlantar}
						unit="°"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-base font-medium">Ankle ROM Dorsal</Label>
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.ankleROMDorsalLeft}
						onChange={(value) => handleInputChange("ankleROMDorsalLeft", value)}
						options={ranges.ankleROMDorsal}
						unit="°"
					/>
					<HybridSelector
						label="Right"
						value={formData.ankleROMDorsalRight}
						onChange={(value) =>
							handleInputChange("ankleROMDorsalRight", value)
						}
						options={ranges.ankleROMDorsal}
						unit="°"
					/>
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
					{ value: "minor", label: "Minor" },
					{ value: "major", label: "Major" },
				]}
				value={formData.legLengthDiscrepancy}
				onChange={(value) => handleInputChange("legLengthDiscrepancy", value)}
			/>

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
								{ value: "severe", label: "Severe" },
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
								{ value: "severe", label: "Severe" },
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
								{ value: "severe", label: "Severe" },
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
								{ value: "severe", label: "Severe" },
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
								{ value: "severe", label: "Severe" },
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
								{ value: "severe", label: "Severe" },
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
								{ value: "neutral", label: "Neutral" },
								{ value: "pronated", label: "Pronated" },
								{ value: "supinated", label: "Supinated" },
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
								{ value: "neutral", label: "Neutral" },
								{ value: "pronated", label: "Pronated" },
								{ value: "supinated", label: "Supinated" },
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
				<div className="grid grid-cols-2 gap-2">
					<HybridSelector
						label="Left"
						value={formData.advActiveHipROMLeft}
						onChange={(value) =>
							handleInputChange("advActiveHipROMLeft", value)
						}
						options={ranges.activeHipROM}
						unit="°"
					/>
					<HybridSelector
						label="Right"
						value={formData.advActiveHipROMRight}
						onChange={(value) =>
							handleInputChange("advActiveHipROMRight", value)
						}
						options={ranges.activeHipROM}
						unit="°"
					/>
				</div>
			</div>
		</>
	);
}
