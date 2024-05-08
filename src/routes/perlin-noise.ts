function create_random_generator(seed: number) {
	const a = 1664525;
	const c = 1013904223;
	const m = Math.pow(2, 32);
	let z = seed;
	return () => {
		z = (a * z + c) % m;
		return z / m;
	};
}

export class PerlinNoise {
	private permutations: number[];
	private gradient: number[][] = [
		[1, 1, 0],
		[-1, 1, 0],
		[1, -1, 0],
		[-1, -1, 0],
		[1, 0, 1],
		[-1, 0, 1],
		[1, 0, -1],
		[-1, 0, -1],
		[0, 1, 1],
		[0, -1, 1],
		[0, 1, -1],
		[0, -1, -1]
	];

	constructor(seed?: number) {
		this.permutations = [];
		const rng = create_random_generator(seed ?? 0);
		for (let i = 0; i < 256; i++) {
			this.permutations[i] = i;
		}
		// Shuffle the permutation array based on the seed
		for (let i = 0; i < 256; i++) {
			const j = Math.floor(rng() * 256);
			const temp = this.permutations[i];
			this.permutations[i] = this.permutations[j];
			this.permutations[j] = temp;
		}
		// Duplicate the permutation array to simplify wrapping
		this.permutations = this.permutations.concat(this.permutations);
	}

	private dot(g: number[], x: number, y: number): number {
		return g[0] * x + g[1] * y;
	}

	private fade(t: number): number {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	private lerp(a: number, b: number, t: number): number {
		return (1 - t) * a + t * b;
	}

	noise(x: number, y: number): number {
		const X = Math.floor(x) & 255;
		const Y = Math.floor(y) & 255;
		x -= Math.floor(x);
		y -= Math.floor(y);
		const u = this.fade(x);
		const v = this.fade(y);

		const A = this.permutations[X] + Y;
		const B = this.permutations[X + 1] + Y;

		const n00 = this.dot(this.gradient[this.permutations[A] % 12], x, y);
		const n01 = this.dot(this.gradient[this.permutations[B] % 12], x - 1, y);
		const n10 = this.dot(this.gradient[this.permutations[A + 1] % 12], x, y - 1);
		const n11 = this.dot(this.gradient[this.permutations[B + 1] % 12], x - 1, y - 1);

		const n0 = this.lerp(n00, n01, u);
		const n1 = this.lerp(n10, n11, u);

		return this.lerp(n0, n1, v);
	}
}
