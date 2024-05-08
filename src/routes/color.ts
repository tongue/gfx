type RGBA = [number, number, number, number];

export class Color {
	readonly original: RGBA;
	value: RGBA;

	constructor(hex_color: string, alpha: number) {
		const rgb = Color.hex_to_rgb(hex_color);
		this.original = [ ...rgb, alpha ];
		this.value = this.original;
	}

	reset() {
		this.value = this.original;
	}

	to_string(): string {
		return Color.rgba_to_string(this.value);
	}

	static hex_to_rgb(hex: string): [number, number, number] {
		const r = parseInt(hex.substring(1, 3), 16);
		const g = parseInt(hex.substring(3, 5), 16);
		const b = parseInt(hex.substring(5, 7), 16);
		return [ r, g, b ];
	}

	static rgba_to_string(rgba: [number, number, number, number]): string {
		return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
	}
}
