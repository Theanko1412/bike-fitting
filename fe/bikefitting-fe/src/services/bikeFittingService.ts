import { API_CONFIG, buildApiUrl } from "../config/api";

// Types
export interface BikeFittingRecord {
	id: number;
	fullName: string;
	date: string;
	hasFile: boolean;
}

export interface BikeFittingDAO {
	id: number;
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
			const response = await fetch(url);

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
					id: record.id, // Keep as number
					date: new Date(record.date).toISOString().split("T")[0], // Convert LocalDate to string
					hasFile: record.pdfFile != null, // Derive from pdfFile
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
			const response = await fetch(url);

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
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
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
	 * Download PDF for a record (placeholder for future implementation)
	 */
	static async downloadPdf(id: number): Promise<Blob> {
		const url = buildApiUrl(`${API_CONFIG.endpoints.records}/${id}/pdf`);

		try {
			const response = await fetch(url);

			if (!response.ok) {
				const errorMessage = await parseErrorResponse(response);
				throw new Error(errorMessage);
			}

			return await response.blob();
		} catch (error) {
			console.error("Failed to download PDF:", error);
			throw error;
		}
	}
}
