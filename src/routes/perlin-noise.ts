class Perlin {
	private 
}

class Particle {
	x_noise = new PerlinNoise();
	y_noise = new PerlinNoise();
	diameter: number;

	constructor(diameter: number) {
		this.diameter = diameter;
	}

	draw() {
	}
}
	const num_frames = 1024;
	const particles: Particle[] = new Array(100);

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

	function normalize(
		val: number,
		from_min: number,
		from_max: number,
		to_min: number,
		to_max: number
	): number {
		return ((val - from_min) / (from_max - from_min)) * (to_max - to_min) + to_min;
	}

	class PerlinNoise {
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

	class NoiseLoop {
		diameter: number;
		min: number;
		max: number;
		cx: number;
		cy: number;
		perlin: PerlinNoise;

		constructor(seed: number, diameter: number, min: number, max: number) {
			this.diameter = diameter;
			this.min = min;
			this.max = max;
			this.cx = Math.random() * diameter;
			this.cy = Math.random() * diameter;
			this.perlin = new PerlinNoise(seed);
		}

		value(val: number): number {
			const x_off = normalize(Math.cos(val), -1, 1, this.cx, this.cx + this.diameter);
			const y_off = normalize(Math.sin(val), -1, 1, this.cy, this.cy + this.diameter);
			const radius = this.perlin.noise(x_off, y_off);
			return normalize(radius, 0, 1, this.min, this.max);
		}
	}

	class Particle {
		x_noise: NoiseLoop;
		y_noise: NoiseLoop;
		diameter_noise: NoiseLoop;

		constructor(seed: number, min: number, max: number) {
			this.x_noise = new NoiseLoop(seed, 0.5, min, max);
			this.y_noise = new NoiseLoop(seed + 1, 0.5, min, max);
			this.diameter_noise = new NoiseLoop(seed + 2, 7, min, max);
		}

		render(ctx: CanvasRenderingContext2D, t: number) {
			const x = this.x_noise.value(t);
			const y = this.y_noise.value(t);
			const radius = Math.min(Math.max(0, normalize(this.diameter_noise.value(t), -1, 1, 0, 20)), 20);
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		}
	}

	function test(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d')!;
		let prev_time = new Date().getTime();

		function setup() {
			for (let i = 0; i < particles.length; i++) {
				particles[i] = new Particle(i, 0, 600);
			}
		}

		function draw(current_time: number) {
			const delta_time = (current_time - prev_time) / 1000;
			prev_time = current_time;

			ctx.clearRect(0, 0, node.width, node.height);

			for (let i = 0; i < particles.length; i++) {
				// particles[i].render(ctx, delta_time);
				particles[i].render(ctx, current_time / 1000);
			}

			requestAnimationFrame(draw);
		}

		setup();
		requestAnimationFrame(draw);
	}
