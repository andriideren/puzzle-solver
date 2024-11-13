export type CellType = number;

export interface Shaped {
	shape: CellType[][];
}

export interface ShapeVariations {
	variations: Shaped[];
}
