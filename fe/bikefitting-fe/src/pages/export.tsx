import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format, formatDistanceStrict, subDays } from "date-fns";
import {
	AlertCircle,
	CheckCircle2,
	Download,
	FileSpreadsheet,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SubmissionDateRangePicker } from "../components/export-submission-date-range";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";
import {
	type BikeFittingExportSummary,
	BikeFittingService,
} from "../services/bikeFittingService";

const EXPORTS_PAGE_SIZE = 20;

function formatInstant(iso: string): string {
	try {
		return format(new Date(iso), "PPpp");
	} catch {
		return iso;
	}
}

export default function ExportPage() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [fromDate, setFromDate] = useState(() =>
		format(subDays(new Date(), 30), "yyyy-MM-dd"),
	);
	const [toDate, setToDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
	const [selectedFitters, setSelectedFitters] = useState<Set<string>>(
		new Set(),
	);
	const [exporting, setExporting] = useState(false);

	const fittersQuery = useQuery({
		queryKey: ["exportFitters"],
		queryFn: () => BikeFittingService.getFitters(),
		staleTime: 5 * 60 * 1000,
	});

	const {
		data: exportPages,
		error: exportError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: exportsLoading,
		isError: exportsIsError,
		refetch: refetchExports,
		isRefetching: exportsRefetching,
	} = useInfiniteQuery({
		queryKey: ["bikeFittingExports"],
		queryFn: async ({ pageParam }) => {
			return await BikeFittingService.listExports({
				page: pageParam,
				size: EXPORTS_PAGE_SIZE,
			});
		},
		getNextPageParam: (lastPage) => {
			return lastPage.hasMore ? lastPage.nextPage : undefined;
		},
		initialPageParam: 0,
		staleTime: 30 * 1000,
	});

	const allExports = useMemo(() => {
		return exportPages?.pages.flatMap((p) => p.data) ?? [];
	}, [exportPages]);

	const exportsScrollRef = useRef<HTMLDivElement>(null);

	const exportsVirtualizer = useVirtualizer({
		count: hasNextPage ? allExports.length + 1 : allExports.length,
		getScrollElement: () => exportsScrollRef.current,
		estimateSize: () => 176,
		overscan: 4,
		measureElement:
			typeof window !== "undefined" &&
			typeof navigator !== "undefined" &&
			!navigator.userAgent.includes("Firefox")
				? (el) => el.getBoundingClientRect().height
				: undefined,
	});

	useEffect(() => {
		const [lastItem] = [...exportsVirtualizer.getVirtualItems()].reverse();
		if (!lastItem) return;
		if (
			lastItem.index >= allExports.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [
		hasNextPage,
		fetchNextPage,
		allExports.length,
		isFetchingNextPage,
		exportsVirtualizer.getVirtualItems(),
	]);

	const toggleFitter = (name: string) => {
		setSelectedFitters((prev) => {
			const next = new Set(prev);
			if (next.has(name)) next.delete(name);
			else next.add(name);
			return next;
		});
	};

	const clearFitters = () => setSelectedFitters(new Set());

	const handleGenerate = async () => {
		if (!fromDate || !toDate) {
			toast.error("Choose both start and end dates");
			return;
		}
		if (fromDate > toDate) {
			toast.error("Start date must be on or before end date");
			return;
		}
		setExporting(true);
		try {
			const fitterNames =
				selectedFitters.size > 0 ? Array.from(selectedFitters) : undefined;
			await BikeFittingService.downloadExportCsv({
				from: fromDate,
				to: toDate,
				fitterNames,
			});
			toast.success("Export downloaded", {
				description: "CSV uses UTF-8 with BOM for Excel.",
			});
			setDialogOpen(false);
			await refetchExports();
		} catch (e) {
			toast.error("Export failed", {
				description:
					e instanceof Error ? e.message : "An unexpected error occurred",
			});
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				<PageHeader backTo="/" title="Export data (CSV)" />

				<Card>
					<CardContent className="pt-6 space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<p className="text-sm text-muted-foreground max-w-xl">
								Download rows as CSV for Excel. Filter by submission date range
								and, if you want, specific fitters.
							</p>
							<Button
								onClick={() => setDialogOpen(true)}
								className="shrink-0 gap-2"
							>
								<Download className="h-4 w-4" />
								Generate export
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="space-y-4 pt-6">
						<div className="flex items-center justify-between gap-2">
							<h2 className="text-lg font-semibold flex items-center gap-2">
								<FileSpreadsheet className="h-5 w-5" />
								Past exports
							</h2>
							<Button
								variant="outline"
								size="sm"
								onClick={() => refetchExports()}
								disabled={exportsRefetching}
								className="gap-2"
							>
								<RefreshCw
									className={cn("h-4 w-4", exportsRefetching && "animate-spin")}
								/>
								Refresh
							</Button>
						</div>

						{exportsIsError && (
							<div className="text-center py-6 text-destructive text-sm">
								{exportError instanceof Error
									? exportError.message
									: "Failed to load export history"}
							</div>
						)}

						{exportsLoading && (
							<div className="text-center py-8 text-muted-foreground text-sm">
								Loading history...
							</div>
						)}

						{!exportsLoading && !exportsIsError && allExports.length === 0 && (
							<div className="text-center py-8 text-muted-foreground text-sm">
								No exports yet. Generate one to see it here.
							</div>
						)}

						{!exportsLoading && !exportsIsError && allExports.length > 0 && (
							<div className="border rounded-lg">
								<div
									ref={exportsScrollRef}
									className="h-[600px] overflow-auto"
									style={{ contain: "strict" }}
								>
									<div
										style={{
											height: `${exportsVirtualizer.getTotalSize()}px`,
											width: "100%",
											position: "relative",
										}}
									>
										{exportsVirtualizer.getVirtualItems().map((virtualItem) => (
											<div
												key={virtualItem.key}
												data-index={virtualItem.index}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: `${virtualItem.size}px`,
													transform: `translateY(${virtualItem.start}px)`,
												}}
											>
												{virtualItem.index < allExports.length ? (
													<div
														ref={exportsVirtualizer.measureElement}
														className="px-2 pb-2 pt-0.5"
													>
														<ExportHistoryRow
															item={allExports[virtualItem.index]!}
														/>
													</div>
												) : (
													<div className="flex items-center justify-center py-4">
														<div className="text-sm text-muted-foreground">
															{isFetchingNextPage
																? "Loading more..."
																: hasNextPage
																	? "Scroll for more"
																	: "End of list"}
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Generate CSV export</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label>Submission date range</Label>
							<SubmissionDateRangePicker
								from={fromDate}
								to={toDate}
								disabled={exporting}
								onChange={(from, to) => {
									setFromDate(from);
									setToDate(to);
								}}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between gap-2">
								<Label>Fitters (optional)</Label>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-8"
									onClick={clearFitters}
								>
									Clear selection
								</Button>
							</div>
							<p className="text-xs text-muted-foreground">
								Leave none selected to include every fitter.
							</p>
							{fittersQuery.isLoading && (
								<p className="text-sm text-muted-foreground">
									Loading fitters…
								</p>
							)}
							{fittersQuery.isError && (
								<p className="text-sm text-destructive">
									Could not load fitter list
								</p>
							)}
							{fittersQuery.data && fittersQuery.data.length > 0 && (
								<ScrollArea className="h-[220px] rounded-md border border-border bg-muted/20 p-2">
									<ul className="space-y-2 pr-2">
										{fittersQuery.data.map((name) => (
											<li
												key={name}
												className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 shadow-xs hover:bg-muted/40"
											>
												<Checkbox
													id={`fitter-${name}`}
													checked={selectedFitters.has(name)}
													onCheckedChange={() => toggleFitter(name)}
												/>
												<Label
													htmlFor={`fitter-${name}`}
													className="text-sm font-normal cursor-pointer flex-1 truncate leading-none"
												>
													{name}
												</Label>
											</li>
										))}
									</ul>
								</ScrollArea>
							)}
							{fittersQuery.data?.length === 0 && !fittersQuery.isLoading && (
								<p className="text-sm text-muted-foreground">
									No fitter names found in the database yet.
								</p>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDialogOpen(false)}
							disabled={exporting}
						>
							Cancel
						</Button>
						<Button onClick={handleGenerate} disabled={exporting}>
							{exporting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Exporting…
								</>
							) : (
								<>
									<Download className="h-4 w-4 mr-2" />
									Download CSV
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function ExportHistoryRow({ item }: { item: BikeFittingExportSummary }) {
	const duration =
		item.completedAt && item.startedAt
			? formatDistanceStrict(
					new Date(item.startedAt),
					new Date(item.completedAt),
					{ addSuffix: false },
				)
			: null;

	return (
		<div
			className={cn(
				"rounded-lg border p-3 text-sm space-y-1",
				item.status === "FAILED" && "border-destructive/50 bg-destructive/5",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					{item.status === "COMPLETED" ? (
						<CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
					) : item.status === "FAILED" ? (
						<AlertCircle className="h-4 w-4 text-destructive shrink-0" />
					) : (
						<Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
					)}
					<span className="font-medium truncate">
						{item.filterFrom} → {item.filterTo}
					</span>
				</div>
				<span
					className={cn(
						"text-xs uppercase shrink-0 px-2 py-0.5 rounded",
						item.status === "COMPLETED" &&
							"bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
						item.status === "FAILED" && "bg-destructive/15 text-destructive",
						item.status === "RUNNING" && "bg-muted text-muted-foreground",
					)}
				>
					{item.status}
				</span>
			</div>
			<div className="text-muted-foreground text-xs pl-6 space-y-0.5">
				<div>Started: {formatInstant(item.startedAt)}</div>
				{item.completedAt && (
					<div>Finished: {formatInstant(item.completedAt)}</div>
				)}
				{duration && <div>Duration: {duration}</div>}
				{item.rowCount != null && <div>Rows: {item.rowCount}</div>}
				<div>
					Fitters:{" "}
					{item.filterFitters.length === 0
						? "All"
						: item.filterFitters.join(", ")}
				</div>
				{item.requestedByUsername && <div>By: {item.requestedByUsername}</div>}
				{item.suggestedFilename && (
					<div className="truncate" title={item.suggestedFilename}>
						File: {item.suggestedFilename}
					</div>
				)}
				{item.errorMessage && (
					<div className="text-destructive break-words">
						{item.errorMessage}
					</div>
				)}
			</div>
		</div>
	);
}
