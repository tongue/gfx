import type { Entity } from '../types';
import { Vector } from '../vector';

export class Circle implements Entity {
	private radius: number;

	constructor(
		public position: Vector,
		public velocity: Vector,
		public acceleration: Vector,
		public mass: number,
		private color: string
	) {
		this.radius = Math.sqrt(mass);
	}

	update() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.multiply(0);
	}

	draw(ctx: CanvasRenderingContext2D) {
		const x_from_center = this.position.x + ctx.canvas.width / 2;
		const y_from_center = this.position.y + ctx.canvas.height / 2;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(x_from_center, y_from_center, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}
}
