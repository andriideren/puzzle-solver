import { getPredefinedElements } from '@/lib/game';
import { placePuzzleElement, prepareVariations, solvePuzzle } from '@/lib/solver';
import { Shaped } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleSolution } from '@/models/PuzzleSolution';
import { describe, expect, test } from '@jest/globals';

describe('geometry module', () => {
	test('returns placed element', () => {
        const variant:Shaped = {
            shape:[[-1, -1, -1, 8], [8, 8, 8, 8]]
        };
        const area : PuzzleArea = {
            shape:[
                [0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
                [0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
                [0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
                [5, 5, 5, 5, 6, 3, 3, 3, 3, -1],
                [5, 5, 6, 6, 6, 6, -1, -1, -1, -1]
            ],
            width: 10,
            height: 5
        };
        const results = placePuzzleElement(area, variant);
		expect(
            results.length
		).toBe(1);
	});
    
	test('returns final solution', () => {
        const variations = prepareVariations(getPredefinedElements()[8])
        const solutions: PuzzleSolution[] = [];
        solvePuzzle({
            area:{
                shape:[
                    [0, 1, 1, 1, 4, 4, 4, 4, 9, 9],
                    [0, 0, 1, 1, 2, 4, 7, 7, 7, 9],
                    [0, 2, 2, 2, 2, 3, 3, 7, 9, 9],
                    [5, 5, 5, 5, 6, 3, 3, 3, 3, -1],
                    [5, 5, 6, 6, 6, 6, -1, -1, -1, -1]
                ],
                width:10,
                height: 5
            },
            unsolved: [
                variations
            ],
            steps:1
        }, solutions);
		expect(
            solutions.length
		).toBe(1);
	});
});
