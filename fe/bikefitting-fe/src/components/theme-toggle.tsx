import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider.tsx";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button variant="outline" size="sm" onClick={toggleTheme}>
			{theme === "dark" ? (
				<>
					<Sun className="h-4 w-4" />
					<p>Light Mode</p>
				</>
			) : (
				<>
					<Moon className="h-4 w-4" />
					<p>Dark Mode</p>
				</>
			)}
		</Button>
	);
}
