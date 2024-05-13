import type { Entity } from './types';
import { Vector } from './vector';

export class BoundingBox {
	constructor(
		public center: Vector,
		public width: number,
		public height: number
	) {}

	contains(point: Vector): boolean {
		return (
			point.x >= this.center.x - this.width / 2 &&
			point.x <= this.center.x + this.width / 2 &&
			point.y >= this.center.y - this.height / 2 &&
			point.y <= this.center.y + this.height / 2
		);
	}

	intersects(other_box: BoundingBox): boolean {
		return !(
			other_box.center.x - other_box.width / 2 > this.center.x + this.width / 2 ||
			other_box.center.x + other_box.width / 2 < this.center.x - this.width / 2 ||
			other_box.center.y - other_box.height / 2 > this.center.y + this.height / 2 ||
			other_box.center.y + other_box.height / 2 < this.center.y - this.height / 2
		);
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.strokeRect(
			this.center.x - this.width / 2 + ctx.canvas.width / 2,
			this.center.y - this.height / 2 + ctx.canvas.height / 2,
			this.width,
			this.height
		);
	}
}

function is_quad_tree_touple(obj: unknown[]): obj is [QuadTree, QuadTree, QuadTree, QuadTree] {
	return obj[0] instanceof QuadTree;
}

export class QuadTree {
	elements: Entity[] | [QuadTree, QuadTree, QuadTree, QuadTree] = [];

	constructor(
		public boundary: BoundingBox,
		public max_entities: number = 4
	) {}

	insert(entity: Entity): boolean {
		if (!this.boundary.contains(entity.position)) {
			return false;
		}

		if (this.elements.length < this.max_entities && !is_quad_tree_touple(this.elements)) {
			this.elements.push(entity);
			return true;
		}

		if (!is_quad_tree_touple(this.elements)) {
			this.subdivide();
		}

		if (is_quad_tree_touple(this.elements)) {
			if (this.elements[0].insert(entity)) return true;
			if (this.elements[1].insert(entity)) return true;
			if (this.elements[2].insert(entity)) return true;
			if (this.elements[3].insert(entity)) return true;
		}

		return false;
	}

	subdivide(): void {
		const half_width = this.boundary.width / 2;
		const half_height = this.boundary.height / 2;
		const nw = new BoundingBox(
			new Vector(this.boundary.center.x - half_width / 2, this.boundary.center.y - half_height / 2),
			half_width,
			half_height
		);
		const ne = new BoundingBox(
			new Vector(this.boundary.center.x + half_width / 2, this.boundary.center.y - half_height / 2),
			half_width,
			half_height
		);
		const sw = new BoundingBox(
			new Vector(this.boundary.center.x - half_width / 2, this.boundary.center.y + half_height / 2),
			half_width,
			half_height
		);
		const se = new BoundingBox(
			new Vector(this.boundary.center.x + half_width / 2, this.boundary.center.y + half_height / 2),
			half_width,
			half_height
		);

		const elements = this.elements as Entity[];
		this.elements = [
			new QuadTree(nw, this.max_entities),
			new QuadTree(ne, this.max_entities),
			new QuadTree(sw, this.max_entities),
			new QuadTree(se, this.max_entities)
		];

		for (let i = 0; i < elements.length; i++) {
			this.insert(elements[i]);
		}
	}

	get subdivided(): boolean {
		return this.elements[0] instanceof QuadTree;
	}

	query(range: BoundingBox): Entity[] {
		if (!this.boundary.intersects(range)) {
			return [];
		}

		if (is_quad_tree_touple(this.elements)) {
			const result = [
				...this.elements[0].query(range),
				...this.elements[1].query(range),
				...this.elements[2].query(range),
				...this.elements[3].query(range)
			];
			return result;
		} else {
			return this.elements;
		}
	}

	draw(ctx: CanvasRenderingContext2D): void {
		this.boundary.draw(ctx);
		if (is_quad_tree_touple(this.elements)) {
			for (let i = 0; i < this.elements.length; i++) {
				this.elements[i].draw(ctx);
			}
		}
	}
}
