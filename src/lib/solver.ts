import _ from 'lodash';

import { Shaped, ShapeVariations } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleElement } from '@/models/PuzzleElement';
import { PuzzleSolution } from '@/models/PuzzleSolution';

import {
	cloneArea,
	flipV,
	getFlatSize,
	mergeShapes,
	rotateCW,
	shapesEquals,
} from './geometry';

export function initSolution(
	area: PuzzleArea,
	elements: PuzzleElement[]
): PuzzleSolution {
	return {
		area: area,
		unsolved: _.sortBy(elements, (el) => getFlatSize(el) * -1).map((el) =>
			prepareVariations(el)
		),
		steps: 0,
	};
}

export function prepareVariations(element: Shaped) {
	const result: ShapeVariations = {
		variations: [element, flipV(element)],
	};

	for (let i = 0; i < 3; i++) {
		const rotated = rotateCW(result.variations[i]);
		const exists = _.find(result.variations, (v) =>
			shapesEquals(v, rotated)
		);
		if (!exists) {
			result.variations.push(rotated);
		}
		const flipped = flipV(rotated);
		const fExists = _.find(result.variations, (v) =>
			shapesEquals(v, flipped)
		);
		if (!fExists) {
			result.variations.push(flipped);
		}
	}

	return result;
}

export function placePuzzleElement(
	area: PuzzleArea,
	element: Shaped
): PuzzleArea[] {
	const result: PuzzleArea[] = [];
	for (let x = 0; x < area.width; x++) {
		for (let y = 0; y < area.height; y++) {
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
	if (solution.unsolved.length == 0) {
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
