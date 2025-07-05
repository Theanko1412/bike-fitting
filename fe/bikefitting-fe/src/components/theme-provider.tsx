import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeProviderContext = createContext<
	ThemeProviderContextType | undefined
>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		// Load theme from localStorage or default to 'dark'
		const savedTheme = localStorage.getItem("vite-ui-theme") as Theme;
		return savedTheme || "dark";
	});

	useEffect(() => {
		// Apply theme to document
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === "dark" ? "light" : "dark";
			// Save to localStorage
			localStorage.setItem("vite-ui-theme", newTheme);
			return newTheme;
		});
	};

	return (
		<ThemeProviderContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
