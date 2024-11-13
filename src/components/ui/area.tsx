import React from 'react';

import { defaultColor } from '@/lib/game';
import { getShapedHeightPx, getShapedWidthPx } from '@/lib/geometry';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';

import { PuzzleElementCell } from './shape';

export interface PuzzleAreaShapeProps {
	area: PuzzleArea;
	elements: PuzzleElement[];
}

export function PuzzleAreaShape({ area, elements }: PuzzleAreaShapeProps) {
	const viewBox = `0 0 ${getShapedWidthPx(area)} ${getShapedHeightPx(area)}`;

	return (
		<svg
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			className="w-full h-full"
		>
			{[
				...area.shape.map((row, ri) =>
					[...row].map((cell, ci) => (
						<PuzzleElementCell
							key={`c_${ri}_${ci}`}
							rowIndex={ri}
							cellIndex={ci}
							value={1}
							color={
								cell > -1 && elements[cell]
									? elements[cell].color
									: defaultColor
							}
						/>
					))
				),
			]}
		</svg>
	);
}
