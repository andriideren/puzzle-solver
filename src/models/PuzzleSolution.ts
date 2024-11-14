import { ShapeVariations } from './common';
import { PuzzleArea } from './PuzzleArea';
import { PuzzleElement } from './PuzzleElement';

export interface PuzzleSolution {
	area: PuzzleArea;
	unsolved: ShapeVariations[];
	isFinal: boolean;
}

export interface SolutionResponse {
	solution?: PuzzleSolution | null | undefined;
	elements?: PuzzleElement[] | null | undefined;
	steps?: number | undefined;
	message?: string | null | undefined;
}

export interface SolutionProgress {
	solution: PuzzleSolution;
	steps: number;
	onProgress: (solution: PuzzleSolution) => void;
	onTimeout: () => void;
	message?: string | null | undefined;
}

export interface SolutionOptions {
	start: number;
	timeout: number;
	accuracy: number;
}
