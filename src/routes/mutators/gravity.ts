import type { Mutator, Entity } from '../types';
import { Vector } from '../vector';
import { clamp } from '../utils';

export type GravityOptions = {
	gravity?: number;
	distance_range?: [number, number];
};

export class Gravity implements Mutator {
	private distance_range: [number, number];
	private gravity: number;

	constructor(options: GravityOptions) {
		this.gravity = options.gravity ?? 0.1;
		this.distance_range = options.distance_range ?? [1, 100];
	}

	attract(a: Entity, b: Entity) {
		const force = Vector.subtract(a.position, b.position);
		const distance_squared = clamp(force.magnitude_squared, ...this.distance_range);
		const strength = (this.gravity * (a.mass * b.mass)) / distance_squared;
		force.magnitude = strength;
		const force_by_mass = Vector.divide(force, b.mass);
		b.acceleration.add(force_by_mass);
	}

	update(entity: Entity, all_entities: Entity[]) {
		for (let i = 0; i < all_entities.length; i++) {
			if (entity !== all_entities[i]) {
				this.attract(entity, all_entities[i]);
			}
		}
	}

	debug() {
		// noop
	}
}

export const options = {
	default: {
		distance_range: [10_000, 20_000],
		gravity: 0.05
	},
	config: {
		title: 'Gravity mutator',
		configuration: [
			{
				value: 'distance_range',
				title: 'Distance range',
				controls: [
					{ type: 'range', min: 0, max: 10000 },
					{ type: 'range', min: 0, max: 10000 }
				]
			},
			{
				value: 'gravity',
				title: 'Gravity',
				controls: [{ type: 'range', min: -1, max: 1, step: 0.001 }]
			}
		]
	}
};
