import type { SingleMutator, Entity } from '../types';
import { clamp } from '../utils';

export type AlphaSpeedOptions = {
	alpha?: [number, number];
	multiplier?: number;
};

export class AlphaSpeed implements SingleMutator {
	private min: number;
	private max: number;
	private multiplier: number;

	constructor(options: AlphaSpeedOptions) {
		this.min = options.alpha?.[0] ?? 0.1;
		this.max = options.alpha?.[1] ?? 1;
		this.multiplier = options.multiplier ?? 0.1;
	}
	update(entity: Entity) {
		const [r, g, b] = entity.color.value;
		entity.color.value = [r, g, b, clamp(entity.velocity.magnitude * this.multiplier, this.min, this.max)];
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
		alpha: [0.1, 1],
		multiplier: 0.1
	},
	config: {
		title: 'Alpha speed mutator',
		configuration: [
			{
				value: 'alpha',
				title: 'Alpha',
				controls: [
					{ type: 'range', min: 0, max: 1, step: 0.01 },
					{ type: 'range', min: 0, max: 1, step: 0.01 }
				]
			},
			{
				value: 'multiplier',
				title: 'Multiplier',
				controls: [{ type: 'range', min: 0, max: 1, step: 0.01 }]
			}
		]
	}
};
