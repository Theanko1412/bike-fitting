import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Download, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

// Mock data structure for the bike fitting records
interface BikeFittingRecord {
	id: string;
	fullName: string;
	date: string;
}

// Generate thousands of mock records programmatically
const generateMockData = (count: number): BikeFittingRecord[] => {
	const firstNames = [
		"John",
		"Jane",
		"Mike",
		"Sarah",
		"David",
		"Lisa",
		"Tom",
		"Anna",
		"Chris",
		"Emma",
		"James",
		"Maria",
		"Robert",
		"Linda",
		"Michael",
		"Patricia",
		"Christopher",
		"Barbara",
		"Daniel",
		"Nancy",
		"Matthew",
		"Betty",
		"Anthony",
		"Helen",
		"Mark",
		"Sandra",
		"Donald",
		"Donna",
		"Steven",
		"Carol",
		"Paul",
		"Ruth",
		"Andrew",
		"Sharon",
		"Joshua",
		"Michelle",
		"Kenneth",
		"Laura",
		"Kevin",
		"Sarah",
		"Brian",
		"Kimberly",
		"George",
		"Deborah",
		"Timothy",
		"Dorothy",
		"Ronald",
		"Lisa",
		"Jason",
		"Nancy",
	];

	const lastNames = [
		"Smith",
		"Johnson",
		"Williams",
		"Brown",
		"Jones",
		"Garcia",
		"Miller",
		"Davis",
		"Rodriguez",
		"Martinez",
		"Hernandez",
		"Lopez",
		"Gonzalez",
		"Wilson",
		"Anderson",
		"Thomas",
		"Taylor",
		"Moore",
		"Jackson",
		"Martin",
		"Lee",
		"Perez",
		"Thompson",
		"White",
		"Harris",
		"Sanchez",
		"Clark",
		"Ramirez",
		"Lewis",
		"Robinson",
		"Walker",
		"Young",
		"Allen",
		"King",
		"Wright",
		"Scott",
		"Torres",
		"Nguyen",
		"Hill",
		"Flores",
		"Green",
		"Adams",
		"Nelson",
		"Baker",
		"Hall",
		"Rivera",
		"Campbell",
		"Mitchell",
		"Carter",
		"Roberts",
		"Gomez",
		"Phillips",
		"Evans",
	];

	const records: BikeFittingRecord[] = [];

	for (let i = 0; i < count; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

		// Generate random date between 2023-01-01 and 2024-12-31
		const startDate = new Date("2023-01-01");
		const endDate = new Date("2024-12-31");
		const randomTime =
			startDate.getTime() +
			Math.random() * (endDate.getTime() - startDate.getTime());
		const randomDate = new Date(randomTime);

		records.push({
			id: `${i + 1}`,
			fullName: `${firstName} ${lastName}`,
			date: randomDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
		});
	}

	return records;
};

// Generate 5000 mock records
const mockData = generateMockData(5000);

// Mock API function to simulate backend data fetching
const fetchBikeFittingRecords = async ({
	pageParam = 0,
	searchTerm = "",
}: {
	pageParam?: number;
	searchTerm?: string;
}): Promise<{
	data: BikeFittingRecord[];
	nextPage: number | null;
	hasMore: boolean;
}> => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 300));

	// Filter data based on search term
	const filteredData = mockData.filter((record) =>
		record.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Simulate pagination
	const pageSize = 50; // Increased page size for better performance with virtualization
	const startIndex = pageParam * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedData = filteredData.slice(startIndex, endIndex);

	return {
		data: paginatedData,
		nextPage: endIndex < filteredData.length ? pageParam + 1 : null,
		hasMore: endIndex < filteredData.length,
	};
};

export function SearchPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeSearch, setActiveSearch] = useState("");
	const navigate = useNavigate();
	const parentRef = useRef<HTMLDivElement>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery({
		queryKey: ["bikeFittingRecords", activeSearch],
		queryFn: ({ pageParam = 0 }) =>
			fetchBikeFittingRecords({ pageParam, searchTerm: activeSearch }),
		getNextPageParam: (lastPage) => lastPage.nextPage,
		initialPageParam: 0,
	});

	// Flatten all pages data
	const allRecords = data?.pages.flatMap((page) => page.data) ?? [];

	// Set up virtualizer
	const virtualizer = useVirtualizer({
		count: allRecords.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 60, // Estimated row height
		overscan: 5,
	});

	// Handle infinite scroll
	useEffect(() => {
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

	const handleSearch = () => {
		setActiveSearch(searchTerm);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleRowClick = (id: string) => {
		navigate({ to: `/view/${id}` });
	};

	const handleDownload = (e: React.MouseEvent, id: string) => {
		e.stopPropagation(); // Prevent row click when clicking download
		// TODO: Implement download functionality
		console.log(`Download clicked for record ${id}`);
	};

	return (
		<div className="min-h-screen bg-background text-foreground py-8 px-4">
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Search Bike Fitting Records</h1>
					<ThemeToggle />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Search Records</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Search Section */}
						<div className="flex gap-2">
							<Input
								placeholder="Search by name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyPress={handleKeyPress}
								className="flex-1"
							/>
							<Button onClick={handleSearch} disabled={isLoading}>
								<Search className="h-4 w-4 mr-2" />
								Search
							</Button>
						</div>

						{/* Virtualized Table */}
						<div className="border rounded-lg overflow-hidden">
							{/* Table Header */}
							<div className="bg-muted/50 border-b">
								<div className="grid grid-cols-12 gap-4 p-4 font-medium">
									<div className="col-span-5">Full Name</div>
									<div className="col-span-5">Date</div>
									<div className="col-span-2 text-center">Pdf</div>
								</div>
							</div>

							{/* Virtualized Content */}
							<div ref={parentRef} className="h-96 overflow-auto">
								{isLoading ? (
									<div className="flex items-center justify-center h-full">
										<div className="text-muted-foreground">Loading...</div>
									</div>
								) : error ? (
									<div className="flex items-center justify-center h-full">
										<div className="text-red-500">Error loading records</div>
									</div>
								) : allRecords.length === 0 ? (
									<div className="flex items-center justify-center h-full">
										<div className="text-muted-foreground">
											No records found
										</div>
									</div>
								) : (
									<div
										style={{
											height: `${virtualizer.getTotalSize()}px`,
											width: "100%",
											position: "relative",
										}}
									>
										{virtualizer.getVirtualItems().map((virtualItem) => {
											const record = allRecords[virtualItem.index];
											if (!record) return null;

											return (
												<div
													key={virtualItem.key}
													style={{
														position: "absolute",
														top: 0,
														left: 0,
														width: "100%",
														height: `${virtualItem.size}px`,
														transform: `translateY(${virtualItem.start}px)`,
													}}
													className="border-b hover:bg-muted/50 cursor-pointer"
													onClick={() => handleRowClick(record.id)}
												>
													<div className="grid grid-cols-12 gap-4 p-4 items-center h-full">
														<div className="col-span-5 font-medium">
															{record.fullName}
														</div>
														<div className="col-span-5">
															{new Date(record.date).toLocaleDateString()}
														</div>
														<div className="col-span-2 flex justify-center">
															<Button
																variant="outline"
																size="sm"
																onClick={(e) => handleDownload(e, record.id)}
															>
																<Download className="h-4 w-4" />
															</Button>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>

						{/* Loading indicator and record count */}
						{isFetchingNextPage && (
							<div className="text-center py-2">
								<div className="text-sm text-muted-foreground">
									Loading more records...
								</div>
							</div>
						)}

						{/* Show total records count */}
						{allRecords.length > 0 && (
							<div className="text-sm text-muted-foreground text-center">
								Showing {allRecords.length} records
								{hasNextPage && " • Scroll down to load more"}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
