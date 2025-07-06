import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a date to the consistent format used throughout the app: "July 6th, 2025"
 * @param date - Date object, string, or number to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number): string {
	if (!date) return "";

	try {
		const dateObj =
			typeof date === "string" || typeof date === "number"
				? new Date(date)
				: date;

		// Check if date is valid
		if (isNaN(dateObj.getTime())) {
			return String(date); // Return original if can't parse
		}

		return format(dateObj, "PPP"); // This gives "July 6th, 2025" format
	} catch (error) {
		return String(date); // Fallback to original string
	}
}

/**
 * Convert a file to base64 string with optional compression
 * @param file - File object to convert
 * @param options - Compression options
 * @returns Promise that resolves to base64 string
 */
export function fileToBase64(
	file: File,
	options: {
		maxWidth?: number;
		maxHeight?: number;
		quality?: number;
		format?: "jpeg" | "webp" | "png";
	} = {},
): Promise<string> {
	const {
		maxWidth = 1920,
		maxHeight = 1080,
		quality = 0.85,
		format = "jpeg",
	} = options;

	return new Promise((resolve, reject) => {
		// If not an image file, use original method
		if (!file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
			return;
		}

		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Could not get canvas context"));
			return;
		}

		img.onload = () => {
			// Calculate new dimensions while maintaining aspect ratio
			let { width, height } = img;

			if (width > maxWidth || height > maxHeight) {
				const aspectRatio = width / height;

				if (width > height) {
					width = Math.min(width, maxWidth);
					height = width / aspectRatio;
				} else {
					height = Math.min(height, maxHeight);
					width = height * aspectRatio;
				}
			}

			// Set canvas dimensions
			canvas.width = width;
			canvas.height = height;

			// Draw and compress image
			ctx.drawImage(img, 0, 0, width, height);

			// Convert to base64 with compression
			const mimeType =
				format === "jpeg"
					? "image/jpeg"
					: format === "webp"
						? "image/webp"
						: "image/png";

			const base64 = canvas.toDataURL(mimeType, quality);
			resolve(base64);
		};

		img.onerror = () => reject(new Error("Failed to load image"));

		// Load the image
		const reader = new FileReader();
		reader.onload = (e) => {
			img.src = e.target?.result as string;
		};
		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	});
}

/**
 * Preset compression options for bike fitting images
 */
export const imageCompressionPresets = {
	// High quality for detailed analysis (recommended for bike fitting)
	bikeFitting: {
		maxWidth: 1920,
		maxHeight: 1080,
		quality: 0.85,
		format: "jpeg" as const,
	},

	// Medium quality for general photos
	standard: {
		maxWidth: 1200,
		maxHeight: 800,
		quality: 0.8,
		format: "jpeg" as const,
	},

	// Lower quality for thumbnails/previews
	thumbnail: {
		maxWidth: 600,
		maxHeight: 400,
		quality: 0.75,
		format: "jpeg" as const,
	},

	// No compression (original size)
	original: {
		maxWidth: 10000,
		maxHeight: 10000,
		quality: 1.0,
		format: "jpeg" as const,
	},
};

/**
 * Helper function specifically for bike fitting photos
 */
export function bikeFittingImageToBase64(file: File): Promise<string> {
	return fileToBase64(file, imageCompressionPresets.bikeFitting);
}

/**
 * Get estimated file size reduction info
 */
export function getCompressionInfo(
	preset: keyof typeof imageCompressionPresets,
) {
	const info = {
		bikeFitting: {
			reduction: "60-80%",
			description: "High quality, great for analysis",
		},
		standard: {
			reduction: "70-85%",
			description: "Good quality, smaller files",
		},
		thumbnail: {
			reduction: "80-90%",
			description: "Lower quality, very small files",
		},
		original: { reduction: "0%", description: "No compression" },
	};

	return info[preset];
}
