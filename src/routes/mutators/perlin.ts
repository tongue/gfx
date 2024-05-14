import { PerlinNoise } from '../p';
import type { SingleMutator, Entity } from '../types';
import { map_values } from '../utils';
import { Vector } from '../vector';

export type PerlinOptions = {
	level?: number;
	scale?: number;
	seed?: number;
};

export class Perlin implements SingleMutator {
	level: number;
	scale: number;
	perlin: PerlinNoise;

	constructor(options: PerlinOptions) {
		this.level = options.level ?? 20;
		this.scale = options.scale ?? 0.0003;
		this.perlin = new PerlinNoise(options.seed ?? 708);
	}

	update(entity: Entity) {

		const x_from_center = entity.position.x; 
		const y_from_center = entity.position.y; 

		const x = this.perlin.noise(x_from_center * this.scale, x_from_center * this.scale);
		const y = this.perlin.noise(y_from_center * this.scale, y_from_center * this.scale);

		const leveled_x = map_values(x, 0, 1, -this.level, this.level);
		const leveled_y = map_values(y, 0, 1, -this.level, this.level);

		entity.position.add(new Vector(leveled_x, leveled_y));
	}

	debug() {
		// noop
	}

	destroy(): void {
		// noop
	}
}

export const options = {
	default: {
		level: 20,
		scale: 0.0003,
		seed: 708
	},
	config: {
		title: 'Perlin noise',
		configuration: [
			{
				value: 'level',
				title: 'Level',
				controls: [{ type: 'range', min: 1, max: 10, step: 0.1 }]
			},
			{
				value: 'scale',
				title: 'Scale',
				controls: [{ type: 'range', min: 0.0001, max: 0.01, step: 0.0001 }]
			},
			{
				value: 'seed',
				title: 'Seed',
				controls: [{ type: 'range', min: 1, max: 1000, step: 1 }]
			}
		]
	}
};
