import { AlertTriangle, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Card } from "./card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./dialog";

interface FormSaveIndicatorProps {
	isAutoSaving?: boolean;
	hasStoredData?: boolean;
	storedDataAge?: number | null;
	onRestoreData?: () => void;
	onDiscardData?: () => void;
}

export function FormSaveIndicator({
	isAutoSaving = false,
	hasStoredData = false,
	storedDataAge = null,
	onRestoreData,
	onDiscardData,
}: FormSaveIndicatorProps) {
	const [showSaved, setShowSaved] = useState(false);
	const [showRestorePrompt, setShowRestorePrompt] = useState(hasStoredData);
	const [hasEverSaved, setHasEverSaved] = useState(false);

	// Update local state when hasStoredData prop changes
	useEffect(() => {
		setShowRestorePrompt(hasStoredData);
	}, [hasStoredData]);

	// Show "Saved" indicator briefly after auto-save
	useEffect(() => {
		if (!isAutoSaving && showSaved) {
			const timer = setTimeout(() => setShowSaved(false), 2000);
			return () => clearTimeout(timer);
		}
	}, [isAutoSaving, showSaved]);

	// Trigger saved indicator when auto-saving stops (but only if we've actually saved)
	useEffect(() => {
		if (!isAutoSaving && hasEverSaved) {
			setShowSaved(true);
		}
	}, [isAutoSaving, hasEverSaved]);

	// Track when auto-saving starts
	useEffect(() => {
		if (isAutoSaving) {
			setHasEverSaved(true);
		}
	}, [isAutoSaving]);

	const formatAge = (minutes: number): string => {
		if (minutes < 60) {
			return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
		}
		const hours = Math.floor(minutes / 60);
		return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
	};

	const handleRestore = () => {
		onRestoreData?.();
		setShowRestorePrompt(false);
	};

	const handleDiscard = () => {
		onDiscardData?.();
		setShowRestorePrompt(false);
	};

	return (
		<>
			{/* Auto-save status indicator */}
			{(isAutoSaving || showSaved) && (
				<div className="fixed top-4 right-4 z-50">
					<Card className="px-3 py-2 shadow-lg border bg-background/95 backdrop-blur-sm">
						<div className="flex items-center gap-2 text-sm">
							{isAutoSaving ? (
								<>
									<Clock className="w-4 h-4 animate-spin text-blue-500" />
									<span className="text-muted-foreground">Saving...</span>
								</>
							) : showSaved ? (
								<>
									<Check className="w-4 h-4 text-green-500" />
									<span className="text-muted-foreground">Saved</span>
								</>
							) : null}
						</div>
					</Card>
				</div>
			)}

			{/* Restore data dialog */}
			<Dialog
				open={showRestorePrompt}
				onOpenChange={() => {
					/* Prevent closing by clicking outside */
				}}
			>
				<DialogContent
					className="sm:max-w-md"
					showCloseButton={false}
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<div className="flex items-center gap-2">
							<AlertTriangle className="w-5 h-5 text-amber-500" />
							<DialogTitle>Previous Session Found</DialogTitle>
						</div>
						<DialogDescription>
							Form data from{" "}
							{storedDataAge ? formatAge(storedDataAge) : "earlier"} is
							available. Would you like to restore your previous work or start
							fresh?
							<br />
							<span className="text-md text-muted-foreground/80 mt-1 block">
								Note: Images are not saved and will need to be set again.
							</span>
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 mt-4">
						<Button onClick={handleRestore} className="flex-1">
							Restore Previous Work
						</Button>
						<Button
							variant="outline"
							onClick={handleDiscard}
							className="flex-1"
						>
							Start Fresh
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
