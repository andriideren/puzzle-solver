import { Shaped } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleSolution, SolutionProgress } from '@/models/PuzzleSolution';

import { createArea } from '@/lib/game';
import { generateElementsSet } from '@/lib/generator';
import {
	placePuzzleElement,
	prepareVariations,
	solvePuzzle,
} from '@/lib/solver';

import { describe, expect, test } from '@jest/globals';

describe('geometry module', () => {
	test('returns placed element', () => {
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
		const results = placePuzzleElement(area, variant);
		expect(results?.length).toBe(1);
	});

	test('returns unsolved solution if elements not feet', () => {
		const tooBigSet = generateElementsSet(3, 4, 2, 12, 5);
		const variations = tooBigSet.elements.map((element) => {
			console.dir(element ?? 'wrong');
			return prepareVariations(element);
		});

		const solution: PuzzleSolution = {
			area: createArea(10, 5),
			unsolved: variations,
			isFinal: false,
		};

		const progress: SolutionProgress = {
			solution: solution,
			steps: 0,
			onProgress: () => {},
			onTimeout: () => {},
		};

		solvePuzzle(solution, progress);

		expect(progress.solution.isFinal).toBe(false);
		expect(progress.message).toBeDefined();
	});

	test('returns final solution', () => {
		const variations = prepareVariations({
			shape: [
				[8, 8, 8, 8],
				[8, -1, -1, -1],
			],
		});

		const solution: PuzzleSolution = {
			area: {
				shape: [
					[0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
					[0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
					[0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
					[5, 5, 5, 5, 6, 3, 3, 3, 3, -1],
					[5, 5, 6, 6, 6, 6, -1, -1, -1, -1],
				],
				width: 10,
				height: 5,
			},
			unsolved: [variations],
			isFinal: false,
		};

		const progress: SolutionProgress = {
			solution: solution,
			steps: 0,
			onProgress: () => {},
			onTimeout: () => {},
		};

		solvePuzzle(solution, progress);

		expect(progress?.solution?.isFinal).toBe(true);
	});
});
