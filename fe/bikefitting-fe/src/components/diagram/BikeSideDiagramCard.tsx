import * as React from "react";

import type { CarouselApi } from "@/components/ui/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import {
	type BikeDiagramSlide,
	bikeDiagramCategoryLabel,
	getBikeDiagramMaskStyle,
	getBikeDiagramSlides,
	resolveBikeDiagramCategory,
} from "@/config/bike-diagram-assets";
import type { DiagramLineSet, LineDef } from "@/config/bike-diagram-lines";
import {
	MEASUREMENT_ROWS,
	getLineSetForAngle,
} from "@/config/bike-diagram-lines";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

/** Strokes in user space (viewBox 0–100) */
function MeasurementLine({
	x1,
	y1,
	x2,
	y2,
	isActive,
}: {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	isActive: boolean;
}) {
	if (!isActive) {
		return (
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				className="stroke-foreground/65"
				strokeWidth={0.75}
				strokeLinecap="round"
				strokeDasharray="2.2 1.6"
				opacity={0.85}
			/>
		);
	}
	/* No SVG <filter> here: feGaussianBlur + default filterUnits=objectBoundingBox
	 * collapses the filter region for thin horizontal/vertical lines, so the whole
	 * active group can disappear (side wheelbase / top tube / stack). */
	return (
		<g>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				className="stroke-background"
				strokeWidth={2.35}
				strokeLinecap="round"
				opacity={0.92}
			/>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				className="stroke-primary"
				strokeWidth={1.15}
				strokeLinecap="round"
			/>
		</g>
	);
}

function BikeDiagramSvgOverlay({
	lineSet,
	activeId,
}: {
	lineSet: DiagramLineSet;
	activeId: string;
}) {
	return (
		<svg
			className="absolute inset-0 z-[2] h-full w-full pointer-events-none overflow-visible"
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid meet"
			aria-hidden
		>
			{lineSet.lines.map((m: LineDef) => {
				const isActive = activeId === m.id;
				return (
					<g key={m.id}>
						<MeasurementLine
							x1={m.x1}
							y1={m.y1}
							x2={m.x2}
							y2={m.y2}
							isActive={isActive}
						/>
						{m.id === "stackReach" && lineSet.stackReachHorizontal && (
							<MeasurementLine
								x1={lineSet.stackReachHorizontal.x1}
								y1={lineSet.stackReachHorizontal.y1}
								x2={lineSet.stackReachHorizontal.x2}
								y2={lineSet.stackReachHorizontal.y2}
								isActive={isActive}
							/>
						)}
					</g>
				);
			})}
		</svg>
	);
}

export type BikeSideDiagramCardProps = {
	bikeType?: string | null;
};

/** Raster with load fallback — avoids invisible 404 + blend/stacking quirks hiding the bike. */
function DiagramSlideImage({ slide }: { slide: BikeDiagramSlide }) {
	const [src, setSrc] = React.useState(slide.src);
	React.useEffect(() => {
		setSrc(slide.src);
	}, [slide.src]);

	return (
		<img
			src={src}
			alt={slide.alt}
			className={cn(
				"absolute inset-0 z-[1] h-full w-full object-contain select-none rounded-lg",
				"contrast-[1.18] saturate-[1.32]",
				"brightness-[0.92] dark:brightness-[1.08]",
				"drop-shadow-[0_3px_14px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]",
			)}
			style={getBikeDiagramMaskStyle(src)}
			draggable={false}
		/>
	);
}

export function BikeSideDiagramCard({ bikeType }: BikeSideDiagramCardProps) {
	const [activeId, setActiveId] = React.useState<string>("wheelbase");
	const category = resolveBikeDiagramCategory(bikeType);
	const slides = React.useMemo(
		() => getBikeDiagramSlides(category),
		[category],
	);

	const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
	const [slideIndex, setSlideIndex] = React.useState(0);

	React.useEffect(() => {
		if (!carouselApi) return;
		const onSelect = () => {
			setSlideIndex(carouselApi.selectedScrollSnap());
		};
		onSelect();
		carouselApi.on("select", onSelect);
		carouselApi.on("reInit", onSelect);
		return () => {
			carouselApi.off("select", onSelect);
			carouselApi.off("reInit", onSelect);
		};
	}, [carouselApi]);

	const currentSlide = slides[slideIndex];
	const currentLabel = currentSlide?.label ?? slides[0]?.label ?? "";

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">
					Bike diagram
					<span className="text-muted-foreground font-normal">
						{" "}
						· {bikeDiagramCategoryLabel(category)}
					</span>
				</CardTitle>
				<p className="text-xs text-muted-foreground font-normal">
					Hover a row to highlight lines.
					{/* <code className="text-xs">masked/side.png</code>,{" "}
					<code className="text-xs">front_right.png</code>,{" "}
					<code className="text-xs">back_right.png</code> (same style as{" "}
					<code className="text-xs">diagrams/bike-side.png</code>). */}
				</p>
			</CardHeader>

			<CardContent className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 items-start">
				<div className="relative w-full min-w-0">
					<Carousel
						key={category}
						setApi={setCarouselApi}
						opts={{ align: "start", loop: true }}
						className="w-full"
					>
						<CarouselContent className="-ml-2 md:-ml-4">
							{slides.map((slide, index) => {
								const lineSet = getLineSetForAngle(slide.angle);
								return (
									<CarouselItem
										key={`${slide.angle}-${slide.src}`}
										className="pl-2 md:pl-4 basis-full"
									>
										<div className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/50 dark:bg-muted/30">
											<p className="sr-only">
												{slide.alt} — measurement overlay ({slide.angle})
											</p>
											<div className="relative w-full aspect-[16/10] overflow-hidden">
												<div
													className="absolute inset-0 z-0 bg-muted dark:bg-muted/80"
													aria-hidden
												/>
												<div className="absolute inset-0 z-[1] p-2">
													<DiagramSlideImage slide={slide} />
												</div>
												{slideIndex === index && (
													<BikeDiagramSvgOverlay
														lineSet={lineSet}
														activeId={activeId}
													/>
												)}
											</div>
										</div>
									</CarouselItem>
								);
							})}
						</CarouselContent>
						<CarouselPrevious
							type="button"
							className="left-1 top-[calc(50%-1.25rem)] -translate-y-1/2 border-border bg-background/90 shadow-sm"
						/>
						<CarouselNext
							type="button"
							className="right-1 top-[calc(50%-1.25rem)] -translate-y-1/2 border-border bg-background/90 shadow-sm"
						/>
					</Carousel>
					<p className="text-center text-[11px] text-muted-foreground mt-1">
						Angle:{" "}
						<span className="text-foreground font-medium">{currentLabel}</span>
						{/* <span className="text-muted-foreground"> · lines match this view</span> */}
					</p>
				</div>

				<div className="space-y-2">
					<p className="text-xs text-muted-foreground">Measurements</p>
					<div className="space-y-2">
						{MEASUREMENT_ROWS.map((row) => {
							const isActive = row.id === activeId;
							return (
								<button
									key={row.id}
									type="button"
									onMouseEnter={() => setActiveId(row.id)}
									onFocus={() => setActiveId(row.id)}
									className={cn(
										"w-full text-left rounded-md border border-border px-3 py-2 transition-colors",
										"hover:bg-accent/50 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
										isActive
											? "bg-primary/10 border-primary/60"
											: "bg-transparent",
									)}
								>
									<div className="text-sm font-medium">{row.label}</div>
									<div className="text-[11px] text-muted-foreground mt-0.5">
										{row.hint}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
