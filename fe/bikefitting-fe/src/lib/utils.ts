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
 * Convert a file to base64 string
 * @param file - File object to convert
 * @returns Promise that resolves to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
}
