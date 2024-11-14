'use client';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { scroller } from 'react-scroll';

import Image from 'next/image';

import { SolutionResponse } from '@/models/PuzzleSolution';

import {
	defaultSetId,
	emptySolution,
	getPredefinedSet,
	maxElementHeightN,
	maxElementWidthN,
	minElementWidthN,
	predefinedAreaHeight,
	predefinedAreaWidth,
	sets,
} from '@/lib/game';
import { generateElementsSet } from '@/lib/generator';

import { AnimatePuzzleArea, PuzzleAreaShape } from '@/components/ui/area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { PuzzleElementPreview } from '@/components/ui/shape';

import { findSolution } from './actions';

import { Loader2, RefreshCw } from 'lucide-react';

const initialState: SolutionResponse = {
	solution: emptySolution,
	elements: [],
};

export default function Home() {
	const [setId, setSetId] = useState(defaultSetId);
	const [solvedAt, setSolvedAt] = useState(-1);
	const [timer, setTimer] = useState(0);
	const [gameSet, setGameSet] = useState(getPredefinedSet(defaultSetId));
	const [gameSetJson, setGameSetJson] = useState('');

	const formRef = useRef<HTMLFormElement>(null);

	const [state, formAction, isPending] = useActionState(
		findSolution,
		initialState
	);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | undefined;
		if (isPending) {
			intervalId = setInterval(() => {
				setTimer((tValue) => tValue + 0.2);
			}, 200);
		} else {
			setSolvedAt(Date.now());
		}
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [isPending]);

	const resetGame = () => {
		state.solution = emptySolution;
		state.steps = 0;
		state.message = '';

		setSolvedAt(-1);
		setTimer(0);
	};

	const generateRandomSet = () => {
		setSetId(-1);
		const generatedSet = generateElementsSet(
			minElementWidthN,
			maxElementWidthN,
			maxElementHeightN,
			predefinedAreaWidth,
			predefinedAreaHeight
		);
		setGameSet(generatedSet);
		setGameSetJson(JSON.stringify(generatedSet));
	};

	const gameArea = state?.solution?.area ?? emptySolution.area;

	const solvedInSteps = state?.steps ?? 0;
	const hasError =
		state?.message?.length || state?.solution?.unsolved?.length;

	return (
		<div className="items-center justify-items-center min-h-screen p-6 gap-16 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center w-full">
				<Card className="w-full md:w-10/12">
					<CardHeader>
						<CardTitle className="text-2xl font-semibold">
							{'Geometric Puzzle Solver'}
						</CardTitle>
						<CardDescription>
							{
								'Demo app solves geometric puzzle game using Greedy Backtracking algorithm (read About for more details)'
							}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-row flex-wrap gap-2 scroll-m-20 border-y py-2 justify-between">
							<div className="flex flex-row gap-2 py-1">
								<h4 className="text-xl font-semibold tracking-tight">
									{'Puzzle Elements'}
								</h4>
								<Badge>{gameSet.elements.length}</Badge>
							</div>
							<div className="flex flex-row gap-2 items-center">
								{setId === -1 ? (
									<Button
										variant={'outline'}
										disabled={isPending}
										onClick={generateRandomSet}
									>
										<RefreshCw />
										{'Generate new'}
									</Button>
								) : (
									<></>
								)}
								<Select
									value={setId.toString()}
									onValueChange={(selected) => {
										const selectedId = parseInt(selected);
										if (selectedId > -1) {
											setSetId(selectedId);
											setGameSet(
												getPredefinedSet(selectedId)
											);
											setGameSetJson('');
										} else {
											generateRandomSet();
										}
									}}
								>
									<SelectTrigger className="w-full md:w-[200px]">
										<SelectValue placeholder="Select puzzle set" />
									</SelectTrigger>
									<SelectContent>
										{[
											...sets.map((set, index) => (
												<SelectItem
													key={`set_${index}`}
													value={`${index}`}
												>
													{`Set #${index + 1}`}
												</SelectItem>
											)),
										]}
										<SelectItem
											key={`set_custom`}
											value={'-1'}
										>
											{'Random set'}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="py-2 grid grid-cols-5 gap-4">
							{[
								...gameSet.elements.map((element, ei) => (
									<PuzzleElementPreview
										element={element}
										key={`shape${ei}`}
									/>
								)),
							]}
						</div>
						<div
							id="puzzle-area"
							className="flex flex-row flex-wrap gap-2 scroll-m-20 border-y py-2 justify-between"
						>
							<div className="flex flex-row flex-wrap gap-2 py-2">
								<h4 className="text-xl font-semibold tracking-tight">
									{'Puzzle Area'}
								</h4>
								{gameArea ? (
									<Badge>{`${gameArea.width} x ${gameArea.height}`}</Badge>
								) : (
									<></>
								)}
								<h4
									className={`text-xl font-semibold tracking-tight ${state?.solution?.isFinal ? 'text-green-700' : hasError ? 'text-red-600' : ''}`}
								>
									{solvedAt >= 0 || isPending
										? `${isPending ? 'Solving ' : `${state?.solution?.isFinal ? 'Solved' : 'Finished'} in `} ${timer.toFixed(2)}s${solvedInSteps > 0 ? ` in ${solvedInSteps} steps` : ''}`
										: 'Not solved yet'}
								</h4>
								{hasError ? (
									<h4 className="text-xl text-red-600 font-semibold tracking-tight">
										{state?.message ??
											'Puzzle cannot be solved'}
									</h4>
								) : (
									<></>
								)}
							</div>
							<div className="flex flex-row gap-2 pt-1">
								<Button
									disabled={isPending}
									type={'button'}
									variant={'secondary'}
									onClick={resetGame}
								>
									{'Reset'}
								</Button>
								<form
									ref={formRef}
									className="flex flex-row gap-2"
									action={formAction}
									onSubmit={() => {
										resetGame();

										scroller.scrollTo('puzzle-area', {
											duration: 300,
											smooth: true,
											containerId: 'body',
										});
									}}
								>
									<input
										type="hidden"
										id="set_id"
										name="set_id"
										value={setId}
									/>
									<input
										type="hidden"
										id="game_set"
										name="game_set"
										value={gameSetJson}
									/>
									{isPending ? (
										<Button disabled>
											<Loader2 className="animate-spin" />
											Please wait
										</Button>
									) : (
										<Button type={'submit'}>
											Solve Puzzle
										</Button>
									)}
								</form>
							</div>
						</div>
						<div className="py-2">
							{isPending ? (
								<AnimatePuzzleArea area={gameArea} />
							) : (
								<PuzzleAreaShape
									key={`area_${solvedAt}`}
									area={gameArea}
									elements={state?.elements ?? []}
								/>
							)}
						</div>
					</CardContent>
				</Card>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center p-6">
				<p>Powered by:</p>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://react.dev/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/react.svg"
						alt="React icon"
						width={16}
						height={16}
					/>
					React
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/next.svg"
						alt="Next.js icon"
						width={16}
						height={16}
					/>
					Next.js
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://ui.shadcn.com/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/globe.svg"
						alt="shadcn icon"
						width={16}
						height={16}
					/>
					shadcn/ui
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://github.com/andriideren/puzzle-solver"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/github.svg"
						alt="GitHub icon"
						width={16}
						height={16}
					/>
					Visit GitHub Repository →
				</a>
			</footer>
		</div>
	);
}
