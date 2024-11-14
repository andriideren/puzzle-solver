import _ from 'lodash';

import { generateElementsSet, generateShape } from '@/lib/generator';
import { getFlatSize } from '@/lib/geometry';

import { describe, expect, test } from '@jest/globals';

describe('generator module', () => {
	test('returns shape that fits in area', () => {
		const minWidth = 3,
			maxWidth = 4,
			height = 2,
			areaSize = maxWidth * height;

		const shape = generateShape(minWidth, maxWidth, height, 1);
		const shapeArea = getFlatSize({ shape: shape });
		expect(shapeArea).toBeLessThanOrEqual(areaSize);
	});
	test('returns shape with exact size', () => {
		const minWidth = 3,
			maxWidth = 4,
			height = 2;

		for (let expectedSize = 4; expectedSize < 9; expectedSize++) {
			const shape = generateShape(
				minWidth,
				maxWidth,
				height,
				1,
				expectedSize
			);
			const shapeArea = getFlatSize({ shape: shape });
			expect(shapeArea).toBe(expectedSize);
		}
	});
	test('returns game set that fits in area', () => {
		const areaWidth = 10,
			areaHeight = 5,
			areaSize = areaWidth * areaHeight;

		const gameSet = generateElementsSet(3, 4, 2, areaWidth, areaHeight);

		const elementsArea = _.sum(
			gameSet.elements.map((element) => getFlatSize(element))
		);

		expect(elementsArea).toBe(areaSize);
	});
});
