import { Vector } from './vector';

// TODO: Easter egg:
// rörelse mellan flera olika browser fönster

function random_between(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function hex_to_rgb(hex: string) {
	const r = parseInt(hex.substring(1, 3), 16);
	const g = parseInt(hex.substring(3, 5), 16);
	const b = parseInt(hex.substring(5, 7), 16);
	return { r, g, b };
}

function random_color(palette: string[], alpha: number = 1) {
	const hex_color = palette[Math.floor(random_between(0, palette.length))];
	const { r, g, b } = hex_to_rgb(hex_color);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type MultiBodyGravitationOptions = {
	amount: number;
	velocity_magnitude: [number, number];
	position_magnitude: [number, number];
	mass_range: [number, number];
	center_mass: number;
	distance_range: [number, number];
	gravity: number;
	palette: string[];
	alpha: number;
	trail: number;
};

export class MultiBodyGravitation {
	raf: ReturnType<typeof requestAnimationFrame> | null = null;
	circles: Circle[] = [];
	center: Circle;
	trail: number;

	constructor(
		private ctx: CanvasRenderingContext2D,
		options: MultiBodyGravitationOptions
	) {
		this.trail = options.trail;
		this.center = new Circle(
			new Vector(0, 0),
			new Vector(0, 0),
			options.center_mass,
			options.distance_range,
			options.gravity,
			random_color(options.palette)
		);
		this.setup(
			options.amount,
			options.velocity_magnitude,
			options.position_magnitude,
			options.mass_range,
			options.distance_range,
			options.gravity,
			options.palette,
			options.alpha
		);
		this.raf = requestAnimationFrame(this.update.bind(this));
	}

	private setup(
		amount: number,
		velocity_magnitude: [number, number],
		position_magnitude: [number, number],
		mass_range: [number, number],
		distance_range: [number, number],
		gravity: number,
		palette: string[],
		alpha: number
	) {
		for (let i = 0; i < amount; i++) {
			const position = Vector.random();
			const velocity = position.clone();
			velocity.setMagnitude(random_between(...velocity_magnitude));
			position.setMagnitude(random_between(...position_magnitude));
			velocity.rotate(Math.PI / 2);
			const mass = random_between(...mass_range);
			this.circles.push(
				new Circle(position, velocity, mass, distance_range, gravity, random_color(palette, alpha))
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
		for (let i = 0; i < this.circles.length; i++) {
			this.center.attract(this.circles[i]);
			for (let j = 0; j < this.circles.length; j++) {
				if (i !== j) {
					this.circles[i].attract(this.circles[j]);
				}
			}
		}

		for (let i = 0; i < this.circles.length; i++) {
			const circle = this.circles[i];
			circle.update();
			circle.draw(this.ctx);
		}
	}

	destroy() {
		if (this.raf) {
			cancelAnimationFrame(this.raf);
		}
	}
}

class Circle {
	private radius: number;
	private acceleration = new Vector(0, 0);

	constructor(
		private position: Vector,
		private velocity: Vector,
		private mass: number,
		private distance_range: [number, number],
		private gravity: number = 1,
		private color: string
	) {
		this.radius = Math.sqrt(mass) * 2;
	}

	apply_force(force: Vector) {
		const force_by_mass = Vector.divide(force, this.mass);
		this.acceleration.add(force_by_mass);
	}

	attract(other: Circle) {
		const force = Vector.subtract(this.position, other.position);
		const distance_squared = clamp(force.magnitudeSquared, ...this.distance_range);
		const strength = (this.gravity * (this.mass * other.mass)) / distance_squared;
		force.setMagnitude(strength);
		other.apply_force(force);
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
