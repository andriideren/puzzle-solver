import { ShapeVariations } from './common';
import { PuzzleArea } from './PuzzleArea';

export interface PuzzleSolution {
	area: PuzzleArea;
	unsolved: ShapeVariations[];
	steps: number;
	isFinal: boolean;
}

export interface SolutionResponse {
	solution: PuzzleSolution;
}

export interface SolutionProgress {
	solution: PuzzleSolution;
	onProgress: (solution: PuzzleSolution) => void;
}
