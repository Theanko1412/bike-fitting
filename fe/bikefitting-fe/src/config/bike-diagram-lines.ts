import type { BikeDiagramAngle } from "./bike-diagram-assets";

/**
 * Normalized 0–100 coordinates in viewBox "0 0 100 100".
 * Tune per angle so lines match your renders (side / front / angled).
 */
export type LineDef = {
	id: string;
	label: string;
	hint: string;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};

export type DiagramLineSet = {
	lines: LineDef[];
	/** Horizontal segment for stack/reach L-shape (when applicable) */
	stackReachHorizontal?: Pick<LineDef, "x1" | "y1" | "x2" | "y2">;
};

/** Side view — classic profile (endpoints inset from 0/100 so strokes + filter glow aren’t clipped) */
export const SIDE_LINE_SET: DiagramLineSet = {
	lines: [
		{
			id: "wheelbase",
			label: "Wheelbase",
			hint: "Front hub ↔ rear hub (axle to axle)",
			x1: 18,
			y1: 54,
			x2: 82,
			y2: 54,
		},
		{
			id: "saddleHeight",
			label: "Saddle height",
			hint: "Bottom bracket → saddle (along seat tube)",
			x1: 42,
			y1: 57,
			x2: 34,
			y2: 24,
		},
		{
			id: "seatTube",
			label: "Seat tube",
			hint: "Bottom bracket → seat cluster",
			x1: 42,
			y1: 57,
			x2: 36,
			y2: 38,
		},
		{
			id: "topTube",
			label: "Top tube",
			hint: "Seat tube junction → head tube junction",
			x1: 38,
			y1: 38,
			x2: 62,
			y2: 38,
		},
		{
			id: "stackReach",
			label: "Stack / reach (simplified)",
			hint: "L-shape from BB: up to head height, then across to steerer",
			x1: 42,
			y1: 57,
			x2: 42,
			y2: 30,
		},
	],
	stackReachHorizontal: { x1: 42, y1: 30, x2: 63, y2: 30 },
};

/**
 * Front-right 3/4 — same vertical band as side/angled assets (~y 54–58 for axles), not head-on (y~80).
 * The old “pure front” coords sat below the bike in your masked PNGs, so highlights missed the frame.
 */
export const FRONT_RIGHT_LINE_SET: DiagramLineSet = {
	lines: [
		{
			id: "wheelbase",
			label: "Wheelbase",
			hint: "Front hub ↔ rear hub (axle to axle)",
			x1: 22,
			y1: 58,
			x2: 78,
			y2: 57,
		},
		{
			id: "saddleHeight",
			label: "Saddle height",
			hint: "Bottom bracket → saddle (along seat tube)",
			x1: 46,
			y1: 58,
			x2: 37,
			y2: 26,
		},
		{
			id: "seatTube",
			label: "Seat tube",
			hint: "Bottom bracket → seat cluster",
			x1: 46,
			y1: 58,
			x2: 39,
			y2: 40,
		},
		{
			id: "topTube",
			label: "Top tube",
			hint: "Seat tube junction → head tube junction",
			x1: 38,
			y1: 40,
			x2: 63,
			y2: 37,
		},
		{
			id: "stackReach",
			label: "Stack / reach (simplified)",
			hint: "L-shape from BB: up to head height, then across to steerer",
			x1: 46,
			y1: 58,
			x2: 46,
			y2: 31,
		},
	],
	stackReachHorizontal: { x1: 46, y1: 31, x2: 65, y2: 30 },
};

/** Back-right 3/4 — same inset idea as side for long horizontals */
export const ANGLED_LINE_SET: DiagramLineSet = {
	lines: [
		{
			id: "wheelbase",
			label: "Wheelbase",
			hint: "Front hub ↔ rear hub (axle to axle)",
			x1: 22,
			y1: 58,
			x2: 78,
			y2: 58,
		},
		{
			id: "saddleHeight",
			label: "Saddle height",
			hint: "Bottom bracket → saddle (along seat tube)",
			x1: 44,
			y1: 58,
			x2: 36,
			y2: 26,
		},
		{
			id: "seatTube",
			label: "Seat tube",
			hint: "Bottom bracket → seat cluster",
			x1: 44,
			y1: 58,
			x2: 38,
			y2: 40,
		},
		{
			id: "topTube",
			label: "Top tube",
			hint: "Seat tube junction → head tube junction",
			x1: 36,
			y1: 40,
			x2: 64,
			y2: 38,
		},
		{
			id: "stackReach",
			label: "Stack / reach (simplified)",
			hint: "L-shape from BB: up to head height, then across to steerer",
			x1: 44,
			y1: 58,
			x2: 44,
			y2: 32,
		},
	],
	stackReachHorizontal: { x1: 44, y1: 32, x2: 66, y2: 31 },
};

export function getLineSetForAngle(angle: BikeDiagramAngle): DiagramLineSet {
	switch (angle) {
		case "front_right":
			return FRONT_RIGHT_LINE_SET;
		case "back_right":
			return ANGLED_LINE_SET;
		default:
			return SIDE_LINE_SET;
	}
}

/** Shared labels/hints for the measurement list (same ids as line sets) */
export const MEASUREMENT_ROWS: LineDef[] = SIDE_LINE_SET.lines;
