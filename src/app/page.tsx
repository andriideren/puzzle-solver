'use client';
import { Loader2 } from 'lucide-react';
import React, { useActionState, useEffect, useMemo, useState } from 'react';
import { scroller } from 'react-scroll';

import Image from 'next/image';

import { PuzzleAreaShape } from '@/components/ui/area';
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

import { emptySolution, getPredefinedElements, sets } from '@/lib/game';
import { mergeToArea } from '@/lib/geometry';
import { SolutionResponse } from '@/models/PuzzleSolution';

import { findSolution } from './actions';

const initialState: SolutionResponse = {
	solution: emptySolution,
};

export default function Home() {
	const [setId, setSetId] = useState(1);
	const [solvedAt, setSolvedAt] = useState(0);
	const [animateX, setX] = useState(0);
	const [animateY, setY] = useState(0);
	const elements = useMemo(() => getPredefinedElements(setId), [setId]);

	const [timer, setTimer] = useState(0);

	const [state, formAction, isPending] = useActionState(
		findSolution,
		initialState
	);

	useEffect(() => {
		let intervalId: NodeJS.Timeout | undefined;
		if (isPending) {
			intervalId = setInterval(() => {
				setTimer((tValue) => tValue + 0.2);
				setX((xVal) => {
					if (xVal < emptySolution.area.width - 4) {
						return xVal + 1;
					}

					setY((yVal) => {
						if (yVal < emptySolution.area.height - 2)
							return yVal + 1;
						return 0;
					});

					return 0;
				});
			}, 200);
		} else {
			setSolvedAt(Date.now());
		}
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [isPending]);

	const onReset = () => {
		state.solution = emptySolution;

		setSolvedAt(0);
		setTimer(0);
		setX(0);
		setY(0);
	};

	const gameArea = isPending
		? mergeToArea(
				{
					shape: [
						[1, 2, 3, -1],
						[-1, 6, 7, 8],
					],
				},
				emptySolution.area,
				animateX,
				animateY
			)
		: (state?.solution?.area ?? emptySolution.area);

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
								'Demo app solves geometric puzzle game using decisions tree algorithm'
							}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-row flex-wrap gap-2 scroll-m-20 border-y py-2 justify-between">
							<div className="flex flex-row gap-2 py-1">
								<h4 className="text-xl font-semibold tracking-tight">
									{'Puzzle Elements'}
								</h4>
								<Badge>{elements.length}</Badge>
							</div>
							<Select
								value={setId.toString()}
								onValueChange={(selected) => {
									setSetId(parseInt(selected));
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
								</SelectContent>
							</Select>
						</div>
						<div className="py-2 grid grid-cols-5 gap-4">
							{[
								...elements.map((element, ei) => (
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
								<h4 className="text-xl font-semibold tracking-tight">
									{solvedAt || isPending
										? `${isPending ? 'Solving ' : 'Solved in '} ${timer.toFixed(2)}s`
										: 'Not solved yet'}
								</h4>
							</div>
							<div className="flex flex-row gap-2 pt-1">
								<Button
									disabled={isPending}
									type={'button'}
									variant={'secondary'}
									onClick={() => {
										onReset();
									}}
								>
									{'Reset'}
								</Button>
								<form
									className="flex flex-row gap-2"
									action={formAction}
									onSubmit={() => {
										onReset();

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
							{gameArea ? (
								<PuzzleAreaShape
									key={`area_${solvedAt}`}
									area={gameArea}
									elements={elements}
								/>
							) : (
								<></>
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
