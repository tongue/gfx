import type { Mutator, Entity } from '../types';
import { Vector } from '../vector';
import { clamp } from '../utils';

export type GravityOptions = {
	gravity?: number;
	distance_range?: [number, number];
};

export class MousePusher implements Mutator {
	private distance_range: [number, number];
	private gravity: number;
	private position: Vector | null;
	private mass: number;

	constructor(options: GravityOptions) {
		console.log('MousePusher constructor', options);
		this.gravity = options.gravity ?? -0.03;
		this.distance_range = options.distance_range ?? [0, 5];
		this.position = null;
		this.mass = 1;

		document.addEventListener('mousemove', this.on_mouse_move.bind(this));
	}

	private on_mouse_move(e: MouseEvent) {
		const canvas = document.querySelector('canvas');
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		this.position = new Vector(e.clientX - rect.left, e.clientY - rect.top);
	}

	update(entity: Entity) {
		if (!this.position) return;
		const force = Vector.subtract(this.position, entity.position);
		const distance_squared = clamp(force.magnitude_squared, ...this.distance_range);
		const strength = (this.gravity * (this.mass * entity.mass)) / distance_squared;
		force.magnitude = strength;
		const force_by_mass = Vector.divide(force, entity.mass);
		entity.acceleration.add(force_by_mass);
	}
}
