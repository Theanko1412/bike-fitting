import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthService, type AuthUser } from "../services/authService";

interface AuthContextType {
	isAuthenticated: boolean;
	user: AuthUser | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Check authentication status on mount
	useEffect(() => {
		const checkAuth = () => {
			try {
				const authenticated = AuthService.isAuthenticated();
				setIsAuthenticated(authenticated);

				if (authenticated) {
					const userData = AuthService.getUser();
					setUser(userData);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Auth check error:", error);
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (username: string, password: string): Promise<void> => {
		try {
			const authResponse = await AuthService.login({ username, password });

			setIsAuthenticated(true);
			setUser({
				username: authResponse.username,
				role: authResponse.role,
			});
		} catch (error) {
			// Let the component handle the error
			throw error;
		}
	};

	const logout = (): void => {
		AuthService.logout();
		setIsAuthenticated(false);
		setUser(null);
	};

	const value: AuthContextType = {
		isAuthenticated,
		user,
		login,
		logout,
		isLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
