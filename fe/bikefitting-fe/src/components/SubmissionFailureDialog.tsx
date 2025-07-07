import { AlertTriangle, Download, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface SubmissionFailureDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: any;
	error: string;
}

export function SubmissionFailureDialog({
	open,
	onOpenChange,
	formData,
	error,
}: SubmissionFailureDialogProps) {
	const downloadFailedSubmissionData = () => {
		try {
			// Format the data same as view page JSON download
			const jsonString = JSON.stringify(formData, null, 2);

			// Generate filename with timestamp for failed submission
			const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
			const cleanName = formData.fullName
				? formData.fullName.replace(/\s+/g, "")
				: "Unknown";
			const filename = `FAILED-${cleanName}-${timestamp}-bike-fitting.json`;

			const blob = new Blob([jsonString], {
				type: "application/json;charset=utf-8;",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("Failed submission data downloaded", {
				description: "JSON file saved for manual processing",
				duration: 5000,
			});
		} catch (downloadError) {
			toast.error("Failed to download backup data", {
				description: "Could not create backup file",
				duration: 5000,
			});
		}
	};

	const handleClose = () => {
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
						<AlertTriangle className="h-5 w-5" />
						Submission Failed
					</DialogTitle>
					<DialogDescription>
						The bike fitting form could not be submitted due to a server error.
						Please download the form data for manual processing.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 mt-4">
					{/* Error Details */}
					<div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
						<h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
							Error Details:
						</h4>
						<p className="text-sm text-red-700 dark:text-red-300 font-mono break-words">
							{error}
						</p>
					</div>

					{/* Instructions */}
					<div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
						<h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
							What to do:
						</h4>
						<ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
							<li>1. Download the form data using the button below</li>
							<li>2. Contact me with downloaded file</li>
						</ol>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-4">
						<Button
							onClick={downloadFailedSubmissionData}
							className="flex-1 flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							Download Form Data
						</Button>
						<Button
							variant="outline"
							onClick={handleClose}
							className="flex items-center gap-2"
						>
							<X className="h-4 w-4" />
							Close
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
