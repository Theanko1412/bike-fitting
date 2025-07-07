import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import "./styles.css";
import App from "./App.tsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import FormPage from "./pages/form";
import SearchPage from "./pages/search";
import ViewPage from "./pages/view";
import { handleInstallPrompt, registerSW } from "./utils/pwa";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 30,
			retry: 1,
		},
	},
});

const rootRoute = createRootRoute({
	component: () => (
		<ThemeProvider>
			<AuthProvider>
				<Outlet />
				<Toaster richColors position="top-center" visibleToasts={5} />
			</AuthProvider>
		</ThemeProvider>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: App,
});

const searchRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/search",
	component: () => (
		<ProtectedRoute>
			<SearchPage />
		</ProtectedRoute>
	),
});

const formRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/form",
	component: () => (
		<ProtectedRoute>
			<FormPage />
		</ProtectedRoute>
	),
});

const viewRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/view/$id",
	component: () => (
		<ProtectedRoute>
			<ViewPage />
		</ProtectedRoute>
	),
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	searchRoute,
	formRoute,
	viewRoute,
]);

const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	);
}

// Initialize PWA functionality
registerSW();
handleInstallPrompt();
