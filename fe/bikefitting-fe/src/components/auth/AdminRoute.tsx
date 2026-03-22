import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface AdminRouteProps {
	children: React.ReactNode;
}

/**
 * Renders children only for authenticated users with role ADMIN; otherwise redirects home.
 */
export function AdminRoute({ children }: AdminRouteProps) {
	const { isAuthenticated, isLoading, user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
			navigate({ to: "/" });
		}
	}, [isAuthenticated, isLoading, user, navigate]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background text-foreground flex items-center justify-center">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-semibold">SeginBikeFit</h2>
					<p className="text-muted-foreground">Checking access...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || user?.role !== "ADMIN") {
		return null;
	}

	return <>{children}</>;
}
