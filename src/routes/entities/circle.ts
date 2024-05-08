import type { Entity } from '../types';
import { Vector } from '../vector';

export class Circle implements Entity {
	private radius: number;
	private original_color: string;

	constructor(
		public position: Vector,
		public velocity: Vector,
		public acceleration: Vector,
		public drag: Vector,
		public mass: number,
		public color: string
	) {
		this.original_color = color;
		this.drag = drag;
		this.radius = Math.sqrt(mass);
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.multiply(this.drag);
		this.position.add(this.velocity);
		this.acceleration.multiply(new Vector(0, 0));
	}

	draw(ctx: CanvasRenderingContext2D) {
		const x_from_center = this.position.x + ctx.canvas.width / 2;
		const y_from_center = this.position.y + ctx.canvas.height / 2;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(x_from_center, y_from_center, this.radius, 0, Math.PI * 2);
		ctx.fill();
		this.reset();
	}

	reset() {
		this.color = this.original_color;
	}
}
