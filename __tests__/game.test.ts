import _ from 'lodash';

import { getColorFromPalette } from '@/lib/game';

import { describe, expect, test } from '@jest/globals';

describe('game module', () => {
	test('returns color for any index', () => {
		const length = 100;
		expect(
			_.filter(
				Array.from({ length: length }, (val, index) =>
					getColorFromPalette(index)
				),
				(color) => color.length === 7
			).length
		).toBe(length);
	});
});
