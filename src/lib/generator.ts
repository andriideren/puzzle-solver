import _ from 'lodash';

import { PuzzleSet } from '@/models/PuzzleSet';

import { getColorFromPalette } from './game';
import { getFlatSize } from './geometry';

export function generateElementsSet(
	minWidth: number,
	maxWidth: number,
	height: number,
	areaWidth: number,
	areaHeight: number
): PuzzleSet {
	const gameSet: PuzzleSet = {
		width: areaWidth,
		height: areaHeight,
		elements: [],
	};

	const areaSize = areaWidth * areaHeight;
	let totalArea = 0;
	const maxElementArea = maxWidth * height;
	const minSafeArea = maxElementArea + (maxWidth + 1);

	while (totalArea < areaSize - minSafeArea) {
		const shape = generateShape(
			minWidth,
			maxWidth,
			height,
			gameSet.elements.length
		);
		const element = {
			shape: shape,
			color: getColorFromPalette(gameSet.elements.length),
		};
		gameSet.elements.push(element);
		totalArea += getFlatSize(element);
	}

	totalArea = _.sum(gameSet.elements.map((element) => getFlatSize(element)));
	const expectedArea = areaSize - totalArea;

	if (expectedArea < maxWidth * height) {
		const lastShape = generateShape(
			minWidth,
			maxWidth,
			height,
			gameSet.elements.length,
			expectedArea
		);
		const element = {
			shape: lastShape,
			color: getColorFromPalette(gameSet.elements.length),
		};
		gameSet.elements.push(element);
	} else {
		const areas = [
			Math.floor(expectedArea / 2),
			Math.floor(expectedArea / 2),
		];

		if (areas[0] + areas[1] < expectedArea) {
			areas[0] = areas[0] + 1;
		}

		for (let i = 0; i < areas.length; i++) {
			const shape = generateShape(
				minWidth,
				maxWidth,
				height,
				gameSet.elements.length,
				areas[i]
			);
			const element = {
				shape: shape,
				color: getColorFromPalette(gameSet.elements.length),
			};
			gameSet.elements.push(element);
		}
	}

	return gameSet;
}

export function generateShape(
	minWidth: number,
	maxWidth: number,
	height: number,
	value: number,
	area?: number | undefined
) {
	const shape: number[][] = [
		Array.from(
			{
				length:
					area && area / height > minWidth
						? maxWidth
						: randomInteger(
								minWidth,
								area == maxWidth ? maxWidth - 1 : maxWidth
							),
			},
			() => value
		),
	];

	for (let i = 1; i < height; i++) {
		if (!area || i < height - 1) {
			const row = Array.from({ length: shape[0].length }, (val, index) =>
				shape[i - 1][index] < 0
					? -1
					: randomInteger(0, 1) < 1
						? -1
						: value
			);

			if (_.every(row, (cell) => cell == -1)) {
				row[0] = value;
			}

			shape.push(row);
		} else {
			let expectedArea = area - getFlatSize({ shape: shape });
			if (expectedArea == shape[0].length) {
				const lastRow = Array.from(
					{ length: shape[0].length },
					() => value
				);
				shape.push(lastRow);
			} else {
				const lastRow = Array.from(
					{ length: shape[0].length },
					() => -1
				);
				while (expectedArea > 0) {
					const fillIndex = randomInteger(0, shape[0].length - 1);
					if (lastRow[fillIndex] > -1) continue;
					lastRow[fillIndex] = value;
					expectedArea--;
				}
				shape.push(lastRow);
			}
		}
	}
	return shape;
}

export function randomInteger(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
