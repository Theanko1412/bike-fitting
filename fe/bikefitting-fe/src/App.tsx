import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";

function App() {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
			<div className="text-center space-y-8">
				<div className="space-y-2">
					<h1 className="text-4xl font-bold">SeginBikeFit</h1>
					<p className="text-muted-foreground">Choose your destination</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4">
					<Button asChild size="3xl" className="w-48">
						<Link to="/search">Search</Link>
					</Button>
					<Button asChild size="3xl" className="w-48">
						<Link to="/form">Form</Link>
					</Button>
				</div>
			</div>

			<ThemeToggle />
		</div>
	);
}

export default App;
