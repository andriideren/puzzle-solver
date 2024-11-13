import _ from 'lodash';

import { Shaped, ShapeVariations } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';
import { PuzzleSolution } from '@/models/PuzzleSolution';

import { solutionAccuracy } from './game';
import {
	flipX,
	flipY,
	getFlatSize,
	mergeShapes,
	rotateCW,
	shapesEquals,
} from './geometry';

function prepareUnsortedVariations(elements: PuzzleElement[]) {
	return elements.map((el) => prepareVariations(el));
}

function prepareDescSortedVariations(elements: PuzzleElement[]) {
	return _.sortBy(
		Math.random() > 0.5 ? elements.reverse() : elements,
		(el) => getFlatSize(el) * -1
	).map((el) => prepareVariations(el));
}

function prepareAscSortedVariations(elements: PuzzleElement[]) {
	return _.sortBy(elements, (el) => getFlatSize(el)).map((el) =>
		prepareVariations(el)
	);
}

function prepareMixedVariations(elements: PuzzleElement[]) {
	const variations = prepareDescSortedVariations(elements);
	const temp = variations[0];
	variations[0] = variations[2];
	variations[2] = temp;
	return variations;
}

export function initSolution(
	area: PuzzleArea,
	elements: PuzzleElement[]
): PuzzleSolution {
	const variations = prepareDescSortedVariations(elements);

	return {
		area: area,
		unsolved: variations,
		steps: 0,
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

export function prepareVariations(element: Shaped) {
	const result: ShapeVariations = {
		variations: [element, flipX(element)],
	};

	for (let i = 0; i < 3; i++) {
		const rotated = rotateCW(result.variations[i]);
		pushIfNotExists(result.variations, rotated);

		prepareFlipped(result.variations, rotated);
	}

	return result;
}

export function placePuzzleElement(
	area: PuzzleArea,
	element: Shaped
): PuzzleArea[] {
	const result: PuzzleArea[] = [];
	for (let x = 0; x < area.width - 1; x++) {
		for (let y = 0; y < area.height - 1; y++) {
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

export function solvePuzzle(
	solution: PuzzleSolution,
	result: PuzzleSolution[],
	topSolution: PuzzleSolution[],
	setTopSolution: (top: PuzzleSolution) => void
) {
	if (solution.unsolved.length == solutionAccuracy) {
		result.push(solution);
		topSolution[0] = solution;
		setTopSolution(solution);
		return;
	}

	const top = topSolution[0];

	if (
		solution.unsolved.length <= 3 &&
		(!top || top.unsolved.length > solution.unsolved.length)
	) {
		topSolution[0] = solution;
		setTopSolution(solution);
	}

	const variations = solution.unsolved[0];
	const unsolved = solution.unsolved.filter((val, index) => index != 0);
	const step = solution.steps + 1;

	for (let i = 0; i < variations.variations.length; i++) {
		if (result.length > 0) return;

		const areas = placePuzzleElement(
			solution.area,
			variations.variations[i]
		);

		if (areas.length > 0) {
			for (let j = 0; j < areas.length; j++) {
				if (result.length > 0) return;

				const iSolution: PuzzleSolution = {
					area: areas[j],
					unsolved: unsolved,
					steps: step,
				};

				solvePuzzle(iSolution, result, topSolution, setTopSolution);
			}
		}
	}
}
