import { useEffect, useRef } from "react";

export function useVisibilityChange(callback: () => void) {
	const callbackRef = useRef(callback);

	// Update ref when callback changes
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden) {
				// Page is being hidden (user switching tabs, minimizing browser, etc.)
				callbackRef.current();
			}
		};

		const handleBeforeUnload = () => {
			// Browser is closing or page is being refreshed
			callbackRef.current();
		};

		// Add event listeners
		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("beforeunload", handleBeforeUnload);

		// Cleanup on unmount
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);
}
