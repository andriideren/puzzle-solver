import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';
export const maxElementWidthN = 4;
export const maxElementHeightN = 2;
export const blockSizePx = 40;
export const blockSpacePx = 2;
export const solutionAccuracy = 0;
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
];

export function getPredefinedArea(): PuzzleArea {
	const predefinedWidth = 10;
	const predefinedHeight = 5;
	return {
		width: predefinedWidth,
		height: predefinedHeight,
		shape: Array.from({ length: predefinedHeight }, () =>
			Array.from({ length: predefinedWidth }, () => -1)
		),
	};
}

const set0: PuzzleElement[] = [
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
];

function getTop4Bottom1Block(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, -1, -1, -1],
		],
		color: palette[index],
	};
}

function getTop4Bottom2Block(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index, index],
			[index, index, -1, -1],
		],
		color: palette[index],
	};
}

function getTop3Bottom1Block(index: number): PuzzleElement {
	return {
		shape: [
			[index, index, index],
			[index, -1, -1],
		],
		color: palette[index],
	};
}

const set1: PuzzleElement[] = [
	...Array.from({ length: 7 }, (_, i) => getTop4Bottom2Block(i)),
	...Array.from({ length: 2 }, (_, i) => getTop3Bottom1Block(i + 7)),
];

export const sets = [set0, set1];

export function getPredefinedElements(index: number): PuzzleElement[] {
	return sets[index];
}
