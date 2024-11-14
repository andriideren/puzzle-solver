import * as React from 'react';

import { CellType } from '@/models/common';
import { PuzzleElement } from '@/models/PuzzleElement';

import { blockSizePx, blockSpacePx, maxElementWidthN } from '@/lib/game';
import {
	expandToLength,
	getMaxElementHeigthPx,
	getMaxElementWidthPx,
} from '@/lib/geometry';

export interface PuzzleElementShapeProps {
	element: PuzzleElement;
}

export interface PuzzleElementCellProps {
	value: CellType;
	rowIndex: number;
	cellIndex: number;
	color: string;
}

export function PuzzleElementCell({
	value,
	rowIndex,
	cellIndex,
	color,
}: PuzzleElementCellProps) {
	return (
		<rect
			key={`c_${rowIndex}_${cellIndex}`}
			fill={value > -1 ? color : undefined}
			x={cellIndex * blockSizePx + cellIndex * blockSpacePx}
			y={rowIndex * blockSizePx + rowIndex * blockSpacePx}
			width={blockSizePx}
			height={blockSizePx}
			rx={15}
		/>
	);
}

export function PuzzleElementShape(props: PuzzleElementShapeProps) {
	return (
		<React.Component>
			{[
				...props.element.shape.map((row, ri) =>
					[...row].map((cell, ci) => (
						<rect
							key={`c_${ri}_${ci}`}
							fill={!!cell ? props.element.color : undefined}
							x={ci * blockSizePx + ci * blockSpacePx}
							y={ri * blockSizePx + ri * blockSpacePx}
							width={blockSizePx}
							height={blockSizePx}
						/>
					))
				),
			]}
		</React.Component>
	);
}

export function PuzzleElementPreview(props: PuzzleElementShapeProps) {
	const viewBox = `0 0 ${getMaxElementWidthPx()} ${getMaxElementHeigthPx()}`;

	return (
		<svg
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			className="w-full h-full"
		>
			{[
				...props.element.shape.map((row, ri) =>
					expandToLength(row, maxElementWidthN).map((cell, ci) => (
						<PuzzleElementCell
							key={`c_${ri}_${ci}`}
							rowIndex={ri}
							cellIndex={ci}
							value={cell}
							color={props.element.color}
						/>
					))
				),
			]}
		</svg>
	);
}
