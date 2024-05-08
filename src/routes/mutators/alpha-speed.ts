import type { Mutator, Entity } from '../types';
import { clamp } from '../utils';

export type GravityOptions = {
	gravity?: number;
	distance_range?: [number, number];
};

export class AlphaSpeed implements Mutator {
	update(entity: Entity) {
		const [r, g, b] = entity.color.value;
		entity.color.value = [r, g, b, clamp(entity.velocity.magnitude / 10, 0, 1)];
	}

	debug() {
		// noop
	}
}

export const options = {
	default: {
	},
	config: {
	}
};
