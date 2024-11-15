import { Shaped } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';

import {
	flipX,
	flipY,
	getShapedHeightN,
	getShapedWidthN,
	mergeShapes,
	rotateCW,
} from '@/lib/geometry';

import { describe, expect, test } from '@jest/globals';

describe('geometry module', () => {
	test('returns shape width equal 3', () => {
		expect(
			getShapedWidthN({
				shape: [
					[1, 1, 1],
					[-1, 1, -1],
				],
			})
		).toBe(3);
	});

	test('returns shape height equal 2', () => {
		expect(
			getShapedHeightN({
				shape: [
					[1, 1, 1],
					[-1, 1, -1],
				],
			})
		).toBe(2);
	});

	test('returns shape rotated clockwise', () => {
		expect(
			rotateCW({
				shape: [
					[1, 1, 1],
					[-1, 1, -1],
				],
			})
		).toEqual({
			shape: [
				[-1, 1],
				[1, 1],
				[-1, 1],
			],
		});
	});

	test('returns shape flipped around X axis', () => {
		expect(
			flipX({
				shape: [
					[1, 1, 1],
					[-1, 1, -1],
				],
			})
		).toEqual({
			shape: [
				[-1, 1, -1],
				[1, 1, 1],
			],
		});
	});

	test('returns shape flipped around Y axis', () => {
		expect(
			flipY({
				shape: [
					[1, 1, 1, 1],
					[-1, 1, -1, -1],
				],
			})
		).toEqual({
			shape: [
				[1, 1, 1, 1],
				[-1, -1, 1, -1],
			],
		});
	});

	test('returns false if shapes not merged', () => {
		const variant: Shaped = {
			shape: [
				[-1, -1, -1, 8],
				[8, 8, 8, 8],
			],
		};
		const area: PuzzleArea = {
			shape: [
				[0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
				[0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
				[0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
				[5, 5, 5, 5, 6, 3, 3, 3, 3, 9],
				[5, 5, 6, 6, 6, 6, -1, -1, -1, -1],
			],
			width: 10,
			height: 5,
		};

		const merged = mergeShapes(variant, area, 6, 3);

		expect(merged).toBe(false);
	});

	test('returns shape if shapes merged', () => {
		const variant: Shaped = {
			shape: [
				[-1, -1, -1, 8],
				[8, 8, 8, 8],
			],
		};
		const area: PuzzleArea = {
			shape: [
				[0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
				[0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
				[0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
				[5, 5, 5, 5, 6, 3, 3, 3, 3, -1],
				[5, 5, 6, 6, 6, 6, -1, -1, -1, -1],
			],
			width: 10,
			height: 5,
		};

		const merged = mergeShapes(variant, area, 6, 3);

		expect(merged).not.toBe(false);
		expect((merged as Shaped).shape).toBeDefined();
	});

	test('returns correct shape if shapes merged', () => {
		const variant: Shaped = {
			shape: [
				[-1, -1, -1, 8],
				[8, 8, 8, 8],
			],
		};
		const area: PuzzleArea = {
			shape: [
				[0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
				[0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
				[0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
				[5, 5, 5, 5, 6, 3, 3, 3, 3, -1],
				[5, 5, 6, 6, 6, 6, -1, -1, -1, -1],
			],
			width: 10,
			height: 5,
		};

		const correct: Shaped = {
			shape: [
				[0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
				[0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
				[0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
				[5, 5, 5, 5, 6, 3, 3, 3, 3, 8],
				[5, 5, 6, 6, 6, 6, 8, 8, 8, 8],
			],
		};

		const merged = mergeShapes(variant, area, 6, 3);

		expect(merged).toEqual(correct);
	});
});
