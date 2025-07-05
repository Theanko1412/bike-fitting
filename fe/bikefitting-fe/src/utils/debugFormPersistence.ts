import { getDefaultFormData } from "@/config/form-config";

// Helper function to check if form data has been modified from defaults
export const isFormDataModified = (formData: any) => {
	const defaultData = getDefaultFormData();

	// Quick check - if any string field that was empty is now filled, it's modified
	const hasFilledFields = Object.entries(formData).some(([key, value]) => {
		if (typeof value === "string" && typeof defaultData[key] === "string") {
			return defaultData[key] === "" && value !== "";
		}
		return false;
	});

	if (hasFilledFields) {
		return true;
	}

	// Check if any non-string fields have changed
	for (const [key, value] of Object.entries(formData)) {
		if (!(key in defaultData)) {
			return true;
		}

		// For numbers, check if they've changed
		if (typeof value === "number" && typeof defaultData[key] === "number") {
			if (value !== defaultData[key]) {
				return true;
			}
		}

		// For objects, do a deep comparison
		if (
			typeof value === "object" &&
			value !== null &&
			typeof defaultData[key] === "object"
		) {
			if (JSON.stringify(value) !== JSON.stringify(defaultData[key])) {
				return true;
			}
		}

		// For non-empty string defaults that have changed
		if (typeof value === "string" && typeof defaultData[key] === "string") {
			if (defaultData[key] !== "" && value !== defaultData[key]) {
				return true;
			}
		}
	}

	return false;
};

export const debugFormPersistence = () => {
	console.log("🔍 === FORM PERSISTENCE DEBUG ===");

	try {
		const stored = localStorage.getItem("bikefitting-form-data");
		if (stored) {
			const data = JSON.parse(stored);
			console.log("📦 Found stored data:", {
				hasData: !!data.data,
				timestamp: data.timestamp,
				age: data.timestamp ? Date.now() - data.timestamp : "unknown",
				version: data.version,
				sizeKB: Math.round((JSON.stringify(data).length / 1024) * 100) / 100,
			});

			// Check if data is expired
			const SIX_HOURS = 6 * 60 * 60 * 1000;
			const isExpired = Date.now() - data.timestamp > SIX_HOURS;
			console.log("⏰ Data expired:", isExpired);

			// Check some sample fields
			if (data.data) {
				console.log("📝 Sample fields:", {
					fullName: data.data.fullName,
					email: data.data.email,
					bikeBrand: data.data.bikeBrand,
					bikeModel: data.data.bikeModel,
				});
			}
		} else {
			console.log("❌ No stored data found");
		}
	} catch (error) {
		console.error("💥 Error debugging localStorage:", error);
	}

	console.log("🔍 === END DEBUG ===");
};

// Call this function in the browser console to debug
if (typeof window !== "undefined") {
	(window as any).debugFormPersistence = debugFormPersistence;
}
