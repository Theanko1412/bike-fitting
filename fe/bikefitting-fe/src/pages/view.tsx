import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Download,
	FileText,
	Image as ImageIcon,
	Mail,
	User,
	X,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { formatDate } from "../lib/utils";
import { BikeFittingService } from "../services/bikeFittingService";

export default function ViewPage() {
	const { id } = useParams({ strict: false });
	const [selectedImage, setSelectedImage] = React.useState<{
		src: string;
		title: string;
	} | null>(null);
	const [shouldFetchPdf, setShouldFetchPdf] = React.useState(false);

	const {
		data: record,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["bikeFittingRecord", id],
		queryFn: async () => {
			if (!id) {
				throw new Error("Record ID is required");
			}

			try {
				return await BikeFittingService.getRecordById(id);
			} catch (error) {
				// Only show error toast for API failures
				toast.error("Failed to load record", {
					description:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
					duration: 5000,
				});
				throw error;
			}
		},
		enabled: !!id,
		// Optimized caching for immutable records with large image data
		staleTime: 12 * 60 * 60 * 1000, // 12 hours - records never change once created
		gcTime: 30 * 60 * 1000, // 30 minutes - cleanup unused records to manage memory
		retry: 1, // Only retry once for failed requests
		refetchOnWindowFocus: false, // Don't refetch when window gains focus
		refetchOnReconnect: false, // Don't refetch when network reconnects
	});

	// Cached PDF blob query - only enabled when download is requested
	const {
		data: pdfData,
		isLoading: isPdfLoading,
		error: pdfError,
	} = useQuery({
		queryKey: ["bikeFittingPdf", id],
		queryFn: async () => {
			if (!id) {
				throw new Error("Record ID is required");
			}
			return await BikeFittingService.fetchPdfBlob(id);
		},
		enabled: !!id && !!record?.pdfFile && shouldFetchPdf, // Only fetch when explicitly requested
		// Aggressive caching for immutable PDF files
		staleTime: 24 * 60 * 60 * 1000, // 24 hours - PDFs never change
		gcTime: 10 * 60 * 1000, // 10 minutes - cleanup to manage memory (PDFs can be large)
		retry: 1, // Only retry once for failed requests
		refetchOnWindowFocus: false, // Don't refetch when window gains focus
		refetchOnReconnect: false, // Don't refetch when network reconnects
	});

	// Auto-download when PDF data becomes available after being requested
	React.useEffect(() => {
		if (shouldFetchPdf && !isPdfLoading && record) {
			if (pdfData) {
				// PDF fetch succeeded - trigger download
				try {
					let filename = pdfData.filename;

					// Generate fallback filename if needed (same logic as backend)
					if (!filename || filename === "bike-fitting-report.pdf") {
						const cleanFullName = record.fullName.replace(/ /g, ""); // Remove all spaces
						const dateString = record.date; // Already in yyyy-mm-dd format
						filename = `${cleanFullName}-${dateString}-bike-fitting-report.pdf`;
					}

					// Create download using cached blob
					const downloadUrl = window.URL.createObjectURL(pdfData.blob);
					const link = document.createElement("a");
					link.href = downloadUrl;
					link.download = filename;
					document.body.appendChild(link);
					link.click();

					// Cleanup
					document.body.removeChild(link);
					window.URL.revokeObjectURL(downloadUrl);

					toast.success("PDF downloaded successfully", {
						description: "The bike fitting report has been downloaded",
						duration: 3000,
					});
				} catch (error) {
					toast.error("Failed to download PDF", {
						description:
							error instanceof Error
								? error.message
								: "An unexpected error occurred while downloading the PDF",
						duration: 5000,
					});
				}
			} else if (pdfError) {
				// PDF fetch failed - fall back to direct download
				BikeFittingService.downloadPdf(record.id, {
					fullName: record.fullName,
					date: record.date,
				})
					.then(() => {
						toast.success("PDF downloaded successfully", {
							description: "The bike fitting report has been downloaded",
							duration: 3000,
						});
					})
					.catch((error) => {
						toast.error("Failed to download PDF", {
							description:
								error instanceof Error
									? error.message
									: "An unexpected error occurred while downloading the PDF",
							duration: 5000,
						});
					});
			}
		}
	}, [shouldFetchPdf, pdfData, isPdfLoading, pdfError, record]);

	const handleDownload = async () => {
		if (!record?.pdfFile) {
			toast.warning("No file available for download", {
				description: "This record does not have an associated PDF file",
				duration: 5000,
			});
			return;
		}

		// If we already have cached PDF data, use it immediately
		if (pdfData && !pdfError) {
			try {
				// Use cached PDF data for download
				let filename = pdfData.filename;

				// Generate fallback filename if needed (same logic as backend)
				if (!filename || filename === "bike-fitting-report.pdf") {
					const cleanFullName = record.fullName.replace(/ /g, ""); // Remove all spaces
					const dateString = record.date; // Already in yyyy-mm-dd format
					filename = `${cleanFullName}-${dateString}-bike-fitting-report.pdf`;
				}

				// Create download using cached blob
				const downloadUrl = window.URL.createObjectURL(pdfData.blob);
				const link = document.createElement("a");
				link.href = downloadUrl;
				link.download = filename;
				document.body.appendChild(link);
				link.click();

				// Cleanup
				document.body.removeChild(link);
				window.URL.revokeObjectURL(downloadUrl);

				toast.success("PDF downloaded successfully", {
					description: "The bike fitting report has been downloaded (cached)",
					duration: 3000,
				});
				return;
			} catch (error) {
				toast.error("Failed to download PDF", {
					description:
						error instanceof Error
							? error.message
							: "An unexpected error occurred while downloading the PDF",
					duration: 5000,
				});
				return;
			}
		}

		// If PDF is currently loading, just return (download will happen automatically)
		if (isPdfLoading) {
			return;
		}

		// If we don't have cached data, trigger the fetch
		if (!shouldFetchPdf) {
			setShouldFetchPdf(true);
			return;
		}

		// If there's an error with PDF fetch, fall back to direct download
		if (pdfError) {
			try {
				await BikeFittingService.downloadPdf(record.id, {
					fullName: record.fullName,
					date: record.date,
				});
				toast.success("PDF downloaded successfully", {
					description: "The bike fitting report has been downloaded",
					duration: 3000,
				});
			} catch (error) {
				toast.error("Failed to download PDF", {
					description:
						error instanceof Error
							? error.message
							: "An unexpected error occurred while downloading the PDF",
					duration: 5000,
				});
			}
		}
	};

	const downloadImage = (imageData: string, imageType: string) => {
		if (!imageData) {
			toast.warning("No image available", {
				description: "This image is not available for download",
				duration: 5000,
			});
			return;
		}

		try {
			// Format date for filename (YYYY-MM-DD)
			const dateStr = new Date(record!.date).toISOString().split("T")[0];
			const cleanName = record!.fullName.replace(/\s+/g, "");
			const filename = `${cleanName}-${dateStr}-${imageType}.jpg`;

			const link = document.createElement("a");
			link.href = imageData;
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("Image downloaded successfully");
		} catch (error) {
			toast.error("Failed to download image", {
				description: "An error occurred while downloading the image",
				duration: 5000,
			});
		}
	};

	const convertToCSV = (data: any) => {
		// Exclude image fields and fitter object from CSV export
		const excludeFields = [
			"initialRiderPhoto",
			"finalRiderPhoto",
			"forwardSpinalFlexionPhoto",
			"fitter",
		];
		const filteredData = Object.fromEntries(
			Object.entries(data).filter(([key]) => !excludeFields.includes(key)),
		);

		// Add fitterFullName from the record level (not from fitter object)
		if (record?.fitterFullName) {
			filteredData.fitterFullName = record.fitterFullName;
		}

		// Create CSV headers and values
		const headers = Object.keys(filteredData);
		const values = Object.values(filteredData).map((value) => {
			// Handle values that might contain commas or quotes
			if (
				typeof value === "string" &&
				(value.includes(",") || value.includes('"'))
			) {
				return `"${value.replace(/"/g, '""')}"`;
			}
			return value || "";
		});

		return `${headers.join(",")}\n${values.join(",")}`;
	};

	const downloadCSVData = () => {
		if (!record) return;

		try {
			const csvData = convertToCSV(record.jsonForm);

			// Format date for filename (YYYY-MM-DD)
			const dateStr = new Date(record.date).toISOString().split("T")[0];
			const cleanName = record.fullName.replace(/\s+/g, "");
			const filename = `${cleanName}-${dateStr}-bike-fitting.csv`;

			const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("CSV file downloaded successfully");
		} catch (error) {
			toast.error("Failed to download CSV file", {
				description: "Could not download CSV data",
				duration: 5000,
			});
		}
	};

	const downloadJSONData = () => {
		if (!record) return;

		try {
			// Keep JSON as raw form data (as received on frontend)
			const jsonString = JSON.stringify(record.jsonForm, null, 2);

			// Format date for filename (YYYY-MM-DD)
			const dateStr = new Date(record.date).toISOString().split("T")[0];
			const cleanName = record.fullName.replace(/\s+/g, "");
			const filename = `${cleanName}-${dateStr}-bike-fitting.json`;

			const blob = new Blob([jsonString], {
				type: "application/json;charset=utf-8;",
			});
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("JSON file downloaded successfully");
		} catch (error) {
			toast.error("Failed to download JSON file", {
				description: "Could not download JSON data",
				duration: 5000,
			});
		}
	};

	// Helper to calculate and display difference
	const getDifference = (finalVal: any, initialVal: any) => {
		if (!finalVal || !initialVal) return null;

		const final = Number.parseFloat(finalVal);
		const initial = Number.parseFloat(initialVal);

		if (isNaN(final) || isNaN(initial) || final === initial) return null;

		const diff = final - initial;
		const sign = diff > 0 ? "+" : "";

		return (
			<span className="ml-2 text-xs px-2 py-1 rounded-full font-medium bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground">
				{sign}
				{diff}
			</span>
		);
	};

	// Helper to create mailto URL with pre-filled content
	const createMailtoUrl = (email: string) => {
		const subject = `Bike Fitting Report - #${record?.id} - ${formatDate(record?.date || "")}`;
		const body = "this is test message";

		const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		return mailtoUrl;
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background text-foreground p-4">
				<div className="max-w-4xl mx-auto">
					<div className="text-center py-8">
						<div className="text-muted-foreground">Loading record...</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background text-foreground p-4">
				<div className="max-w-4xl mx-auto">
					<div className="text-center py-8 text-destructive">
						<AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Failed to load record. Please try again.</p>
						<Button variant="outline" asChild className="mt-4">
							<Link to="/search">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Search
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!record) {
		return (
			<div className="min-h-screen bg-background text-foreground p-4">
				<div className="max-w-4xl mx-auto">
					<div className="text-center py-8 text-muted-foreground">
						<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Record not found.</p>
						<Button variant="outline" asChild className="mt-4">
							<Link to="/search">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const formData = record.jsonForm;

	return (
		<div className="min-h-screen bg-background text-foreground p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="outline" asChild>
							<Link to="/search">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<h1 className="text-2xl font-bold">Bike Fitting Record</h1>
					</div>
					<Button
						variant="default"
						onClick={handleDownload}
						disabled={!record.pdfFile}
						className="flex items-center gap-2"
					>
						<Download className="h-4 w-4" />
						PDF
					</Button>
				</div>

				{/* Client Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Client Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Full Name
								</label>
								<p className="text-lg font-semibold">{record.fullName}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Fitter
								</label>
								<p className="text-lg">{record.fitterFullName}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Email
								</label>
								<a
									href={createMailtoUrl(formData.email)}
									className="text-lg text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors cursor-pointer"
								>
									<Mail className="h-4 w-4" />
									{formData.email}
								</a>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Phone
								</label>
								<p className="text-lg">{formData.phone}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Date
								</label>
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<p className="text-lg">{formatDate(record.date)}</p>
								</div>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Fitting ID
								</label>
								<p className="text-lg font-mono">#{record.id}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Cycling Experience
								</label>
								<p className="text-lg">{formData.cyclingExperience}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-muted-foreground">
									Cycling Frequency per week
								</label>
								<p className="text-lg">{formData.cyclingFrequency}</p>
							</div>
						</div>

						{(formData.cyclingProblem || formData.cyclingConcerns) && (
							<div className="space-y-3 pt-4 border-t">
								{formData.cyclingProblem && (
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Cycling Problem
										</label>
										<p className="text-base mt-1 p-3 bg-muted/50 rounded-md">
											{formData.cyclingProblem}
										</p>
									</div>
								)}
								{formData.cyclingConcerns && (
									<div>
										<label className="text-sm font-medium text-muted-foreground">
											Cycling Concerns
										</label>
										<p className="text-base mt-1 p-3 bg-muted/50 rounded-md">
											{formData.cyclingConcerns}
										</p>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Rider Photos */}
				{(formData.initialRiderPhoto || formData.finalRiderPhoto) && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ImageIcon className="h-5 w-5" />
								Rider Photos
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{formData.initialRiderPhoto && (
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<h3 className="font-medium">Initial Position</h3>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													downloadImage(
														formData.initialRiderPhoto,
														"initial-position",
													)
												}
											>
												<Download className="h-3 w-3 mr-1" />
												Download
											</Button>
										</div>
										<div
											className="w-full aspect-auto cursor-pointer hover:opacity-80 transition-opacity"
											onClick={() =>
												setSelectedImage({
													src: formData.initialRiderPhoto,
													title: "Initial Rider Position",
												})
											}
										>
											<img
												src={formData.initialRiderPhoto}
												alt="Initial rider position"
												className="w-full h-auto object-contain rounded-lg border bg-muted/50"
											/>
										</div>
									</div>
								)}
								{formData.finalRiderPhoto && (
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<h3 className="font-medium">Final Position</h3>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													downloadImage(
														formData.finalRiderPhoto,
														"final-position",
													)
												}
											>
												<Download className="h-3 w-3 mr-1" />
												Download
											</Button>
										</div>
										<div
											className="w-full aspect-auto cursor-pointer hover:opacity-80 transition-opacity"
											onClick={() =>
												setSelectedImage({
													src: formData.finalRiderPhoto,
													title: "Final Rider Position",
												})
											}
										>
											<img
												src={formData.finalRiderPhoto}
												alt="Final rider position"
												className="w-full h-auto object-contain rounded-lg border bg-muted/50"
											/>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Spinal Flexion Photo */}
				{formData.forwardSpinalFlexionPhoto && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ImageIcon className="h-5 w-5" />
								Forward Spinal Flexion
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-medium">Spinal Flexion Assessment</h3>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											downloadImage(
												formData.forwardSpinalFlexionPhoto,
												"spinal-flexion",
											)
										}
									>
										<Download className="h-3 w-3 mr-1" />
										Download
									</Button>
								</div>
								<div
									className="w-full max-w-md mx-auto aspect-auto cursor-pointer hover:opacity-80 transition-opacity"
									onClick={() =>
										setSelectedImage({
											src: formData.forwardSpinalFlexionPhoto,
											title: "Forward Spinal Flexion Assessment",
										})
									}
								>
									<img
										src={formData.forwardSpinalFlexionPhoto}
										alt="Forward spinal flexion assessment"
										className="w-full h-auto object-contain rounded-lg border bg-muted/50"
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Detailed Form Data */}
				<Card>
					<CardHeader>
						<CardTitle>Detailed Measurements</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Full Body Assessment */}
						<div>
							<h3 className="text-lg font-semibold mb-4">
								Full Body Assessment
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<label className="font-medium text-muted-foreground">
										Ischial Tuberosity
									</label>
									<p>{formData.ischialTuberosity}mm</p>
								</div>
								{/* Forefoot Angulation */}
								<div className="md:col-span-2">
									<label className="font-medium text-muted-foreground">
										Forefoot Angulation Type
									</label>
									<div className="flex gap-4 mt-1">
										<span>Left: {formData.forefootAngulationTypeLeft}</span>
										<span>Right: {formData.forefootAngulationTypeRight}</span>
									</div>
								</div>
								{formData.forefootAngulationSeverityLeft && (
									<div className="md:col-span-2">
										<label className="font-medium text-muted-foreground">
											Forefoot Angulation Severity
										</label>
										<div className="flex gap-4 mt-1">
											<span>
												Left: {formData.forefootAngulationSeverityLeft}
											</span>
											<span>
												Right: {formData.forefootAngulationSeverityRight}
											</span>
										</div>
									</div>
								)}
								{/* ROM Measurements */}
								<div className="md:col-span-2">
									<label className="font-medium text-muted-foreground">
										Hamstring ROM
									</label>
									<div className="flex gap-4 mt-1">
										<span>Left: {formData.hamstringROMLeft}°</span>
										<span>Right: {formData.hamstringROMRight}°</span>
									</div>
								</div>
								<div className="md:col-span-2">
									<label className="font-medium text-muted-foreground">
										Hip ROM
									</label>
									<div className="flex gap-4 mt-1">
										<span>Left: {formData.hipROMLeft}°</span>
										<span>Right: {formData.hipROMRight}°</span>
									</div>
								</div>
								{formData.shoulderROM && (
									<div>
										<label className="font-medium text-muted-foreground">
											Shoulder ROM
										</label>
										<p>{formData.shoulderROM}°</p>
									</div>
								)}
								{formData.advQAngle && (
									<div>
										<label className="font-medium text-muted-foreground">
											Q Angle
										</label>
										<p>{formData.advQAngle}°</p>
									</div>
								)}
							</div>
						</div>

						{/* Initial Bike Measurement */}
						<div>
							<h3 className="text-lg font-semibold mb-4">
								Initial Bike Measurement
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<label className="font-medium text-muted-foreground">
										Bike
									</label>
									<p>
										{formData.bikeBrand} {formData.bikeModel} (
										{formData.bikeYear})
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Saddle
									</label>
									<p>
										{formData.saddleBrand} {formData.saddleModel} -{" "}
										{formData.saddleWidth}mm
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Shoes
									</label>
									<p>
										{formData.shoeBrand} - Size {formData.shoeSize}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Pedals
									</label>
									<p>{formData.pedalsBrand}</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Saddle Height
									</label>
									<p>{formData.saddleHeight}mm</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Saddle Offset
									</label>
									<p>
										{formData.saddleOffset}mm {formData.saddleDirection}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Handlebar Width
									</label>
									<p>{formData.handlebarWidth}cm</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Stem
									</label>
									<p>
										{formData.stemLength}mm @ {formData.stemAngle}°
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Reach to Handlebar
									</label>
									<p>{formData.reachToHandlebar}mm</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Bar Drop from Saddle
									</label>
									<p>{formData.barDropFromSaddle}mm</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Crank Length
									</label>
									<p>{formData.crankLength}mm</p>
								</div>
								{(formData.footbedLeft || formData.footbedRight) && (
									<div>
										<label className="font-medium text-muted-foreground">
											Footbed
										</label>
										<div className="flex gap-4 mt-1">
											<span>Left: {formData.footbedLeft || "None"}</span>
											<span>Right: {formData.footbedRight || "None"}</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Final Bike Measurement */}
						<div>
							<h3 className="text-lg font-semibold mb-4">
								Final Bike Measurement
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<label className="font-medium text-muted-foreground">
										Bike
									</label>
									<p>
										{formData.finalBikeBrand} {formData.finalBikeModel} (
										{formData.finalBikeYear})
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Saddle
									</label>
									<p>
										{formData.finalSaddleBrand} {formData.finalSaddleModel} -{" "}
										{formData.finalSaddleWidth}mm
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Shoes
									</label>
									<p>
										{formData.finalShoeBrand} - Size {formData.finalShoeSize}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Pedals
									</label>
									<p>{formData.finalPedalsBrand}</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Saddle Height
									</label>
									<p>
										{formData.finalSaddleHeight}mm
										{getDifference(
											formData.finalSaddleHeight,
											formData.saddleHeight,
										)}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Saddle Offset
									</label>
									<p>
										{formData.finalSaddleOffset}mm{" "}
										{formData.finalSaddleDirection}
										{getDifference(
											formData.finalSaddleOffset,
											formData.saddleOffset,
										)}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Handlebar Width
									</label>
									<p>
										{formData.finalHandlebarWidth}cm
										{getDifference(
											formData.finalHandlebarWidth,
											formData.handlebarWidth,
										)}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Stem
									</label>
									<p>
										{formData.finalStemLength}mm @ {formData.finalStemAngle}°
										{getDifference(
											formData.finalStemLength,
											formData.stemLength,
										)}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Reach to Handlebar
									</label>
									<p>
										{formData.finalReachToHandlebar}mm
										{getDifference(
											formData.finalReachToHandlebar,
											formData.reachToHandlebar,
										)}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Bar Drop from Saddle
									</label>
									<p>
										{formData.finalBarDropFromSaddle}mm
										{getDifference(
											formData.finalBarDropFromSaddle,
											formData.barDropFromSaddle,
										)}
									</p>
								</div>
								<div>
									<label className="font-medium text-muted-foreground">
										Crank Length
									</label>
									<p>
										{formData.finalCrankLength}mm
										{getDifference(
											formData.finalCrankLength,
											formData.crankLength,
										)}
									</p>
								</div>
								{(formData.finalFootbedLeft || formData.finalFootbedRight) && (
									<div>
										<label className="font-medium text-muted-foreground">
											Footbed
										</label>
										<div className="flex gap-4 mt-1">
											<span>Left: {formData.finalFootbedLeft || "None"}</span>
											<span>Right: {formData.finalFootbedRight || "None"}</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Shoe Setup */}
						<div>
							<h3 className="text-lg font-semibold mb-4">Shoe Setup</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								{(formData.cleatRotationLeft !== undefined ||
									formData.cleatRotationRight !== undefined) && (
									<div className="md:col-span-2">
										<label className="font-medium text-muted-foreground">
											Cleat Rotation
										</label>
										<div className="flex gap-4 mt-1">
											<span>Left: {formData.cleatRotationLeft}°</span>
											<span>Right: {formData.cleatRotationRight}°</span>
										</div>
									</div>
								)}
								{(formData.cleatLateralLeft !== undefined ||
									formData.cleatLateralRight !== undefined) && (
									<div className="md:col-span-2">
										<label className="font-medium text-muted-foreground">
											Cleat Lateral Position
										</label>
										<div className="flex gap-4 mt-1">
											<span>Left: {formData.cleatLateralLeft}mm</span>
											<span>Right: {formData.cleatLateralRight}mm</span>
										</div>
									</div>
								)}
								{(formData.cleatLiftLeft !== undefined ||
									formData.cleatLiftRight !== undefined) && (
									<div className="md:col-span-2">
										<label className="font-medium text-muted-foreground">
											Cleat Lift
										</label>
										<div className="flex gap-4 mt-1">
											<span>Left: {formData.cleatLiftLeft}mm</span>
											<span>Right: {formData.cleatLiftRight}mm</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Download Data */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Download className="h-5 w-5" />
							Download Data
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Button
								onClick={handleDownload}
								disabled={!record.pdfFile}
								className="flex items-center gap-2"
							>
								<FileText className="h-4 w-4" />
								Download PDF Report
							</Button>
							<Button
								variant="outline"
								onClick={downloadCSVData}
								className="flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								Download CSV
							</Button>
							<Button
								variant="outline"
								onClick={downloadJSONData}
								className="flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								Download JSON
							</Button>
						</div>
						{!record.pdfFile && (
							<p className="text-sm text-muted-foreground mt-2">
								PDF report not available for this record
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Image Viewer Modal */}
			<Dialog
				open={!!selectedImage}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogContent
					className="p-0 w-auto max-w-[calc(100vw-0.5rem)] sm:max-w-[calc(100vw-1rem)]"
					showCloseButton={false}
					style={{
						height: "auto",
						maxHeight: "calc(100vh - 0.5rem)",
						minHeight: "auto",
					}}
				>
					<DialogTitle className="sr-only">
						{selectedImage?.title || "Image Viewer"}
					</DialogTitle>

					{selectedImage && (
						<div className="relative p-2 sm:p-4">
							<Button
								variant="outline"
								size="sm"
								className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10"
								onClick={() => setSelectedImage(null)}
								style={{
									backgroundColor: "rgba(0, 0, 0, 0.8)",
									borderColor: "rgba(0, 0, 0, 0.8)",
									color: "white",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
								}}
							>
								<X className="h-4 w-4" />
							</Button>

							<div className="flex flex-col">
								<img
									src={selectedImage.src}
									alt={selectedImage.title}
									className="rounded-lg block max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-4rem)] sm:max-w-[calc(100vw-3rem)] sm:max-h-[calc(100vh-6rem)] w-auto h-auto"
									onClick={(e) => e.stopPropagation()}
								/>

								<div className="mt-2 sm:mt-3 bg-muted/50 rounded-lg p-2">
									<p className="text-xs sm:text-sm font-medium text-center">
										{selectedImage.title}
									</p>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
