import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

type PageHeaderProps = {
	backTo: string;
	title: string;
	/** Right-side actions (e.g. PDF). Omit for no action — layout stays aligned with pages that have a trailing control. */
	right?: ReactNode;
};

export function PageHeader({ backTo, title, right }: PageHeaderProps) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex min-w-0 items-center gap-4">
				<Button variant="outline" asChild className="shrink-0">
					<Link to={backTo}>
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<h1 className="truncate text-2xl font-bold">{title}</h1>
			</div>
			{right != null && (
				<div className="flex shrink-0 items-center gap-2">{right}</div>
			)}
		</div>
	);
}
