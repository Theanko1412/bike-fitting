import { getDefaultFormData } from "@/config/form-config";

// Helper function to check if form data has been modified from defaults
export const isFormDataModified = (formData: any) => {
	const defaultData = getDefaultFormData();

	// Quick check - if any string field that was empty is now filled, it's modified
	const hasFilledFields = Object.entries(formData).some(([key, value]) => {
		if (
			typeof value === "string" &&
			typeof (defaultData as any)[key] === "string"
		) {
			return (defaultData as any)[key] === "" && value !== "";
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
		if (
			typeof value === "number" &&
			typeof (defaultData as any)[key] === "number"
		) {
			if (value !== (defaultData as any)[key]) {
				return true;
			}
		}

		// For Date objects, compare by time value rather than reference
		if (value instanceof Date && (defaultData as any)[key] instanceof Date) {
			// Allow small time differences (up to 5 seconds) to account for initialization timing
			const timeDiff = Math.abs(
				value.getTime() - (defaultData as any)[key].getTime(),
			);
			if (timeDiff > 5000) {
				// 5 seconds tolerance
				return true;
			}
		}

		// For other objects (excluding Date), do a deep comparison
		if (
			typeof value === "object" &&
			value !== null &&
			!(value instanceof Date) &&
			typeof (defaultData as any)[key] === "object" &&
			!((defaultData as any)[key] instanceof Date)
		) {
			if (JSON.stringify(value) !== JSON.stringify((defaultData as any)[key])) {
				return true;
			}
		}

		// For non-empty string defaults that have changed
		if (
			typeof value === "string" &&
			typeof (defaultData as any)[key] === "string"
		) {
			if (
				(defaultData as any)[key] !== "" &&
				value !== (defaultData as any)[key]
			) {
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
