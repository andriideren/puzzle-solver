import { ShapeVariations } from './common';
import { PuzzleArea } from './PuzzleArea';
import { PuzzleElement } from './PuzzleElement';

export interface PuzzleSolution {
	area: PuzzleArea;
	unsolved: ShapeVariations[];
	steps: number;
}
