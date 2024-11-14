import React, { useEffect, useState } from 'react';

import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';

import { defaultColor, getColorFromPalette } from '@/lib/game';
import {
	getShapedHeightPx,
	getShapedWidthPx,
	mergeToArea,
} from '@/lib/geometry';

import { PuzzleElementCell } from './shape';

export interface PuzzleAreaShapeProps {
	area: PuzzleArea;
	elements?: PuzzleElement[] | undefined;
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
								cell > -1
									? ((elements
											? elements[cell]?.color
											: getColorFromPalette(cell)) ??
										getColorFromPalette(cell))
									: defaultColor
							}
						/>
					))
				),
			]}
		</svg>
	);
}

export interface AnimatePuzzleAreaProps {
	area: PuzzleArea;
}

export function AnimatePuzzleArea(props: AnimatePuzzleAreaProps) {
	const [animateX, setX] = useState(0);
	const [animateY, setY] = useState(0);

	useEffect(() => {
		const intervalId: NodeJS.Timeout | undefined = setInterval(() => {
			setX((xVal) => {
				if (xVal < props.area.width - 4) {
					return xVal + 1;
				}

				setY((yVal) => {
					if (yVal < props.area.height - 2) return yVal + 1;
					return 0;
				});

				return 0;
			});
		}, 200);
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, []);

	const gameArea = mergeToArea(
		{
			shape: [
				[1, 2, 3, -1],
				[-1, 5, 6, 7],
			],
		},
		props.area,
		animateX,
		animateY
	);

	return <PuzzleAreaShape area={gameArea ? gameArea : props.area} />;
}
