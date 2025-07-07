import { Link } from "@tanstack/react-router";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "./components/auth/LoginDialog";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { useAuth } from "./contexts/AuthContext";

function App() {
	const [showLoginDialog, setShowLoginDialog] = useState(false);
	const { isAuthenticated, logout, isLoading } = useAuth();

	const handleLogout = () => {
		logout();
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">SeginBikeFit</h1>
					<p className="text-muted-foreground">Loading...</p>
				</div>
				<ThemeToggle />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col p-8">
			{/* Main content - centered */}
			<div className="flex-1 flex flex-col items-center justify-center">
				<div className="text-center space-y-8">
					<div className="space-y-2">
						<h1 className="text-4xl font-bold">SeginBikeFit</h1>
						<p className="text-muted-foreground">
							{isAuthenticated
								? "Choose your destination"
								: "Please sign in to continue"}
						</p>
					</div>

					{isAuthenticated ? (
						// Authenticated user - show navigation buttons
						<div className="flex flex-col sm:flex-row gap-4 items-center">
							<Button asChild size="3xl" className="w-48">
								<Link to="/search">Search</Link>
							</Button>
							<Button asChild size="3xl" className="w-48">
								<Link to="/form">Form</Link>
							</Button>
						</div>
					) : (
						// Unauthenticated user - show login button
						<Button
							size="3xl"
							className="w-48"
							onClick={() => setShowLoginDialog(true)}
						>
							<LogIn className="h-5 w-5 mr-2" />
							Sign In
						</Button>
					)}
				</div>
			</div>

			{/* Bottom buttons */}
			<div className="flex items-center justify-center gap-4">
				<ThemeToggle />
				{isAuthenticated && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleLogout}
						className="flex items-center gap-2"
					>
						<LogOut className="h-4 w-4" />
						Sign Out
					</Button>
				)}
			</div>

			{/* Login Dialog */}
			<LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
		</div>
	);
}

export default App;
