'use server';
import { getPredefinedArea, getPredefinedElements } from '@/lib/game';
import { initSolution, solvePuzzle } from '@/lib/solver';
import { PuzzleArea } from '@/models/PuzzleArea';
import { PuzzleSolution } from '@/models/PuzzleSolution';

export async function findSolution() {
	const result = await new Promise<{ area: PuzzleArea }>(
		(resolve, reject) => {
			const startSolution = initSolution(
				getPredefinedArea(),
				getPredefinedElements()
			);
			const solutions: PuzzleSolution[] = [];
			const topSolution = [startSolution];
			solvePuzzle(startSolution, solutions, topSolution, (top) => {
				topSolution[0] = top;
				if (top.unsolved.length == 0) resolve({ area: top.area });
			});
		}
	);

	return result;
}
