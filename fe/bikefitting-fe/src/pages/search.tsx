import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	ArrowLeft,
	Calendar,
	Download,
	FileText,
	RefreshCw,
	Search,
	User,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { formatDate } from "../lib/utils";
import {
	type BikeFittingRecord,
	BikeFittingService,
} from "../services/bikeFittingService";

const ITEMS_PER_PAGE = 50;

export default function SearchPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	// Debounce search term
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		refetch,
		isRefetching,
	} = useInfiniteQuery({
		queryKey: ["bikeFittingRecords", debouncedSearchTerm],
		queryFn: async ({ pageParam }) => {
			try {
				return await BikeFittingService.searchRecords({
					page: pageParam,
					size: ITEMS_PER_PAGE,
					search: debouncedSearchTerm,
				});
			} catch (error) {
				// Only show error toast for API failures
				toast.error("Failed to fetch records", {
					description:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
					duration: 5000,
				});
				throw error;
			}
		},
		getNextPageParam: (lastPage) => {
			return lastPage.hasMore ? lastPage.nextPage : undefined;
		},
		initialPageParam: 0,
		staleTime: 30 * 1000,
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const allRecords = useMemo(() => {
		return data?.pages.flatMap((page) => page.data) ?? [];
	}, [data]);

	const parentRef = React.useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: hasNextPage ? allRecords.length + 1 : allRecords.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 80,
		overscan: 5,
	});

	React.useEffect(() => {
		const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

		if (!lastItem) return;

		if (
			lastItem.index >= allRecords.length - 1 &&
			hasNextPage &&
			!isFetchingNextPage
		) {
			fetchNextPage();
		}
	}, [
		hasNextPage,
		fetchNextPage,
		allRecords.length,
		isFetchingNextPage,
		virtualizer.getVirtualItems(),
	]);

	const handleDownload = async (record: BikeFittingRecord) => {
		if (!record.hasFile) {
			toast.warning("No file available for download", {
				description: "This record does not have an associated PDF file",
				duration: 5000,
			});
			return;
		}

		try {
			await BikeFittingService.downloadPdf(record.id, {
				fullName: record.fullName,
				date: record.date,
			});
			toast.success("PDF downloaded successfully", {
				description: `Downloaded bike fitting report for ${record.fullName}`,
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
	};

	const getRowContent = (index: number) => {
		const record = allRecords[index];

		if (!record) {
			return (
				<div className="flex items-center justify-center py-4">
					<div className="text-sm text-muted-foreground">Loading...</div>
				</div>
			);
		}

		return (
			<Link
				to="/view/$id"
				params={{ id: record.id.toString() }}
				className="block hover:bg-muted/50 transition-colors rounded-md p-3 mx-2"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 min-w-0 flex-1">
						<div className="flex-shrink-0">
							<User className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="font-medium truncate">{record.fullName}</div>
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<Calendar className="h-3 w-3" />
								{formatDate(record.date)}
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-shrink-0">
						{record.hasFile && (
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleDownload(record);
								}}
								className="flex items-center gap-1"
							>
								<Download className="h-3 w-3" />
								Download PDF
							</Button>
						)}
					</div>
				</div>
			</Link>
		);
	};

	return (
		<div className="min-h-screen bg-background text-foreground p-4">
			<div className="max-w-4xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Button variant="outline" asChild>
								<Link to="/">
									<ArrowLeft className="h-4 w-4" />
								</Link>
							</Button>
							<h1 className="text-3xl font-bold">Search Bike Fittings</h1>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<Input
								placeholder="Search by name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="flex-1"
							/>
						</div>

						{isError && (
							<div className="text-center py-8 text-destructive">
								<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Failed to load records. Please try again.</p>
							</div>
						)}

						{isLoading && (
							<div className="text-center py-8">
								<div className="text-muted-foreground">Loading records...</div>
							</div>
						)}

						{!isLoading && !isError && allRecords.length === 0 && (
							<div className="text-center py-8 text-muted-foreground">
								<FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No records found.</p>
							</div>
						)}

						{!isLoading && !isError && allRecords.length > 0 && (
							<div className="border rounded-lg">
								<div
									ref={parentRef}
									className="h-[600px] overflow-auto"
									style={{
										contain: "strict",
									}}
								>
									<div
										style={{
											height: `${virtualizer.getTotalSize()}px`,
											width: "100%",
											position: "relative",
										}}
									>
										{virtualizer.getVirtualItems().map((virtualItem) => (
											<div
												key={virtualItem.index}
												style={{
													position: "absolute",
													top: 0,
													left: 0,
													width: "100%",
													height: `${virtualItem.size}px`,
													transform: `translateY(${virtualItem.start}px)`,
												}}
											>
												{virtualItem.index < allRecords.length ? (
													getRowContent(virtualItem.index)
												) : (
													<div className="flex items-center justify-center py-4">
														<div className="text-sm text-muted-foreground">
															{isFetchingNextPage
																? "Loading more..."
																: hasNextPage
																	? "Load more"
																	: "No more records"}
														</div>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{!isLoading && !isError && allRecords.length > 0 && (
							<div className="text-center space-y-2">
								<div className="text-sm text-muted-foreground">
									Showing {allRecords.length} record
									{allRecords.length !== 1 ? "s" : ""}
									{debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => refetch()}
									disabled={isRefetching}
									className="h-8 px-3"
								>
									<RefreshCw
										className={`h-3 w-3 mr-2 ${isRefetching ? "animate-spin" : ""}`}
									/>
									{isRefetching ? "Refreshing..." : "Refresh"}
								</Button>
							</div>
						)}

						{/* Always show footer with refresh button */}
						{(isError ||
							(isLoading && allRecords.length === 0) ||
							(!isLoading && !isError && allRecords.length === 0)) && (
							<div className="text-center space-y-2 pt-4 border-t">
								{isError && (
									<div className="text-sm text-muted-foreground">
										Connection failed - use refresh to retry
									</div>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={() => refetch()}
									disabled={isRefetching}
									className="h-8 px-3"
								>
									<RefreshCw
										className={`h-3 w-3 mr-2 ${isRefetching ? "animate-spin" : ""}`}
									/>
									{isRefetching ? "Refreshing..." : "Refresh"}
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
