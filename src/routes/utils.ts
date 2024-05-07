export function random_between(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function hex_to_rgb(hex: string) {
	const r = parseInt(hex.substring(1, 3), 16);
	const g = parseInt(hex.substring(3, 5), 16);
	const b = parseInt(hex.substring(5, 7), 16);
	return { r, g, b };
}

export function random_color(palette: string[], alpha: number = 1) {
	const hex_color = palette[Math.floor(random_between(0, palette.length))];
	const { r, g, b } = hex_to_rgb(hex_color);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function deep_clone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}
