/** Base URL for the Spring API; set `VITE_API_BASE_URL` in `.env.local` (dev IP, localhost, or prod). */
function getApiBaseUrl(): string {
	const explicit = import.meta.env.VITE_API_BASE_URL;
	if (typeof explicit === "string" && explicit.trim().length > 0) {
		return explicit.trim().replace(/\/$/, "");
	}
	return "http://localhost:8080";
}

export const API_CONFIG = {
	endpoints: {
		records: "/api/records",
		form: "/api/form",
		fitters: "/api/fitters",
		exports: "/api/exports",
	},
	defaultPageSize: 50,
} as const;

export const buildApiUrl = (
	endpoint: string,
	params?: Record<string, string>,
) => {
	const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = new URL(path, getApiBaseUrl());

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, value);
		});
	}

	return url.toString();
};
