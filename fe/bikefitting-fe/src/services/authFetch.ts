import { AuthService } from "./authService";

export const SESSION_EXPIRED_EVENT = "bikefitting:session-expired";

/**
 * Wraps fetch for authenticated API calls. Clears session and notifies on 401.
 */
export async function authFetch(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	const response = await fetch(input, init);
	if (response.status === 401) {
		AuthService.logout();
		window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
	}
	return response;
}
