'use server';
import {
	getPredefinedArea,
	getPredefinedElements,
	solutionAccuracy,
} from '@/lib/game';
import { initSolution, solvePuzzle } from '@/lib/solver';
import { PuzzleSolution, SolutionResponse } from '@/models/PuzzleSolution';

export async function findSolution(
	prevState: SolutionResponse,
	formData: FormData
) {
	const result = await new Promise<SolutionResponse>((resolve, reject) => {
		const receivedId = formData.get('set_id')?.toString();
		const setId = parseInt(receivedId ?? '0');
		const startSolution = initSolution(
			getPredefinedArea(),
			getPredefinedElements(setId)
		);
		const solutions: PuzzleSolution[] = [];
		const topSolution = [startSolution];
		solvePuzzle(startSolution, solutions, topSolution, (top) => {
			topSolution[0] = top;
			if (top.unsolved.length == solutionAccuracy)
				resolve({ solution: top });
		});

		resolve({ solution: topSolution[0] });
	});

	return result;
}
