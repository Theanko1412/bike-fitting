import { useCallback, useEffect, useRef } from "react";

interface StoredFormData {
	data: any;
	timestamp: number;
	version: string;
}

export const STORAGE_KEY = "bikefitting-form-data";
export const EXPIRATION_HOURS = 6;
export const FORM_VERSION = "1.0"; // Increment this if form structure changes significantly

// Fields that should be excluded from localStorage
const EXCLUDED_FIELDS = [
	"initialRiderPhoto",
	"forwardSpinalFlexionPhoto",
	"finalRiderPhoto",
	"fitter", // Exclude fitter object to avoid localStorage issues
];

// Remove excluded fields from form data before saving
function excludeFields(formData: any): any {
	const filtered = { ...formData };
	EXCLUDED_FIELDS.forEach((field) => {
		delete filtered[field];
	});
	return filtered;
}

// Reset excluded fields when restoring (images to empty strings, fitter to default)
function resetExcludedFields(formData: any): any {
	const restored = { ...formData };
	// Reset image fields to empty strings
	restored.initialRiderPhoto = "";
	restored.forwardSpinalFlexionPhoto = "";
	restored.finalRiderPhoto = "";
	// Reset fitter to default (will need to be re-selected)
	// Don't set a default here, let the form component handle it
	delete restored.fitter;
	return restored;
}

export function useFormPersistence() {
	const saveTimeoutRef = useRef<NodeJS.Timeout>();

	// Save form data to localStorage with timestamp (excluding images and fitter)
	const saveFormData = useCallback((formData: any) => {
		try {
			const filteredData = excludeFields(formData);
			const storageData: StoredFormData = {
				data: filteredData,
				timestamp: Date.now(),
				version: FORM_VERSION,
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
		} catch (error) {
			console.warn("Failed to save form data to localStorage:", error);
		}
	}, []);

	// Debounced save to avoid excessive localStorage writes
	const debouncedSave = useCallback(
		(formData: any, onComplete?: () => void) => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}

			saveTimeoutRef.current = setTimeout(() => {
				saveFormData(formData);
				onComplete?.();
			}, 30000); // Save 30s after last change
		},
		[saveFormData],
	);

	// Load form data from localStorage
	const loadFormData = useCallback((): any | null => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				return null;
			}

			const storageData: StoredFormData = JSON.parse(stored);

			// Check if data has expired (6 hours)
			const isExpired =
				Date.now() - storageData.timestamp > EXPIRATION_HOURS * 60 * 60 * 1000;
			if (isExpired) {
				clearFormData();
				return null;
			}

			// Check version compatibility
			if (storageData.version !== FORM_VERSION) {
				clearFormData();
				return null;
			}

			return resetExcludedFields(storageData.data);
		} catch (error) {
			console.warn("Failed to load form data from localStorage:", error);
			clearFormData(); // Clear corrupted data
			return null;
		}
	}, []);

	// Clear form data from localStorage
	const clearFormData = useCallback(() => {
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.warn("Failed to clear form data from localStorage:", error);
		}
	}, []);

	// Check if there's stored data available
	const hasStoredData = useCallback((): boolean => {
		return loadFormData() !== null;
	}, [loadFormData]);

	// Get age of stored data in minutes
	const getStoredDataAge = useCallback((): number | null => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return null;

			const storageData: StoredFormData = JSON.parse(stored);
			return Math.floor((Date.now() - storageData.timestamp) / (1000 * 60));
		} catch {
			return null;
		}
	}, []);

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	return {
		saveFormData: debouncedSave,
		loadFormData,
		clearFormData,
		hasStoredData,
		getStoredDataAge,
	};
}
