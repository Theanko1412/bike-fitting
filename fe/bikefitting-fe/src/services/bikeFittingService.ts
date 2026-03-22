import { API_CONFIG, buildApiUrl } from "../config/api";
import { normalizeCalendarDateString } from "../lib/utils";
import { authFetch } from "./authFetch";
import { AuthService } from "./authService";

// Types
export interface BikeFittingRecord {
	id: string;
	fullName: string;
	/** ISO-8601 instant from API (session date + time); use formatDate() for display */
	date: string;
	hasFile: boolean;
}

export interface BikeFittingDAO {
	id: string;
	fullName: string;
	fitterFullName: string;
	date: string;
	/** Calendar date when the row was first stored (YYYY-MM-DD from API). */
	submissionDate?: string;
	jsonForm: any;
	/** True when a PDF exists; load bytes via GET …/records/:id/pdf */
	hasFile: boolean;
}

export interface PagedResponse<T> {
	data: T[];
	nextPage: number | null;
	hasMore: boolean;
}

export interface BikeFittingExportSummary {
	id: string;
	requestedByUsername: string | null;
	filterFrom: string;
	filterTo: string;
	filterFitters: string[];
	startedAt: string;
	completedAt: string | null;
	status: string;
	rowCount: number | null;
	errorMessage: string | null;
	suggestedFilename: string | null;
}

export interface ExportCsvRequestBody {
	from: string;
	to: string;
	/** Omit or empty = all fitters */
	fitterNames?: string[];
}

export type RecordsSortDirection = "asc" | "desc";

export interface SearchParams {
	page: number;
	size: number;
	search?: string;
	direction?: RecordsSortDirection;
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
		direction = "desc",
	}: Partial<SearchParams> = {}): Promise<PagedResponse<BikeFittingRecord>> {
		const params: Record<string, string> = {
			page: page.toString(),
			size: size.toString(),
			direction,
		};

		if (search) {
			params.search = search;
		}

		const url = buildApiUrl(API_CONFIG.endpoints.records, params);

		try {
			const response = await authFetch(url, {
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
					date: String(record.date),
					hasFile:
						record.hasFile !== undefined
							? record.hasFile
							: Boolean(record.pdfFile),
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
			const response = await authFetch(url, {
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			const data = await response.json();

			return {
				...data,
				date: String(data.date),
				hasFile: Boolean(data.hasFile),
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
			const response = await authFetch(url, {
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
				date: String(data.date),
				hasFile: Boolean(data.hasFile),
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
			const response = await authFetch(url, {
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
			const response = await authFetch(url, {
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
				const dateString = normalizeCalendarDateString(record.date);
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

	/**
	 * ADMIN: distinct fitter names for export filters
	 */
	static async getFitters(): Promise<string[]> {
		const url = buildApiUrl(API_CONFIG.endpoints.fitters);
		const response = await authFetch(url, { headers: getAuthHeaders() });
		if (!response.ok) {
			const errorMessage = await parseErrorResponse(response);
			throw new Error(errorMessage);
		}
		return response.json();
	}

	/**
	 * ADMIN: paginated export job history
	 */
	static async listExports({
		page = 0,
		size = 20,
	}: {
		page?: number;
		size?: number;
	} = {}): Promise<PagedResponse<BikeFittingExportSummary>> {
		const url = buildApiUrl(API_CONFIG.endpoints.exports, {
			page: String(page),
			size: String(size),
		});
		const response = await authFetch(url, { headers: getAuthHeaders() });
		if (!response.ok) {
			const errorMessage = await parseErrorResponse(response);
			throw new Error(errorMessage);
		}
		return response.json();
	}

	/**
	 * ADMIN: POST mass CSV export and trigger a browser download (UTF-8 BOM + CRLF from server).
	 */
	static async downloadExportCsv(
		body: ExportCsvRequestBody,
	): Promise<{ exportId: string | null }> {
		const url = buildApiUrl(API_CONFIG.endpoints.exports);
		const payload: ExportCsvRequestBody = {
			from: body.from,
			to: body.to,
			...(body.fitterNames !== undefined && body.fitterNames.length > 0
				? { fitterNames: body.fitterNames }
				: {}),
		};

		const response = await authFetch(url, {
			method: "POST",
			headers: getAuthHeaders(),
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorMessage = await parseErrorResponse(response);
			throw new Error(errorMessage);
		}

		const exportId = response.headers.get("X-Export-Id");
		const contentDisposition = response.headers.get("Content-Disposition");
		let filename = `bikefitting-export-${body.from}_to_${body.to}.csv`;

		if (contentDisposition) {
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

		const buf = await response.arrayBuffer();
		const blob = new Blob([buf], { type: "text/csv;charset=utf-8" });
		const downloadUrl = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(downloadUrl);

		return { exportId };
	}

	/**
	 * Download a single record as CSV (same columns as mass export: meta + form + json_form_error).
	 */
	static async downloadRecordCsv(id: string): Promise<void> {
		const url = buildApiUrl(`${API_CONFIG.endpoints.records}/${id}/csv`);

		try {
			const response = await authFetch(url, {
				headers: getAuthHeaders(),
			});

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("Record not found");
				}
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			const contentDisposition = response.headers.get("Content-Disposition");
			let filename = `bike-fitting-${id}.csv`;

			if (contentDisposition) {
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
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Failed to download record CSV:", error);
			throw error;
		}
	}
}
