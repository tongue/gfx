// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

const perlin_octaves = 4; // default to medium smooth
const perlin_amp_falloff = 0.5; // 50% reduction/octave

const scaled_cosine = (i: number) => 0.5 * (1.0 - Math.cos(i * Math.PI));

// Linear Congruential Generator
// Variant of a Lehman Generator
class LCG {
	// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
	// m is basically chosen to be large (as it is the max period)
	// and for its relationships to a and c
	private m = 4294967296;
	// a - 1 should be divisible by m's prime factors
	private a = 1664525;
	// c and m should be co-prime
	private c = 1013904223;
	private s = Math.random() * this.m >>> 0;
	private z = 0;

	set seed(val: number) {
		// pick a random seed if val is undefined or null
		// the >>> 0 casts the seed to an unsigned 32-bit integer
		this.z = this.s = (val == null ? Math.random() * this.m : val) >>> 0;
	}

	get seed() {
		return this.s;
	}

	random() {
		// define the recurrence relationship
		this.z = (this.a * this.z + this.c) % this.m;
		// return a float in [0, 1)
		// if z = m then z / m = 0 therefore (z % m) / m < 1 always
		return this.z / this.m;
	}
}

export class PerlinNoise {
	private perlin: number[];
	private lcg = new LCG();

	constructor(seed: number) {
		this.lcg.seed = seed;
		this.perlin = new Array(PERLIN_SIZE + 1);
		for (let i = 0; i < PERLIN_SIZE + 1; i++) {
			this.perlin[i] = this.lcg.random();
		}
	}

	noise(x: number, y = 0, z = 0) {
		if (x < 0) {
			x = -x;
		}
		if (y < 0) {
			y = -y;
		}
		if (z < 0) {
			z = -z;
		}

		let xi = Math.floor(x),
			yi = Math.floor(y),
			zi = Math.floor(z);
		let xf = x - xi;
		let yf = y - yi;
		let zf = z - zi;
		let rxf, ryf;

		let r = 0;
		let ampl = 0.5;

		let n1, n2, n3;

		for (let o = 0; o < perlin_octaves; o++) {
			let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

			rxf = scaled_cosine(xf);
			ryf = scaled_cosine(yf);

			n1 = this.perlin[of & PERLIN_SIZE];
			n1 += rxf * (this.perlin[(of + 1) & PERLIN_SIZE] - n1);
			n2 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
			n2 += rxf * (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
			n1 += ryf * (n2 - n1);

			of += PERLIN_ZWRAP;
			n2 = this.perlin[of & PERLIN_SIZE];
			n2 += rxf * (this.perlin[(of + 1) & PERLIN_SIZE] - n2);
			n3 = this.perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
			n3 += rxf * (this.perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
			n2 += ryf * (n3 - n2);

			n1 += scaled_cosine(zf) * (n2 - n1);

			r += n1 * ampl;
			ampl *= perlin_amp_falloff;
			xi <<= 1;
			xf *= 2;
			yi <<= 1;
			yf *= 2;
			zi <<= 1;
			zf *= 2;

			if (xf >= 1.0) {
				xi++;
				xf--;
			}
			if (yf >= 1.0) {
				yi++;
				yf--;
			}
			if (zf >= 1.0) {
				zi++;
				zf--;
			}
		}
		return r;
	}
}
