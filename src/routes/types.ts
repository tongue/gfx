import type { Color } from './color';
import type { Vector } from './vector';

export interface Entity {
	position: Vector;
	drag: Vector;
	mass: number;
	velocity: Vector;
	acceleration: Vector;
	color: Color;
	update(): void;
	draw(ctx: CanvasRenderingContext2D): void;
}

export interface Mutator {
	update(entity: Entity, all_entities: Entity[]): void;
	debug(): void;
}
