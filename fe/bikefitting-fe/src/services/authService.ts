import { buildApiUrl } from "../config/api";

// Types matching the backend
export interface LoginRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	username: string;
	role: string;
	expiresIn: number;
}

export interface AuthUser {
	username: string;
	role: string;
}

// Storage keys
const TOKEN_KEY = "bikefitting_auth_token";
const USER_KEY = "bikefitting_auth_user";

export class AuthService {
	/**
	 * Login with username and password
	 */
	static async login(credentials: LoginRequest): Promise<AuthResponse> {
		const url = buildApiUrl("/api/auth/login");

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error("Invalid username or password");
				}
				throw new Error(`Login failed: ${response.status}`);
			}

			const authResponse: AuthResponse = await response.json();

			// Store token and user info
			this.setToken(authResponse.token);
			this.setUser({
				username: authResponse.username,
				role: authResponse.role,
			});

			return authResponse;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	/**
	 * Logout and clear stored data
	 */
	static logout(): void {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	}

	/**
	 * Get stored JWT token
	 */
	static getToken(): string | null {
		return localStorage.getItem(TOKEN_KEY);
	}

	/**
	 * Set JWT token in storage
	 */
	static setToken(token: string): void {
		localStorage.setItem(TOKEN_KEY, token);
	}

	/**
	 * Get stored user info
	 */
	static getUser(): AuthUser | null {
		const userJson = localStorage.getItem(USER_KEY);
		if (!userJson) return null;

		try {
			return JSON.parse(userJson);
		} catch {
			return null;
		}
	}

	/**
	 * Set user info in storage
	 */
	static setUser(user: AuthUser): void {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	}

	/**
	 * Check if user is authenticated
	 */
	static isAuthenticated(): boolean {
		const token = this.getToken();
		if (!token) return false;

		// Basic JWT expiration check
		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			const currentTime = Date.now() / 1000;

			if (payload.exp && payload.exp < currentTime) {
				// Token expired, clear it
				this.logout();
				return false;
			}

			return true;
		} catch {
			// Invalid token format, clear it
			this.logout();
			return false;
		}
	}

	/**
	 * Get Authorization header value
	 */
	static getAuthHeader(): string | null {
		const token = this.getToken();
		return token ? `Bearer ${token}` : null;
	}
}
