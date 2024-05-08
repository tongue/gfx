export function random_between(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function random_item<T>(items: T[]): T {
	return items[Math.floor(random_between(0, items.length))];
}

export function deep_clone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export function map_values(
	value: number,
	from_min: number,
	from_max: number,
	to_min: number,
	to_max: number
) {
	return ((value - from_min) * (to_max - to_min)) / (from_max - from_min) + to_min;
}
