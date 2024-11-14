import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';
import { PuzzleSet } from '@/models/PuzzleSet';
export const maxTimeout = 120000;
export const maxElementWidthN = 4;
export const minElementWidthN = 3;
export const maxElementHeightN = 2;
export const blockSizePx = 40;
export const blockSpacePx = 2;
export const solutionAccuracy = 0;
export const predefinedAreaWidth = 10;
export const predefinedAreaHeight = 5;
export const defaultSetId = 1;
export const defaultColor = '#CCCCCC';

const palette: string[] = [
	'#F94144',
	'#F3722C',
	'#F8961E',
	'#F9844A',
	'#F9C74F',
	'#90BE6D',
	'#43AA8B',
	'#4D908E',
	'#577590',
	'#277DA1',
	'#003049',
	'#5f0f40',
	'#ff70a6',
	'#70d6ff',
	'#3c096c',
	'#7678ed',
	'#ce4257',
	'#cc5803',
	'#7c6a0a',
	'#ec0868',
];

function normalizeColorIndex(index: number) {
	while (index > palette.length - 1) {
		index -= palette.length;
	}
	return index;
}

export function getColorFromPalette(index: number) {
	if (index < 0) return defaultColor;
	index = normalizeColorIndex(index);
	return palette[index];
}

export function createArea(width: number, height: number): PuzzleArea {
	return {
		width: width,
		height: height,
		shape: Array.from({ length: height }, () =>
			Array.from({ length: width }, () => -1)
		),
	};
}

export const emptySolution = {
	area: createArea(predefinedAreaWidth, predefinedAreaHeight),
	unsolved: [],
	steps: 0,
	isFinal: false,
};

const set0: PuzzleSet = {
	width: 10,
	height: 5,
	elements: [
		{
			shape: [
				[0, 0, 0],
				[-1, 0, -1],
			],
			color: palette[0],
		},
		{
			shape: [
				[1, 1, 1],
				[-1, 1, 1],
			],
			color: palette[1],
		},
		{
			shape: [
				[2, 2, 2, 2],
				[2, -1, -1, -1],
			],
			color: palette[2],
		},
		{
			shape: [
				[3, 3, 3, 3],
				[3, 3, -1, -1],
			],
			color: palette[3],
		},
		{
			shape: [
				[4, 4, 4, 4],
				[-1, 4, -1, -1],
			],
			color: palette[4],
		},
		{
			shape: [
				[5, 5, 5, 5],
				[5, 5, -1, -1],
			],
			color: palette[5],
		},
		{
			shape: [
				[6, 6, 6, 6],
				[-1, 6, -1, -1],
			],
			color: palette[6],
		},
		{
			shape: [
				[7, 7, 7],
				[-1, 7, -1],
			],
			color: palette[7],
		},
		{
			shape: [
				[8, 8, 8, 8],
				[8, -1, -1, -1],
			],
			color: palette[8],
		},
		{
			shape: [
				[9, 9, 9],
				[9, -1, 9],
			],
			color: palette[9],
		},
	],
};

function getPShapeBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, index, -1, -1],
		],
		color: palette[index],
	};
}

function getSmallLShapeBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index],
			[index, -1, -1],
		],
		color: palette[index],
	};
}

function getLShapeBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, -1, -1, -1],
		],
		color: palette[index],
	};
}

function getGShapeBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, index, -1, index],
		],
		color: palette[index],
	};
}

function getSevenBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, index, index, -1],
		],
		color: palette[index],
	};
}

function getFullBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, index, index, index],
		],
		color: palette[index],
	};
}

function getDBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[-1, index, index, -1],
		],
		color: palette[index],
	};
}

function getRBlock(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[-1, -1, index, -1],
		],
		color: palette[index],
	};
}

const set1: PuzzleSet = {
	width: 10,
	height: 5,
	elements: [
		...Array.from({ length: 7 }, (_, i) => getPShapeBlock(i)),
		...Array.from({ length: 2 }, (_, i) => getSmallLShapeBlock(i + 7)),
	],
};

const set2: PuzzleSet = {
	width: 10,
	height: 5,
	elements: [
		...Array.from({ length: 2 }, (_, i) => getPShapeBlock(i)),
		...[getLShapeBlock(2)],
		...[getGShapeBlock(3)],
		...[getSevenBlock(4)],
		...[getFullBlock(5)],
		...[getDBlock(6)],
		...[getRBlock(7)],
	],
};

export const sets = [set0, set1, set2];

export function getPredefinedSet(index: number): PuzzleSet {
	return sets[index];
}
