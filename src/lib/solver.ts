import _ from 'lodash';

import { Shaped, ShapeVariations } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';
import {
	PuzzleSolution,
	SolutionOptions,
	SolutionProgress,
} from '@/models/PuzzleSolution';

import {
	flipX,
	flipY,
	getFlatSize,
	mergeShapes,
	rotateCW,
	shapesEquals,
} from './geometry';

// experimental sorting to compare with optimal
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function prepareUnsortedVariations(elements: PuzzleElement[]) {
	return elements.map((el) => prepareVariations(el));
}

// experimental sorting to compare with optimal
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function prepareAscSortedVariations(elements: PuzzleElement[]) {
	return _.sortBy(elements, (el) => getFlatSize(el)).map((el) =>
		prepareVariations(el)
	);
}

// experimental sorting to compare with optimal
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function prepareMixedVariations(elements: PuzzleElement[]) {
	const variations = prepareGreedSortedVariations(elements);
	const temp = variations[0];
	variations[0] = variations[2];
	variations[2] = temp;
	return variations;
}

function prepareGreedSortedVariations(elements: PuzzleElement[]) {
	return _.sortBy(
		Math.random() > 0.5 ? elements.reverse() : elements,
		(el) => getFlatSize(el) * -1
	).map((el) => prepareVariations(el));
}

export function initSolution(
	area: PuzzleArea,
	elements: PuzzleElement[]
): PuzzleSolution {
	const variations = prepareGreedSortedVariations(elements);

	return {
		area: area,
		unsolved: variations,
		isFinal: false,
	};
}

function pushIfNotExists(variations: Shaped[], variation: Shaped) {
	const exists = _.find(variations, (v) => shapesEquals(v, variation));
	if (!exists) {
		variations.push(variation);
	}
}

function prepareFlipped(variations: Shaped[], variation: Shaped) {
	const flippedX = flipX(variation);
	pushIfNotExists(variations, flippedX);

	const flippedY = flipY(variation);
	pushIfNotExists(variations, flippedY);
}

export function prepareVariations(element: Shaped): ShapeVariations {
	const variations = [element];
	for (let i = 0; i < 3; i++) {
		const original = variations[i];
		if (original) {
			const rotated = rotateCW(original);
			pushIfNotExists(variations, rotated);
		}
	}

	const flipped: Shaped[] = [];
	for (let i = 0; i < variations.length; i++) {
		prepareFlipped(flipped, variations[i]);
	}

	for (let i = 0; i < flipped.length; i++) {
		pushIfNotExists(variations, flipped[i]);
	}

	return {
		variations: variations,
	};
}

export function placePuzzleElement(
	area: PuzzleArea,
	element: Shaped,
	progress?: SolutionProgress | undefined
): PuzzleArea[] {
	const result: PuzzleArea[] = [];
	for (let x = 0; x < area.width - 1; x++) {
		for (let y = 0; y < area.height - 1; y++) {
			if (progress) progress.steps++;
			if (element.shape[0][0] > -1 && area.shape[y][x] > -1) continue;
			if (
				element.shape[0][1] > -1 &&
				area.shape[y][x + 1] &&
				area.shape[y][x + 1] > -1
			)
				continue;

			const merged = mergeShapes(
				element,
				{ shape: [...area.shape] },
				x,
				y
			);

			if (!merged) continue;

			result.push({
				shape: merged.shape,
				width: area.width,
				height: area.height,
			});
		}
	}
	return result;
}

function checkTimeout({ start, timeout }: SolutionOptions) {
	return Date.now() - start > timeout;
}

export function solvePuzzle(
	solution: PuzzleSolution,
	progress: SolutionProgress,
	options?: SolutionOptions | undefined
) {
	const areaSize = solution.area.width * solution.area.height;
	const elementsSize = _.sum(
		solution.unsolved.map((element) => getFlatSize(element.variations[0]))
	);

	if (elementsSize > areaSize) {
		progress.message = 'Puzzle unsolvable. Elements area is too big';
		progress.onProgress(solution);
		return;
	}

	if (solution.isFinal) {
		progress.solution = solution;
		progress.onProgress(solution);
		return;
	}

	if (
		solution.unsolved.length <= 3 &&
		(!progress.solution ||
			progress.solution.unsolved.length > solution.unsolved.length)
	) {
		progress.solution = solution;
		progress.onProgress(solution);
	}

	const variations = solution.unsolved[0];
	const unsolved = solution.unsolved.filter((val, index) => index != 0);

	for (let i = 0; i < variations.variations.length; i++) {
		if (progress.solution.isFinal) return;

		if (options && checkTimeout(options)) {
			progress.onTimeout();
			return;
		}

		const areas = placePuzzleElement(
			solution.area,
			variations.variations[i],
			progress
		);

		if (areas.length > 0) {
			for (let j = 0; j < areas.length; j++) {
				if (progress.solution.isFinal) return;

				const iSolution: PuzzleSolution = {
					area: areas[j],
					unsolved: unsolved,
					isFinal: unsolved.length == (options?.accuracy ?? 0),
				};

				solvePuzzle(iSolution, progress, options);
			}
		}
	}
}
