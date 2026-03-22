import type { CSSProperties } from "react";

/**
 * Masked renders: `public/assets/bikes/{road|gravel|mountain}/masked/`
 *
 * - **`none`** (default): no CSS mask. The diagram `<img>` uses **`mix-blend-screen`**
 *   so **black** pixels pick up `bg-muted` (works for grey-on-black PNGs, including many
 *   “masked” exports with **alpha**). **Luminance** mask on the same URL breaks **alpha** PNGs
 *   (everything disappears).
 * - **`luminance`**: same-URL luminance mask — only for **fully opaque** grey-on-black
 *   pixels (no transparency), e.g. classic `diagrams/bike-side.png`.
 */
export type BikeDiagramMaskMode = "none" | "luminance" | "alpha";

export const BIKE_DIAGRAM_MASK_MODE: BikeDiagramMaskMode = "none";

export type BikeDiagramCategory = "road" | "gravel" | "mountain";

export type BikeDiagramAngle = "side" | "front_right" | "back_right";

export type BikeDiagramSlide = {
	angle: BikeDiagramAngle;
	src: string;
	label: string;
	alt: string;
};

/** Same as the original single-image card — applied to every carousel slide. */
export function getBikeDiagramMaskStyle(
	imageSrc: string,
	mode: BikeDiagramMaskMode = BIKE_DIAGRAM_MASK_MODE,
): CSSProperties | undefined {
	if (mode === "none") return undefined;
	const alpha = mode === "alpha";
	return {
		maskImage: `url("${imageSrc}")`,
		maskSize: "contain",
		maskRepeat: "no-repeat",
		maskPosition: "center",
		maskMode: alpha ? "alpha" : "luminance",
		WebkitMaskImage: `url("${imageSrc}")`,
		WebkitMaskSize: "contain",
		WebkitMaskRepeat: "no-repeat",
		WebkitMaskPosition: "center",
		WebkitMaskMode: alpha ? "alpha" : "luminance",
	} as CSSProperties;
}

const baseUrl = () => import.meta.env.BASE_URL;

/**
 * Model folder under `public/assets/bikes/<category>/<model>/masked/`.
 * Must match your disk layout for each bike type.
 */
export const BIKE_DIAGRAM_ASSET_SUBFOLDER: Record<BikeDiagramCategory, string> =
	{
		road: "tarmacSL8pro",
		gravel: "s-worksTurboCreo",
		mountain: "s-worksEpic8",
	};

function assetsRootForCategory(category: BikeDiagramCategory): string {
	const b = baseUrl();
	const sub = BIKE_DIAGRAM_ASSET_SUBFOLDER[category];
	return `${b}assets/bikes/${category}/${sub}`;
}

/** Normalize for comparison: trim, lowercase, collapse spaces (case-insensitive). */
function normalizeBikeTypeLabel(value: string | undefined | null): string {
	const s = String(value ?? "")
		.normalize("NFKC")
		.trim()
		.toLowerCase()
		.replace(/\s+/g, " ");
	return s;
}

/**
 * Map form bike type string → diagram asset category.
 * Matching is **case-insensitive** (e.g. `GRAVEL`, `Gravel`, ` gravel `).
 */
export function resolveBikeDiagramCategory(
	bikeType: string | undefined | null,
): BikeDiagramCategory {
	const t = normalizeBikeTypeLabel(bikeType);
	if (t === "gravel") return "gravel";
	if (t === "mountain") return "mountain";
	if (t === "road") return "road";
	return "road";
}

/** `masked/side.png`, `masked/front_right.png`, `masked/back_right.png` (see `BIKE_DIAGRAM_ASSET_SUBFOLDER`). */
export function getBikeDiagramSlides(
	category: BikeDiagramCategory,
): BikeDiagramSlide[] {
	const root = `${assetsRootForCategory(category)}/masked`;
	const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	const src = (file: string) => `${root}/${file}.png`;

	return [
		{
			angle: "side",
			src: src("side"),
			label: "Side",
			alt: `${cap(category)} bike — side`,
		},
		{
			angle: "front_right",
			src: src("front_right"),
			label: "Front right",
			alt: `${cap(category)} bike — front right`,
		},
		{
			angle: "back_right",
			src: src("back_right"),
			label: "Back right",
			alt: `${cap(category)} bike — back right`,
		},
	];
}

export function bikeDiagramCategoryLabel(
	category: BikeDiagramCategory,
): string {
	switch (category) {
		case "gravel":
			return "Gravel";
		case "mountain":
			return "Mountain";
		default:
			return "Road";
	}
}
