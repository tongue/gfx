export class Vector {
	constructor(
		public x: number,
		public y: number
	) {
		this.x = x;
		this.y = y;

		return this;
	}

	add(v: Vector) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}
	static add(v1: Vector, v2: Vector) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}

	multiply(scalar: Vector) {
		this.x *= scalar.x;
		this.y *= scalar.y;

		return this;
	}
	static multiply(v: Vector, scalar: number) {
		return new Vector(v.x * scalar, v.y * scalar);
	}

	subtract(v: Vector) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}
	static subtract(v1: Vector, v2: Vector) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}

	divide(scalar: number) {
		this.x /= scalar;
		this.y /= scalar;

		return this;
	}
	static divide(v: Vector, scalar: number) {
		return new Vector(v.x / scalar, v.y / scalar);
	}

	set magnitude(magnitude: number | Vector) {
		this.normalize();
		if (typeof magnitude === 'number') {
			this.multiply(new Vector(magnitude, magnitude));
		} else {
			this.multiply(magnitude);
		}
	}

	get magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	static magnitude(v: Vector) {
		return Math.sqrt(v.x * v.x + v.y * v.y);
	}

	get magnitude_squared() {
		return this.x * this.x + this.y * this.y;
	}

	static magnitude_squared(v: Vector) {
		return v.x * v.x + v.y * v.y;
	}

	rotate(angle: number) {
		const { x, y } = this;
		this.x = x * Math.cos(angle) - y * Math.sin(angle);
		this.y = x * Math.sin(angle) + y * Math.cos(angle);

		return this;
	}

	normalize() {
		this.divide(this.magnitude);

		return this;
	}
	static normalize(v: Vector) {
		return Vector.divide(v, Vector.magnitude(v));
	}

	static random(): Vector {
		const random = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
		return random;
	}

	clone() {
		return new Vector(this.x, this.y);
	}
}
