import { CellType, Shaped } from '@/models/common';
import { PuzzleArea } from '@/models/PuzzleArea';

import {
	blockSizePx,
	blockSpacePx,
	maxElementHeightN,
	maxElementWidthN,
} from './game';

export function getShapedWidthN({ shape }: Shaped) {
	return shape.flat().length / shape.length;
}

export function getMaxElementWidthPx() {
	return (
		maxElementWidthN * blockSizePx + (maxElementWidthN - 1) * blockSpacePx
	);
}

export function getShapedWidthPx(element: Shaped) {
	const width = getShapedWidthN(element);
	return width * blockSizePx + (width - 1) * blockSpacePx;
}

export function getShapedHeightN({ shape }: Shaped) {
	return Math.max(shape.length);
}

export function getMaxElementHeigthPx() {
	return (
		maxElementHeightN * blockSizePx + (maxElementHeightN - 1) * blockSpacePx
	);
}

export function getShapedHeightPx(element: Shaped) {
	const height = getShapedHeightN(element);
	return height * blockSizePx + (height - 1) * blockSpacePx;
}

export function expandToLength(arr: CellType[], length: number) {
	return [...arr, ...Array.from({ length: length - arr.length }, () => -1)];
}

export function rotateCW(source: Shaped): Shaped {
	const width = getShapedWidthN(source);
	const height = getShapedHeightN(source);

	const arr = Array.from({ length: width }, () =>
		Array.from({ length: height }, () => -1)
	);

	for (let ri = 0; ri < source.shape.length; ri++) {
		for (let ci = 0; ci < source.shape[ri].length; ci++) {
			arr[ci][height - ri - 1] = source.shape[ri][ci];
		}
	}

	return { shape: arr };
}

export function flipX(source: Shaped): Shaped {
	const width = getShapedWidthN(source);
	const height = getShapedHeightN(source);

	const arr = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => -1)
	);

	for (let ri = 0; ri < source.shape.length; ri++) {
		for (let ci = 0; ci < source.shape[ri].length; ci++) {
			arr[height - ri - 1][ci] = source.shape[ri][ci];
		}
	}

	return { shape: arr };
}

export function flipY(source: Shaped): Shaped {
	const width = getShapedWidthN(source);
	const height = getShapedHeightN(source);

	const arr = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => -1)
	);

	for (let ri = 0; ri < source.shape.length; ri++) {
		for (let ci = 0; ci < source.shape[ri].length; ci++) {
			arr[ri][width - ci - 1] = source.shape[ri][ci];
		}
	}

	return { shape: arr };
}

export function shapesEquals(shape1: Shaped, shape2: Shaped) {
	const fs1 = shape1.shape.flat();
	const fs2 = shape2.shape.flat();

	return (
		fs1.length == fs2.length && fs1.every((val, index) => fs2[index] == val)
	);
}

export function getFlatSize({ shape }: Shaped) {
	return shape.flat().filter((item) => item > -1).length;
}

export function cloneShape(source: Shaped) {
	const result: Shaped = {
		shape: source.shape.map((row) => [...row]),
	};

	return result;
}

export function cloneArea(source: PuzzleArea): PuzzleArea {
	return {
		shape: cloneShape(source).shape,
		width: source.width,
		height: source.height,
	};
}

export function mergeShapes(
	from: Shaped,
	to: Shaped,
	x: number,
	y: number
): Shaped | false {
	const merged = cloneShape(to);

	for (let sy = 0; sy < from.shape.length; sy++) {
		const ri = sy + y;
		if (ri >= to.shape.length) return false;

		for (let sx = 0; sx < from.shape[sy].length; sx++) {
			const ci = sx + x;
			if (ci >= to.shape[ri].length) return false;

			const val = from.shape[sy][sx];
			if (val == -1) continue;

			if (to.shape[ri][ci] > -1) return false;

			merged.shape[ri][ci] = val;
		}
	}

	return merged;
}
