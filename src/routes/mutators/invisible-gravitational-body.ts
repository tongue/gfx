import type { Mutator, Entity } from '../types';
import { Vector } from '../vector';
import { clamp } from '../utils';
import { Color } from '../color';

export type InvisibleGravitationalBodyOptions = {
	position?: [number, number];
	mass?: number;
	gravity?: number;
	distance_range?: [number, number];
};

export class InvisibleGravitationalBody implements Mutator {
	private ctx: CanvasRenderingContext2D;
	private position: Vector;
	private mass: number;
	private gravity: number;
	private distance_range: [number, number];
	private debug_color: Color;

	constructor(options: InvisibleGravitationalBodyOptions, ctx: CanvasRenderingContext2D, ) {
		this.ctx = ctx;
		if (options.position) {
			const x = options.position[0] * ctx.canvas.width / 2;
			const y = options.position[1] * ctx.canvas.height / 2;
			this.position = new Vector(x, y);
		} else {
			this.position = new Vector(0, 0);
		}
		this.mass = options.mass ?? 1;
		this.gravity = options.gravity ?? 0.1;
		this.distance_range = options.distance_range ?? [1, 100];
		this.debug_color = new Color('#ff0000', 1);
	}

	update(entity: Entity) {
		const force = Vector.subtract(this.position, entity.position);
		const distance_squared = clamp(force.magnitude_squared, ...this.distance_range);
		const strength = (this.gravity * (this.mass * entity.mass)) / distance_squared;
		force.magnitude = strength;
		const force_by_mass = Vector.divide(force, entity.mass);
		entity.acceleration.add(force_by_mass);
	}

	debug() {
		const x_from_center = this.position.x + this.ctx.canvas.width / 2;
		const y_from_center = this.position.y + this.ctx.canvas.height / 2;
		this.ctx.beginPath();
		this.ctx.strokeStyle = this.debug_color.to_string();
		this.ctx.arc(x_from_center, y_from_center, Math.sqrt(this.mass), 0, Math.PI * 2);
		this.ctx.stroke();
	}

	destroy() {
		// noop
	}
}

export const options = {
	default: {
		position: [0.0, 0.0],
		mass: 500,
		gravity: 0.05,
		distance_range: [10_000, 20_000]
	},
	config: {
		title: 'Invisible gravitational body mutator',
		configuration: [
			{
				value: 'position',
				title: 'Position',
				controls: [
					{ type: 'range', min: -1, max: 1, step: 0.001 },
					{ type: 'range', min: -1, max: 1, step: 0.001 }
				]
			},
			{
				value: 'mass',
				title: 'Mass',
				controls: [{ type: 'range', min: 1, max: 10000 }]
			},
			{
				value: 'gravity',
				title: 'Gravity',
				controls: [{ type: 'range', min: -1, max: 1, step: 0.001 }]
			},
			{
				value: 'distance_range',
				title: 'Distance range',
				controls: [
					{ type: 'range', min: 0, max: 10000 },
					{ type: 'range', min: 0, max: 10000 }
				]
			}
		]
	}
};

