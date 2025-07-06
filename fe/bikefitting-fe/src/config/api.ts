// API Configuration
export const API_CONFIG = {
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.1.11:8080",
	endpoints: {
		records: "/api/records",
		form: "/api/form",
	},
	defaultPageSize: 50,
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (
	endpoint: string,
	params?: Record<string, string>,
) => {
	const url = new URL(endpoint, API_CONFIG.baseURL);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
	}

	return url.toString();
};
