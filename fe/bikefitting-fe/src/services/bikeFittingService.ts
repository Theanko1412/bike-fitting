import { API_CONFIG, buildApiUrl } from "../config/api";
import { AuthService } from "./authService";

// Types
export interface BikeFittingRecord {
	id: string;
	fullName: string;
	date: string;
	hasFile: boolean;
}

export interface BikeFittingDAO {
	id: string;
	fullName: string;
	fitterFullName: string;
	date: string;
	jsonForm: any;
	pdfFile: string | null;
}

export interface PagedResponse<T> {
	data: T[];
	nextPage: number | null;
	hasMore: boolean;
}

export interface SearchParams {
	page: number;
	size: number;
	search?: string;
}

export interface BackendErrorResponse {
	message: string;
	timestamp: string;
	route: string;
}

// Helper function to get headers with authentication
function getAuthHeaders(): HeadersInit {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	const authHeader = AuthService.getAuthHeader();
	if (authHeader) {
		headers.Authorization = authHeader;
	}

	return headers;
}

// Helper function to parse backend error responses
async function parseErrorResponse(response: Response): Promise<string> {
	try {
		const errorData: BackendErrorResponse = await response.json();
		return errorData.message || `HTTP error! status: ${response.status}`;
	} catch {
		// If JSON parsing fails, return generic error
		return `HTTP error! status: ${response.status}`;
	}
}

// Service class for bike fitting API operations
export class BikeFittingService {
	/**
	 * Search bike fitting records with pagination
	 */
	static async searchRecords({
		page = 0,
		size = API_CONFIG.defaultPageSize,
		search = "",
	}: Partial<SearchParams> = {}): Promise<PagedResponse<BikeFittingRecord>> {
		const params: Record<string, string> = {
			page: page.toString(),
			size: size.toString(),
		};

		if (search) {
			params.search = search;
		}

		const url = buildApiUrl(API_CONFIG.endpoints.records, params);

		try {
			const response = await fetch(url, {
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			const data = await response.json();

			// Transform the data to match frontend expectations
			const transformedData: PagedResponse<BikeFittingRecord> = {
				...data,
				data: data.data.map((record: any) => ({
					...record,
					id: record.id, // Keep as string
					date: new Date(record.date).toISOString().split("T")[0], // Convert LocalDate to string
					hasFile:
						record.hasFile !== undefined
							? record.hasFile
							: record.pdfFile != null, // Use existing hasFile or derive from pdfFile
				})),
			};

			return transformedData;
		} catch (error) {
			console.error("Failed to fetch records:", error);
			throw error;
		}
	}

	/**
	 * Get a single bike fitting record by ID
	 */
	static async getRecordById(id: string): Promise<BikeFittingDAO> {
		const url = buildApiUrl(`${API_CONFIG.endpoints.records}/${id}`);

		try {
			const response = await fetch(url, {
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			const data = await response.json();

			// Transform LocalDate to string
			return {
				...data,
				date: new Date(data.date).toISOString().split("T")[0],
			};
		} catch (error) {
			console.error("Failed to fetch record:", error);
			throw error;
		}
	}

	/**
	 * Submit a new bike fitting form
	 */
	static async submitForm(formData: any): Promise<BikeFittingRecord> {
		const url = buildApiUrl(API_CONFIG.endpoints.form);

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: getAuthHeaders(),
				body: JSON.stringify(formData),
			});

			// Only accept HTTP 201 CREATED as success - anything else is an error
			if (response.status !== 201) {
				const errorMessage = await parseErrorResponse(response);

				// For 400 BAD_REQUEST, prefix the error message so frontend can detect it
				if (response.status === 400) {
					throw new Error(`BAD_REQUEST: ${errorMessage}`);
				}

				throw new Error(errorMessage);
			}

			const data = await response.json();

			return {
				...data,
				date: new Date(data.date).toISOString().split("T")[0],
				hasFile: data.pdfFile != null,
			};
		} catch (error) {
			console.error("Failed to submit form:", error);
			throw error;
		}
	}

	/**
	 * Fetch PDF blob data for caching (without triggering download)
	 */
	static async fetchPdfBlob(id: string): Promise<{
		blob: Blob;
		filename: string;
	}> {
		const url = buildApiUrl(`${API_CONFIG.endpoints.records}/${id}/pdf`);

		try {
			const response = await fetch(url, {
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("PDF file not found for this record");
				}
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			// Get the filename from Content-Disposition header
			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = "bike-fitting-report.pdf"; // Default fallback

			if (contentDisposition) {
				// Try multiple patterns to extract filename
				let filenameMatch = contentDisposition.match(
					/filename\*?=['"]?([^'";]+)['"]?/i,
				);
				if (!filenameMatch) {
					filenameMatch = contentDisposition.match(
						/filename=['"]?([^'";]+)['"]?/i,
					);
				}
				if (!filenameMatch) {
					filenameMatch = contentDisposition.match(/filename=([^;,\s]+)/i);
				}

				if (filenameMatch) {
					filename = filenameMatch[1].trim();
				}
			}

			const blob = await response.blob();
			return { blob, filename };
		} catch (error) {
			console.error("Failed to fetch PDF blob:", error);
			throw error;
		}
	}

	/**
	 * Download PDF for a record
	 */
	static async downloadPdf(
		id: string,
		record?: { fullName: string; date: string },
	): Promise<void> {
		const url = buildApiUrl(`${API_CONFIG.endpoints.records}/${id}/pdf`);

		try {
			const response = await fetch(url, {
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("PDF file not found for this record");
				}
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			// Generate fallback filename using same logic as backend
			let fallbackFilename = "bike-fitting-report.pdf";
			if (record) {
				const cleanFullName = record.fullName.replace(/ /g, ""); // Remove all spaces like backend
				const dateString = record.date; // Already in yyyy-mm-dd format
				fallbackFilename = `${cleanFullName}-${dateString}-bike-fitting-report.pdf`;
			}

			// Get the filename from Content-Disposition header
			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = fallbackFilename;

			if (contentDisposition) {
				// Try multiple patterns to extract filename
				let filenameMatch = contentDisposition.match(
					/filename\*?=['"]?([^'";]+)['"]?/i,
				);
				if (!filenameMatch) {
					filenameMatch = contentDisposition.match(
						/filename=['"]?([^'";]+)['"]?/i,
					);
				}
				if (!filenameMatch) {
					filenameMatch = contentDisposition.match(/filename=([^;,\s]+)/i);
				}

				if (filenameMatch) {
					filename = filenameMatch[1].trim();
				}
			}

			// Create blob and download
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = filename;
			document.body.appendChild(link);
			link.click();

			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Failed to download PDF:", error);
			throw error;
		}
	}
}
