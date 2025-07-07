// Register service worker
export const registerSW = () => {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			// Use relative path to work with base path configuration
			navigator.serviceWorker
				.register("./sw.js")
				.then((registration) => {
					console.log("SW registered: ", registration);
				})
				.catch((registrationError) => {
					console.log("SW registration failed: ", registrationError);
				});
		});
	}
};

// Handle install prompt
let deferredPrompt: any;

export const handleInstallPrompt = () => {
	window.addEventListener("beforeinstallprompt", (e) => {
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		e.preventDefault();
		// Stash the event so it can be triggered later
		deferredPrompt = e;

		// Show install button (you can add this to your UI)
		console.log("App can be installed");
	});
};

// Trigger install
export const installApp = async () => {
	if (deferredPrompt) {
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		console.log(`User response to the install prompt: ${outcome}`);
		deferredPrompt = null;
	}
};

// Check if app is already installed
export const isAppInstalled = () => {
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		(window.navigator as any).standalone ||
		document.referrer.includes("android-app://")
	);
};
