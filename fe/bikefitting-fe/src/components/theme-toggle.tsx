import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider.tsx";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={toggleTheme}
			className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
		>
			{theme === "dark" ? (
				<Sun className="h-4 w-4" />
			) : (
				<Moon className="h-4 w-4" />
			)}
		</Button>
	);
}
