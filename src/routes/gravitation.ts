import type { Entity, Mutator } from './types';
import { Vector } from './vector';
import { map_values, random_between, random_item } from './utils';
import { Gravity, options as g_options, type GravityOptions } from './mutators/gravity';
import {
	InvisibleGravitationalBody,
	options as igb_options,
	type InvisibleGravitationalBodyOptions
} from './mutators/invisible-gravitational-body';
import { AlphaSpeed, options as as_options, type AlphaSpeedOptions } from './mutators/alpha-speed';
import { Circle } from './entities/circle';
import { EndlessEdge, type EndlessEdgeOptions } from './mutators/endless-edges';
import { Perlin, type PerlinOptions } from './mutators/perlin';

// TODO: Easter egg:
// rörelse mellan flera olika browser fönster

export enum MutatorType {
	Gravity = 'gravity',
	InvisibleGravitationalBody = 'invisible_gravitational_body',
	AlphaSpeed = 'alpha_speed',
	EndlessEdge = 'endless_edge',
	Perlin = 'perlin'
}

export type EntityClusterOptions = {
	debug: boolean;
	amount: number;
	velocity_magnitude: [number, number];
	position_magnitude: [number, number];
	mass_range: [number, number];
	drag: number;
	palette: string[];
	alpha: number;
	trail: number;

	mutators: MutatorVariant[];
};

type GravityMutator = {
	type: MutatorType.Gravity;
	options: GravityOptions;
};

type InvisibleGravitationalBodyMutator = {
	type: MutatorType.InvisibleGravitationalBody;
	options: InvisibleGravitationalBodyOptions;
};

type AlphaSpeedMutator = {
	type: MutatorType.AlphaSpeed;
	options: AlphaSpeedOptions;
};

type EndlessEdgeMutator = {
	type: MutatorType.EndlessEdge;
	options: EndlessEdgeOptions;
};

type PerlinNoiseMutator = {
	type: MutatorType.Perlin;
	options: PerlinOptions;
};

type MutatorVariant =
	| GravityMutator
	| InvisibleGravitationalBodyMutator
	| AlphaSpeedMutator
	| EndlessEdgeMutator
	| PerlinNoiseMutator;

const mutator_map = {
	[MutatorType.Gravity]: Gravity,
	[MutatorType.InvisibleGravitationalBody]: InvisibleGravitationalBody,
	[MutatorType.AlphaSpeed]: AlphaSpeed,
	[MutatorType.EndlessEdge]: EndlessEdge,
	[MutatorType.Perlin]: Perlin
};

export class EntityCluster {
	raf: ReturnType<typeof requestAnimationFrame> | null = null;
	entities: Entity[] = [];
	mutators: Mutator[] = [];
	trail: number;
	debug = true;

	constructor(
		private ctx: CanvasRenderingContext2D,
		options: EntityClusterOptions
	) {
		this.trail = options.trail;
		this.debug = options.debug;
		this.setup(options);
		this.raf = requestAnimationFrame(this.update.bind(this));
	}

	private setup(options: EntityClusterOptions) {
		for (const mutator of options.mutators) {
			const Mutator = mutator_map[mutator.type];
			const opts = mutator.options;
			this.mutators.push(new Mutator(opts as { [key: string]: unknown }, this.ctx));
		}

		for (let i = 0; i < options.amount; i++) {
			const position = Vector.random();
			const acceleration = new Vector(0, 0);
			const velocity = position.clone();
			velocity.magnitude =  map_values(random_between(...options.velocity_magnitude), options.velocity_magnitude[0], options.velocity_magnitude[1], -options.velocity_magnitude[0], options.velocity_magnitude[1]);
			position.magnitude = random_between(...options.position_magnitude);
			velocity.rotate(Math.PI / 2);
			const mass = random_between(...options.mass_range);
			this.entities.push(
				new Circle(
					position,
					velocity,
					acceleration,
					options.drag,
					mass,
					random_item(options.palette),
					options.alpha
				)
			);
		}
	}

	private update() {
		if (this.raf) {
			cancelAnimationFrame(this.raf);
		}
		this.raf = requestAnimationFrame(this.update.bind(this));

		this.ctx.fillStyle = `rgba(0, 0, 0, ${this.trail})`;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

		for (let entity_idx = 0; entity_idx < this.entities.length; entity_idx++) {
			const entity = this.entities[entity_idx];
			for (let mutator_idx = 0; mutator_idx < this.mutators.length; mutator_idx++) {
				const mutator = this.mutators[mutator_idx];
				mutator.update(entity, this.entities);
				if (this.debug) {
					mutator.debug();
				}
			}
		}

		this.draw();
	}

	private draw() {
		for (let entity_idx = 0; entity_idx < this.entities.length; entity_idx++) {
			const entity = this.entities[entity_idx];
			entity.update();
			entity.draw(this.ctx);
		}
	}

	destroy() {
		if (this.raf) {
			cancelAnimationFrame(this.raf);
		}
		for (const mutator of this.mutators) {
			mutator.destroy();
		}
	}
}

export const options = {
	default: {
		debug: true,
		amount: 20,
		velocity_magnitude: [0.1, 0.5],
		position_magnitude: [100, 150],
		mass_range: [100, 300],
		drag: 0.01,
		gravity: 0.05,
		palette: ['#ffffff'],
		alpha: 0.4,
		trail: 1,
		mutators: [
			{
				type: MutatorType.InvisibleGravitationalBody,
				options: { ...igb_options.default }
			},
			{
				type: MutatorType.Gravity,
				options: { ...g_options.default }
			},
			{
				type: MutatorType.AlphaSpeed,
				options: { ...as_options.default }
			}
		]
	},
	config: {
		title: 'Entity cluster',
		configuration: [
			{
				value: 'debug',
				title: 'Debug',
				controls: [{ type: 'checkbox' }]
			},
			{
				value: 'amount',
				title: 'Amount of entities',
				controls: [{ type: 'range', min: 1, max: 500 }]
			},
			{
				value: 'velocity_magnitude',
				title: 'Velocity magnitude',
				controls: [
					{ type: 'range', min: 0, max: 2, step: 0.001 },
					{ type: 'range', min: 0, max: 2, step: 0.001 }
				]
			},
			{
				value: 'drag',
				title: 'Drag',
				controls: [{ type: 'range', min: 0, max: 1, step: 0.001 }]
			},
			{
				value: 'position_magnitude',
				title: 'Position magnitude',
				controls: [
					{ type: 'range', min: 0, max: 10000 },
					{ type: 'range', min: 0, max: 10000 }
				]
			},
			{
				value: 'mass_range',
				title: 'Mass range',
				controls: [
					{ type: 'range', min: 1, max: 10000 },
					{ type: 'range', min: 1, max: 10000 }
				]
			},
			{
				value: 'palette',
				title: 'Palette',
				controls: [{ type: 'color' }]
			},
			{
				value: 'alpha',
				title: 'Alpha',
				controls: [{ type: 'range', min: 0, max: 1, step: 0.01 }]
			},
			{
				value: 'trail',
				title: 'Trail',
				controls: [{ type: 'range', min: 0, max: 1, step: 0.01 }]
			}
		]
	}
};
