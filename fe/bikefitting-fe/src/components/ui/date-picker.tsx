"use client";

import { addDays, format, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Pick a date",
	className,
	disabled = false,
}: DatePickerProps) {
	const [isOpen, setIsOpen] = React.useState(false);

	const handleDateSelect = (date: Date | undefined) => {
		onChange?.(date);
		setIsOpen(false); // Close popup when date is selected
	};

	const handlePrevDay = () => {
		if (value) {
			onChange?.(subDays(value, 1));
		}
	};

	const handleNextDay = () => {
		if (value) {
			onChange?.(addDays(value, 1));
		}
	};

	return (
		<div className="flex gap-1">
			<Button
				variant="outline"
				size="sm"
				className="px-3 h-12 w-12"
				onClick={handlePrevDay}
				disabled={disabled || !value}
			>
				-
			</Button>

			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"flex-1 justify-center text-center font-normal h-12",
							!value && "text-muted-foreground",
							className,
						)}
						disabled={disabled}
					>
						{value ? format(value, "PPP") : <span>{placeholder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="center">
					<Calendar
						mode="single"
						selected={value}
						onSelect={handleDateSelect}
						disabled={disabled}
						initialFocus
						className="rounded-md border-0"
						classNames={{
							months:
								"flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
							month: "space-y-4",
							caption: "flex justify-center pt-1 relative items-center",
							caption_label: "text-sm font-medium",
							nav: "space-x-1 flex items-center",
							nav_button:
								"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
							nav_button_previous: "absolute left-1",
							nav_button_next: "absolute right-1",
							table: "w-full border-collapse space-y-1",
							head_row: "flex",
							head_cell:
								"text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
							row: "flex w-full mt-2",
							cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
							day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
							day_range_end: "day-range-end",
							day_selected:
								"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
							day_today: "bg-accent text-accent-foreground",
							day_outside:
								"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
							day_disabled: "text-muted-foreground opacity-50",
							day_range_middle:
								"aria-selected:bg-accent aria-selected:text-accent-foreground",
							day_hidden: "invisible",
						}}
					/>
				</PopoverContent>
			</Popover>

			<Button
				variant="outline"
				size="sm"
				className="px-3 h-12 w-12"
				onClick={handleNextDay}
				disabled={disabled || !value}
			>
				+
			</Button>
		</div>
	);
}
