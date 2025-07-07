import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			// Redirect to home page where they can log in
			navigate({ to: "/" });
		}
	}, [isAuthenticated, isLoading, navigate]);

	// Show loading while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background text-foreground flex items-center justify-center">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-semibold">SeginBikeFit</h2>
					<p className="text-muted-foreground">Checking authentication...</p>
				</div>
			</div>
		);
	}

	// If not authenticated, don't render the protected content
	// (navigation will happen via useEffect)
	if (!isAuthenticated) {
		return null;
	}

	// Render protected content
	return <>{children}</>;
}
