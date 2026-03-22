"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseYmd(ymd: string): Date | undefined {
	if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return undefined;
	const d = new Date(`${ymd}T12:00:00`);
	return Number.isNaN(d.getTime()) ? undefined : d;
}

export interface SubmissionDateRangePickerProps {
	/** yyyy-MM-dd */
	from: string;
	/** yyyy-MM-dd */
	to: string;
	onChange: (from: string, to: string) => void;
	disabled?: boolean;
	className?: string;
}

/**
 * shadcn-style range picker (Popover + Calendar mode="range") for submission date filters.
 */
export function SubmissionDateRangePicker({
	from,
	to,
	onChange,
	disabled = false,
	className,
}: SubmissionDateRangePickerProps) {
	const [open, setOpen] = React.useState(false);

	const selected: DateRange | undefined = React.useMemo(() => {
		const a = parseYmd(from);
		const b = parseYmd(to);
		if (!a && !b) return undefined;
		return { from: a, to: b ?? a };
	}, [from, to]);

	const label = React.useMemo(() => {
		const a = parseYmd(from);
		const b = parseYmd(to);
		if (!a || !b) return "Pick a date range";
		if (format(a, "yyyy-MM-dd") === format(b, "yyyy-MM-dd")) {
			return format(a, "PPP");
		}
		return `${format(a, "LLL d, y")} – ${format(b, "LLL d, y")}`;
	}, [from, to]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal h-11",
						!from && !to && "text-muted-foreground",
						className,
					)}
					aria-expanded={open}
				>
					<CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
					<span className="truncate">{label}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					numberOfMonths={2}
					defaultMonth={selected?.from ?? selected?.to}
					selected={selected}
					onSelect={(range) => {
						if (!range) return;
						if (range.from) {
							const fromStr = format(range.from, "yyyy-MM-dd");
							const toStr = range.to ? format(range.to, "yyyy-MM-dd") : fromStr;
							onChange(fromStr, toStr);
						}
						if (range.from && range.to) {
							setOpen(false);
						}
					}}
					disabled={disabled}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
