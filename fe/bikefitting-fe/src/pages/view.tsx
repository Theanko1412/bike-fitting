import { useParams } from "@tanstack/react-router";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";

export function ViewPage() {
	const { id } = useParams({ from: "/view/$id" });

	return (
		<div className="min-h-screen bg-background text-foreground py-8 px-4">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-bold">View Record</h1>
					</div>
					<ThemeToggle />
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Bike Fitting Record Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-semibold text-lg mb-2">
									Record Information
								</h3>
								<p className="text-sm text-muted-foreground">
									Record ID:{" "}
									<span className="font-mono bg-muted px-2 py-1 rounded">
										{id}
									</span>
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-lg mb-2">Actions</h3>
								<div className="flex gap-2">
									<Button variant="outline" size="sm">
										Edit Record
									</Button>
									<Button variant="outline" size="sm">
										Download PDF
									</Button>
								</div>
							</div>
						</div>

						<div className="border-t pt-4">
							<p className="text-muted-foreground">
								This is a placeholder for the detailed view of the bike fitting
								record. Here you would display all the form data, measurements,
								and fitting results.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
