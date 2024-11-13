'use server';
import { getPredefinedArea, getPredefinedElements } from '@/lib/game';
import { initSolution, solvePuzzle } from '@/lib/solver';
import { SolutionProgress, SolutionResponse } from '@/models/PuzzleSolution';

export async function findSolution(
	prevState: SolutionResponse,
	formData: FormData
) {
	const result = await new Promise<SolutionResponse>((resolve) => {
		const receivedId = formData.get('set_id')?.toString();
		const setId = parseInt(receivedId ?? '0');
		const startSolution = initSolution(
			getPredefinedArea(),
			getPredefinedElements(setId)
		);

		const progress: SolutionProgress = {
			solution: startSolution,
			onProgress: (solution) => {
				if (solution.isFinal) resolve({ solution: solution });
			},
		};

		solvePuzzle(startSolution, progress);

		resolve({ solution: progress.solution });
	});

	return result;
}
