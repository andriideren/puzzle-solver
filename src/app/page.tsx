'use client';
import { Loader2 } from 'lucide-react';
import React, { useActionState, useState } from 'react';

import { useFormStatus } from 'react-dom';

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
import { PuzzleElementPreview } from '@/components/ui/shape';

import { getPredefinedArea, getPredefinedElements } from '@/lib/game';
import { PuzzleArea } from '@/models/PuzzleArea';

import { findSolution } from './actions';

const initialState: { area: PuzzleArea } = {
	area: getPredefinedArea(),
};

function SolveButton() {
	const { pending: isSolving } = useFormStatus();
	return (
		<>
			{isSolving ? (
				<Button disabled>
					<Loader2 className="animate-spin" />
					Please wait
				</Button>
			) : (
				<Button type={'submit'}>Solve Puzzle</Button>
			)}
		</>
	);
}

export default function Home() {
	const elements = getPredefinedElements();
	const [ts, setTs] = useState(0);

	const [state, formAction, isPending] = useActionState(
		findSolution,
		initialState
	);

	const gameArea = state?.area ?? getPredefinedArea();

	const onReset = () => {
		state.area = getPredefinedArea();
		setTs(Date.now());
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-16 gap-16 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center w-full">
				<Card className="w-10/12">
					<CardHeader>
						<CardTitle>{'Geometric Puzzle Solver'}</CardTitle>
						<CardDescription>
							{
								'Demo app solves geometric puzzle game using decisions tree algorithm'
							}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-row gap-2 scroll-m-20 border-b pb-2">
							<h4 className="text-xl font-semibold tracking-tight">
								{'Puzzle Elements'}
							</h4>
							<Badge>{elements.length}</Badge>
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
						<div className="flex flex-row flex-wrap gap-2 scroll-m-20 border-y py-2 justify-between">
							<div className="flex flex-row gap-2 py-2">
								<h4 className="text-xl font-semibold tracking-tight">
									{'Puzzle Area'}
								</h4>
								<Badge>{`${gameArea.width} x ${gameArea.height}`}</Badge>
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
								<form action={formAction}>
									<SolveButton />
								</form>
							</div>
						</div>
						<div className="py-2">
							<PuzzleAreaShape
								key={`are_${ts}`}
								area={gameArea}
								elements={elements}
							/>
						</div>
					</CardContent>
				</Card>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://github.com/andriideren/puzzle-solver"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/globe.svg"
						alt="Globe icon"
						width={16}
						height={16}
					/>
					Visit GitHub Repository →
				</a>
			</footer>
		</div>
	);
}
