'use server';
import { PuzzleSet } from '@/models/PuzzleSet';
import { SolutionProgress, SolutionResponse } from '@/models/PuzzleSolution';

import {
	createArea,
	getPredefinedSet,
	maxTimeout,
	solutionAccuracy,
} from '@/lib/game';
import { initSolution, solvePuzzle } from '@/lib/solver';

export async function findSolution(
	prevState: SolutionResponse,
	formData: FormData
) {
	const result = await new Promise<SolutionResponse>((resolve) => {
		try {
			const receivedId = formData.get('set_id')?.toString();
			const setId = parseInt(receivedId ?? '-1');
			let gameSet: PuzzleSet | null | undefined = null;
			if (setId > -1) {
				gameSet = getPredefinedSet(setId);
			} else {
				const setData = formData.get('game_set')?.toString();
				if (setData) {
					gameSet = JSON.parse(setData);
				}
			}

			if (gameSet && gameSet.elements && gameSet.elements.length > 0) {
				const startSolution = initSolution(
					createArea(gameSet.width, gameSet.height),
					gameSet.elements
				);

				const progress: SolutionProgress = {
					solution: startSolution,
					steps: 0,
					onProgress: (solution) => {
						if (solution.isFinal)
							resolve({
								elements: gameSet.elements,
								solution: solution,
								steps: progress.steps,
							});
					},
					onTimeout: () => {
						resolve({
							message: 'Not solved. Cancelled due to timeout',
						});
					},
				};

				solvePuzzle(startSolution, progress, {
					start: Date.now(),
					timeout: maxTimeout,
					accuracy: solutionAccuracy,
				});
				resolve({
					elements: gameSet.elements,
					solution: progress.solution,
					steps: progress.steps,
				});
			} else {
				resolve({ message: 'Not solved. Game set not found' });
			}
		} catch (error) {
			resolve({
				message:
					error?.toString() ?? 'Not solved. Internal server error',
			});
		}
	});

	return result;
}
