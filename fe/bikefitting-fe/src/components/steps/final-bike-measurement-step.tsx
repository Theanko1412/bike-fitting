import { HybridSelector } from "@/components/ui/hybrid-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	bikeBrands,
	bikeTypes,
	bikeYears,
	pedalBrands,
	ranges,
} from "@/config/form-config";
import { bikeFittingImageToBase64 } from "@/lib/utils";

interface FinalBikeMeasurementStepProps {
	formData: any;
	handleInputChange: (field: string, value: any) => void;
}

export function FinalBikeMeasurementStep({
	formData,
	handleInputChange,
}: FinalBikeMeasurementStepProps) {
	return (
		<>
			<HybridSelector
				label="Bike Brand"
				value={formData.finalBikeBrand}
				onChange={(value) => handleInputChange("finalBikeBrand", value)}
				options={bikeBrands}
			/>

			<HybridSelector
				label="Bike Type"
				value={formData.finalBikeType}
				onChange={(value) => handleInputChange("finalBikeType", value)}
				options={bikeTypes}
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Bike Model</Label>
				<Input
					value={formData.finalBikeModel}
					onChange={(e) => handleInputChange("finalBikeModel", e.target.value)}
					placeholder="Enter bike model"
					className="h-12"
				/>
			</div>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Bike Size</Label>
				<Input
					value={formData.bikeSize}
					onChange={(e) => handleInputChange("bikeSize", e.target.value)}
					placeholder="Enter bike size"
					className="h-12"
				/>
			</div>

			<HybridSelector
				label="Bike Year"
				value={formData.finalBikeYear}
				onChange={(value) => handleInputChange("finalBikeYear", value)}
				options={bikeYears}
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Saddle Brand</Label>
				<Input
					value={formData.finalSaddleBrand}
					onChange={(e) =>
						handleInputChange("finalSaddleBrand", e.target.value)
					}
					placeholder="Enter saddle brand"
					className="h-12"
				/>
			</div>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Saddle Model</Label>
				<Input
					value={formData.finalSaddleModel}
					onChange={(e) =>
						handleInputChange("finalSaddleModel", e.target.value)
					}
					placeholder="Enter saddle model"
					className="h-12"
				/>
			</div>

			<HybridSelector
				label="Saddle Width"
				value={formData.finalSaddleWidth}
				onChange={(value) => handleInputChange("finalSaddleWidth", value)}
				options={ranges.saddleWidth}
				unit="mm"
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Shoe Brand</Label>
				<Input
					value={formData.finalShoeBrand}
					onChange={(e) => handleInputChange("finalShoeBrand", e.target.value)}
					placeholder="Enter shoe brand"
					className="h-12"
				/>
			</div>

			<HybridSelector
				label="Shoe Size"
				value={formData.finalShoeSize}
				onChange={(value) => handleInputChange("finalShoeSize", value)}
				options={ranges.shoeSize}
			/>

			<HybridSelector
				label="Saddle Height"
				value={formData.finalSaddleHeight}
				onChange={(value) => handleInputChange("finalSaddleHeight", value)}
				options={ranges.saddleHeight}
				unit="mm"
			/>

			<HybridSelector
				label="Saddle Offset"
				value={formData.finalSaddleOffset}
				onChange={(value) => handleInputChange("finalSaddleOffset", value)}
				options={ranges.saddleOffset}
				unit="mm"
			/>

			<HybridSelector
				label="Handlebar Width"
				value={formData.finalHandlebarWidth}
				onChange={(value) => handleInputChange("finalHandlebarWidth", value)}
				options={ranges.handlebarWidth}
				unit="cm"
			/>

			<HybridSelector
				label="Stem Length"
				value={formData.finalStemLength}
				onChange={(value) => handleInputChange("finalStemLength", value)}
				options={ranges.stemLength}
				unit="mm"
			/>

			<HybridSelector
				label="Stem Angle"
				value={formData.finalStemAngle}
				onChange={(value) => handleInputChange("finalStemAngle", value)}
				options={ranges.stemAngle}
				unit="°"
			/>

			<HybridSelector
				label="Reach to Handlebar"
				value={formData.finalReachToHandlebar}
				onChange={(value) => handleInputChange("finalReachToHandlebar", value)}
				options={ranges.reachToHandlebar}
				unit="mm"
			/>

			<HybridSelector
				label="Reach to Grips"
				value={formData.finalReachToGrips}
				onChange={(value) => handleInputChange("finalReachToGrips", value)}
				options={ranges.reachToGrips}
				unit="mm"
			/>

			<HybridSelector
				label="Reach to Hoods"
				value={formData.finalReachToHoods}
				onChange={(value) => handleInputChange("finalReachToHoods", value)}
				options={ranges.reachToHoods}
				unit="mm"
			/>

			<HybridSelector
				label="Bar Drop from Saddle"
				value={formData.finalBarDropFromSaddle}
				onChange={(value) => handleInputChange("finalBarDropFromSaddle", value)}
				options={ranges.barDropFromSaddle}
				unit="mm"
			/>

			<HybridSelector
				label="Pedals Brand"
				value={formData.finalPedalsBrand}
				onChange={(value) => handleInputChange("finalPedalsBrand", value)}
				options={pedalBrands}
			/>

			<div className="space-y-2">
				<Label className="text-base font-medium">Footbed</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<HybridSelector
							label=""
							value={formData.finalFootbedLeft}
							onChange={(value) => handleInputChange("finalFootbedLeft", value)}
							options={ranges.footbed}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<HybridSelector
							label=""
							value={formData.finalFootbedRight}
							onChange={(value) =>
								handleInputChange("finalFootbedRight", value)
							}
							options={ranges.footbed}
						/>
					</div>
				</div>
			</div>

			<HybridSelector
				label="Crank Length"
				value={formData.finalCrankLength}
				onChange={(value) => handleInputChange("finalCrankLength", value)}
				options={ranges.crankLength}
				unit="mm"
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Rider Photo</Label>
				<Input
					type="file"
					accept="image/*"
					placeholder="Upload final rider photo"
					className="h-12"
					onChange={async (e) => {
						const file = e.target.files?.[0];
						if (file) {
							try {
								const base64 = await bikeFittingImageToBase64(file);
								handleInputChange("finalRiderPhoto", base64);
							} catch (error) {
								console.error("Error converting file to base64:", error);
							}
						} else {
							handleInputChange("finalRiderPhoto", "");
						}
					}}
				/>
				{formData.finalRiderPhoto && (
					<div className="mt-2">
						<img
							src={formData.finalRiderPhoto}
							alt="Final rider photo"
							className="object-contain rounded border"
						/>
					</div>
				)}
			</div>
		</>
	);
}
