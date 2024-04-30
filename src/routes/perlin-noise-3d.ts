export class PerlinNoise {
	generator: { random: () => number } = Math;
	grad3 = [
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
	permutation: number[] = [];

	constructor(generator?: { random: () => number }) {
		// The Perlin noise algorithm uses a permutation table to generate random gradient vectors.
		// The permutation table is an array of integers from 0 to 255, which are randomly shuffled
		// to create a pseudo-random sequence of gradient vectors.
		if (generator) {
			// If a random number generator is provided, use it to generate the permutation table
			// This allows for more control over the randomness of the noise function
			// For example, you could use a seeded random number generator to ensure
			// that the noise function produces the same output for a given seed
			// This can be useful for generating consistent noise patterns in procedural content generation
			// For example, generating terrain or textures in a game world
			this.generator = generator;
		}

		// The permutation table is initialized by creating an array of integers from 0 to 255
		// and shuffling them randomly using the random number generator
		// The permutation table is then duplicated to simplify the wrapping process
		const p = [];
		for (let i = 0; i < 256; i++) {
			p[i] = Math.floor(this.generator.random() * 256);
		}

		// To remove the need for index wrapping, double the permutation table length
		// and use bitmasks to wrap indices at 255
		//
		// "Removing the need for index wrapping" refers to the process of ensuring that
		// when accessing elements of an array, the index stays within the bounds of the array.
		// In the context of the Perlin noise algorithm, index wrapping typically involves
		// performing modulo arithmetic to ensure that the index remains within a certain range.
		//
		// In the provided code, the permutation array this.perm is initially constructed with
		// a length of 256. Later, this array is duplicated to simplify the wrapping process.
		// By doubling the length of the array, it eliminates the need to perform modulo
		// arithmetic when accessing elements.
		//
		// For example, instead of accessing this.perm[X % 256], where X could potentially be
		// any integer, the code can simply access this.perm[X] directly, knowing that X is
		// guaranteed to be within the range of the array due to its duplication.
		// By removing the need for index wrapping, the code becomes simpler and potentially
		// more efficient, as modulo operations can be relatively expensive compared to
		// simple array accesses.
		for (let i = 0; i < 512; i++) {
			this.permutation[i] = p[i & 255];
		}
	}

	// Get the "dot product" between a gradient vector `g` and a position `(x, y, z)` is
	// a way of measuring how much the vector `g` aligns with the direction defined by
	// the position `(x, y, z)`.
	//
	// Think of it like this: Imagine `g` as an arrow pointing in some direction in
	// 3D space, and `(x, y, z)` as a point in space. The dot product tells you how much
	// of that arrow is pointing in the same direction as the line from the origin
	// (0,0,0) to the point `(x, y, z)`.
	//
	// If the dot product is positive, it means that `g` points in generally the same
	// direction as the line from the origin to `(x, y, z)`. If it's negative, it means
	// `g` points in generally the opposite direction. If it's zero, it means `g` is
	// perpendicular (at a right angle) to the line from the origin to `(x, y, z)`.
	private dot(gradient: number[], x: number, y: number, z: number): number {
		return gradient[0] * x + gradient[1] * y + gradient[2] * z;
	}

	// The lerp function is used to linearly interpolate between two values `a` and `b`
	// based on a third value `t`. The value `t` is typically between 0 and 1, and
	// determines how much of `a` and `b` to blend together.
	// The formula for linear interpolation is `a + t * (b - a)`.
	// When `t` is 0, the result is `a`. When `t` is 1, the result is `b`.
	// For values of `t` between 0 and 1, the result is a blend between `a` and `b`.
	// Linear interpolation is used in Perlin noise to blend together the gradient values
	// based on the relative position within the unit cube.
	// This creates a smooth transition between the gradients and helps to reduce
	// discontinuities in the noise function.
	private lerp(a: number, b: number, t: number): number {
		return (1 - t) * a + t * b;
	}
	
	// The fade function is used to interpolate between the gradient values at the
	// corners of the unit cube.
	// The fade function is defined as 6t^5 - 15t^4 + 10t^3, where t is the input value.
	// This function is designed to smooth out the values of the noise function to create
	// a more natural appearance.
	private fade(t: number): number {
		return t * t * t * (t * (t * 6 - 15) + 10);
	}

	// The noise function generates Perlin noise for a given position `(x, y, z)`.
	// The algorithm works by dividing the space into a grid of unit cubes and assigning
	// a random gradient vector to each corner of the cubes.
	// The noise value at a given position is then calculated by interpolating between
	// the gradient vectors based on the relative position within the unit cube.
	// This interpolation creates a smooth transition between the gradient values and
	// produces a continuous noise function.
	// The noise function returns a value between -1 and 1, representing the noise intensity
	// at the given position.
	noise(x: number, y: number, z: number): number {
		// Find the unit cube that contains the point
		let X = Math.floor(x);
		let Y = Math.floor(y);
		let Z = Math.floor(z);

		// Find relative x, y, z of point in cube
		x -= X;
		y -= Y;
		z -= Z;

		// Wrap the integer indices at 255 to avoid overflow
		// This is a simple optimization to avoid the need for modulo operations
		// when accessing the permutation table
		// This optimization is possible because the permutation table is duplicated
		X &= 255;
		Y &= 255;
		Z &= 255;

		// Calculate a set of eight hashed gradient indices
		const gi000 = this.permutation[X + this.permutation[Y + this.permutation[Z]]] % 12;
		const gi001 = this.permutation[X + this.permutation[Y + this.permutation[Z + 1]]] % 12;
		const gi010 = this.permutation[X + this.permutation[Y + 1 + this.permutation[Z]]] % 12;
		const gi011 = this.permutation[X + this.permutation[Y + 1 + this.permutation[Z + 1]]] % 12;
		const gi100 = this.permutation[X + 1 + this.permutation[Y + this.permutation[Z]]] % 12;
		const gi101 = this.permutation[X + 1 + this.permutation[Y + this.permutation[Z + 1]]] % 12;
		const gi110 = this.permutation[X + 1 + this.permutation[Y + 1 + this.permutation[Z]]] % 12;
		const gi111 = this.permutation[X + 1 + this.permutation[Y + 1 + this.permutation[Z + 1]]] % 12;

		// Calculate the contribution from each corner
		// The contribution is the dot product between the gradient vector and the
		// position vector from the corner to the point
		// This is used to calculate the interpolation weights for each corner
		// The interpolation weights are based on the position within the unit cube
		// and are used to blend the gradient values together
		const n000 = this.dot(this.grad3[gi000], x, y, z);
		const n100 = this.dot(this.grad3[gi100], x - 1, y, z);
		const n010 = this.dot(this.grad3[gi010], x, y - 1, z);
		const n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
		const n001 = this.dot(this.grad3[gi001], x, y, z - 1);
		const n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
		const n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
		const n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);

		// Compute the fade curve value for each coordinate
		// The fade curve is used to smooth out the values of the noise function 
		// and create a more natural appearance
		const u = this.fade(x);
		const v = this.fade(y);
		const w = this.fade(z);

		// Interpolate along the x-axis of the contributions from each of the corners
		const nx00 = this.lerp(n000, n100, u);
		const nx01 = this.lerp(n001, n101, u);
		const nx10 = this.lerp(n010, n110, u);
		const nx11 = this.lerp(n011, n111, u);

		// Interpolate along the y-axis of the contributions from each of the corners
		// This step blends the values along the x-axis to produce a smooth transition
		// between the gradient vectors
		// The result is a set of four values representing the interpolated noise values
		// at the corners of the unit square
		const nxy0 = this.lerp(nx00, nx10, v);
		const nxy1 = this.lerp(nx01, nx11, v);

		// Interpolate along the z-axis of the contributions from each of the corners
		// This step blends the values along the y-axis to produce a smooth transition
		// between the gradient vectors
		// The result is a single value representing the final interpolated noise value
		// at the given position (x, y, z)
		const nxyz = this.lerp(nxy0, nxy1, w);

		return nxyz;
	}
}

// Usage
// Create a new Perlin noise generator
// const perlin = new PerlinNoise();
// Generate Perlin noise at a given position
// The noise function returns a value between -1 and 1
// representing the noise intensity at the given position
// The position is specified as (x, y, z) coordinates
// For example, to generate noise at position (1, 2, 3):
// const noiseValue = perlin.noise(1, 2, 3);
// How to use the noise value
// The noise value can be used to create various effects in procedural content generation
// For example, you could use the noise value to generate terrain heightmaps
// by scaling the noise value to a desired range and applying it to the terrain height
// You could also use the noise value to generate textures by mapping it to color values
// and applying it to the texture pixels
// The noise value can be used in combination with other noise functions to create
// more complex patterns and effects
// For example, you could combine multiple noise functions with different parameters
// to create a more detailed and varied terrain or texture
// If you want to move circles around the screen, you can use the noise value to determine the position of the circles
// For example, you could use the noise value to offset the x and y coordinates of the circles
// to create a smooth and natural movement pattern
// ex:
// const noiseValue = perlin.noise(x, y, z);
// circle.x = x + noiseValue;
// circle.y = y + noiseValue;
// The noise value can be used in a variety of creative ways to generate procedural content
