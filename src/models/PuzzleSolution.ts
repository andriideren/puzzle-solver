import { ShapeVariations } from './common';
import { PuzzleArea } from './PuzzleArea';

export interface PuzzleSolution {
	area: PuzzleArea;
	unsolved: ShapeVariations[];
	steps: number;
}

export interface SolutionResponse {
	solution: PuzzleSolution;
}
