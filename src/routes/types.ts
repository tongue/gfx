import type { Vector } from './vector';

export interface Entity {
	position: Vector;
	mass: number;
	velocity: Vector;
	acceleration: Vector;
	update(): void;
	draw(ctx: CanvasRenderingContext2D): void;
}

export interface Mutator {
	update(entity: Entity, all_entities: Entity[]): void;
	debug(): void;
}
