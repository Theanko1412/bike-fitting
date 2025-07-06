import { HybridSelector } from "@/components/ui/hybrid-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
	bikeBrands,
	bikeYears,
	pedalBrands,
	ranges,
} from "@/config/form-config";
import { bikeFittingImageToBase64 } from "@/lib/utils";

interface InitialBikeMeasurementStepProps {
	formData: any;
	handleInputChange: (field: string, value: any) => void;
}

export function InitialBikeMeasurementStep({
	formData,
	handleInputChange,
}: InitialBikeMeasurementStepProps) {
	return (
		<>
			<HybridSelector
				label="Bike Brand"
				value={formData.bikeBrand}
				onChange={(value) => handleInputChange("bikeBrand", value)}
				options={bikeBrands}
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Bike Model</Label>
				<Input
					value={formData.bikeModel}
					onChange={(e) => handleInputChange("bikeModel", e.target.value)}
					placeholder="Enter bike model"
					className="h-12"
				/>
			</div>

			<HybridSelector
				label="Bike Year"
				value={formData.bikeYear}
				onChange={(value) => handleInputChange("bikeYear", value)}
				options={bikeYears}
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Saddle Brand</Label>
				<Input
					value={formData.saddleBrand}
					onChange={(e) => handleInputChange("saddleBrand", e.target.value)}
					placeholder="Enter saddle brand"
					className="h-12"
				/>
			</div>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Saddle Model</Label>
				<Input
					value={formData.saddleModel}
					onChange={(e) => handleInputChange("saddleModel", e.target.value)}
					placeholder="Enter saddle model"
					className="h-12"
				/>
			</div>

			<HybridSelector
				label="Saddle Width"
				value={formData.saddleWidth}
				onChange={(value) => handleInputChange("saddleWidth", value)}
				options={ranges.saddleWidth}
				unit="mm"
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Shoe Brand</Label>
				<Input
					value={formData.shoeBrand}
					onChange={(e) => handleInputChange("shoeBrand", e.target.value)}
					placeholder="Enter shoe brand"
					className="h-12"
				/>
			</div>

			<HybridSelector
				label="Shoe Size"
				value={formData.shoeSize}
				onChange={(value) => handleInputChange("shoeSize", value)}
				options={ranges.shoeSize}
			/>

			<HybridSelector
				label="Saddle Height"
				value={formData.saddleHeight}
				onChange={(value) => handleInputChange("saddleHeight", value)}
				options={ranges.saddleHeight}
				unit="mm"
			/>

			<HybridSelector
				label="Saddle Offset"
				value={formData.saddleOffset}
				onChange={(value) => handleInputChange("saddleOffset", value)}
				options={ranges.saddleOffset}
				unit="mm"
			/>

			<ToggleGroup
				label="Saddle Direction"
				options={[
					{ value: "aft", label: "Aft" },
					{ value: "fore", label: "Fore" },
				]}
				value={formData.saddleDirection}
				onChange={(value) => handleInputChange("saddleDirection", value)}
			/>

			<HybridSelector
				label="Handlebar Width"
				value={formData.handlebarWidth}
				onChange={(value) => handleInputChange("handlebarWidth", value)}
				options={ranges.handlebarWidth}
				unit="cm"
			/>

			<HybridSelector
				label="Stem Length"
				value={formData.stemLength}
				onChange={(value) => handleInputChange("stemLength", value)}
				options={ranges.stemLength}
				unit="mm"
			/>

			<HybridSelector
				label="Stem Angle"
				value={formData.stemAngle}
				onChange={(value) => handleInputChange("stemAngle", value)}
				options={ranges.stemAngle}
				unit="°"
			/>

			<HybridSelector
				label="Reach to Handlebar"
				value={formData.reachToHandlebar}
				onChange={(value) => handleInputChange("reachToHandlebar", value)}
				options={ranges.reachToHandlebar}
				unit="mm"
			/>

			<HybridSelector
				label="Reach to Grips"
				value={formData.reachToGrips}
				onChange={(value) => handleInputChange("reachToGrips", value)}
				options={ranges.reachToGrips}
				unit="mm"
			/>

			<HybridSelector
				label="Reach to Hoods"
				value={formData.reachToHoods}
				onChange={(value) => handleInputChange("reachToHoods", value)}
				options={ranges.reachToHoods}
				unit="mm"
			/>

			<HybridSelector
				label="Bar Drop from Saddle"
				value={formData.barDropFromSaddle}
				onChange={(value) => handleInputChange("barDropFromSaddle", value)}
				options={ranges.barDropFromSaddle}
				unit="mm"
			/>

			<HybridSelector
				label="Pedals Brand"
				value={formData.pedalsBrand}
				onChange={(value) => handleInputChange("pedalsBrand", value)}
				options={pedalBrands}
			/>

			<div className="space-y-2">
				<Label className="text-base font-medium">Footbed</Label>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-sm text-muted-foreground block">Left</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "none", label: "None" },
								{ value: "low", label: "Low" },
								{ value: "medium", label: "Medium" },
								{ value: "high", label: "High" },
							]}
							value={formData.footbedLeft}
							onChange={(value) => handleInputChange("footbedLeft", value)}
						/>
					</div>
					<div>
						<Label className="text-sm text-muted-foreground block">Right</Label>
						<ToggleGroup
							label=""
							options={[
								{ value: "none", label: "None" },
								{ value: "low", label: "Low" },
								{ value: "medium", label: "Medium" },
								{ value: "high", label: "High" },
							]}
							value={formData.footbedRight}
							onChange={(value) => handleInputChange("footbedRight", value)}
						/>
					</div>
				</div>
			</div>

			<HybridSelector
				label="Crank Length"
				value={formData.crankLength}
				onChange={(value) => handleInputChange("crankLength", value)}
				options={ranges.crankLength}
				unit="mm"
			/>

			<div className="space-y-2 mx-1">
				<Label className="text-base font-medium">Rider Photo</Label>
				<Input
					type="file"
					accept="image/*"
					placeholder="Upload initial rider photo"
					className="h-12"
					onChange={async (e) => {
						const file = e.target.files?.[0];
						if (file) {
							try {
								const base64 = await bikeFittingImageToBase64(file);
								handleInputChange("initialRiderPhoto", base64);
							} catch (error) {
								console.error("Error converting file to base64:", error);
							}
						} else {
							handleInputChange("initialRiderPhoto", "");
						}
					}}
				/>
				{formData.initialRiderPhoto && (
					<div className="mt-2">
						<img
							src={formData.initialRiderPhoto}
							alt="Initial rider photo"
							className="object-contain rounded border"
						/>
					</div>
				)}
			</div>
		</>
	);
}
