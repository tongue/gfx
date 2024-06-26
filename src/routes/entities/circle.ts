import type { Entity } from '../types';
import { Color } from '../color';
import { Vector } from '../vector';

export class Circle implements Entity {
	private radius: number;
	public color: Color;

	constructor(
		public position: Vector,
		public velocity: Vector,
		public acceleration: Vector,
		public drag: number,
		public mass: number,
		hex_color: string,
		alpha: number
	) {
		this.drag = drag;
		this.color = new Color(hex_color, alpha);
		this.radius = Math.sqrt(mass);
	}

	update() {
		const drag = this.velocity.clone();
		drag.normalize();
		drag.multiply(new Vector(-1, -1));
		drag.magnitude = this.drag * this.velocity.magnitude_squared;
		this.acceleration.add(Vector.divide(drag, this.mass));
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.multiply(new Vector(0, 0));
	}

	draw(ctx: CanvasRenderingContext2D) {
		const x_from_center = this.position.x + ctx.canvas.width / 2;
		const y_from_center = this.position.y + ctx.canvas.height / 2;
		ctx.beginPath();
		ctx.fillStyle = this.color.to_string();
		ctx.arc(x_from_center, y_from_center, this.radius, 0, Math.PI * 2);
		ctx.fill();
		this.reset();
	}

	reset() {
		this.color.reset();
	}
}
