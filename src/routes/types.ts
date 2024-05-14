import type { Color } from './color';
import type { QuadTree } from './quad-tree';
import type { Vector } from './vector';

export interface Entity {
	position: Vector;
	drag: number;
	mass: number;
	velocity: Vector;
	acceleration: Vector;
	color: Color;
	update(): void;
	draw(ctx: CanvasRenderingContext2D): void;
}

export interface SingleMutator {
	update(entity: Entity, quad_tree: QuadTree): void;
	debug(): void;
	destroy(): void;
}

export interface Mutator {
	update(quad_tree: QuadTree): void;
	debug(): void;
	destroy(): void;
}
