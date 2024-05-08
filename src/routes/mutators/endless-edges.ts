import type { Mutator, Entity } from '../types';

export type EndlessEdgeOptions = {
	active?: boolean;
};

export class EndlessEdge implements Mutator {
	private active: boolean;

	constructor(options: EndlessEdgeOptions, private ctx: CanvasRenderingContext2D  ) {
	this.active = options.active ?? true;
	}
	update(entity: Entity) {
		if (this.active) {
		const radius = Math.sqrt(entity.mass);
		const x_from_center = entity.position.x + this.ctx.canvas.width / 2;
		const y_from_center = entity.position.y + this.ctx.canvas.height / 2;

		if (entity.position.x - radius > this.ctx.canvas.width / 2) {
    entity.position.x = -this.ctx.canvas.width / 2;
}
if (entity.position.x + radius < -this.ctx.canvas.width / 2) {
    entity.position.x = this.ctx.canvas.width / 2;
}
if (entity.position.y - radius > this.ctx.canvas.height / 2) {
    entity.position.y = -this.ctx.canvas.height / 2;
}
if (entity.position.y + radius < -this.ctx.canvas.height / 2) {
    entity.position.y = this.ctx.canvas.height / 2;
}
	}
	
	}

	debug() {
		// noop
	}

	destroy() {
		// noop
	}

}

export const options = {
	default: {
		active: true
	},
	config: {
		title: 'Endless Edge',
		configuration: [
			{
				value: 'active',
				title: 'Active',
				type: 'checkbox',
			}
		]
	},
	
};
