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
