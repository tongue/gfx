<script lang="ts">
	import { onMount } from 'svelte';
	import { MultiBodyGravitation, type MultiBodyGravitationOptions } from './gravitation';

	let saved_options: [string, MultiBodyGravitationOptions][] = [];

	let amount: MultiBodyGravitationOptions['amount'] = 20;
	let velocity_magnitude: MultiBodyGravitationOptions['velocity_magnitude'] = [0.1, 0.5];
	let position_magnitude: MultiBodyGravitationOptions['position_magnitude'] = [100, 150];
	let mass_range: MultiBodyGravitationOptions['mass_range'] = [100, 300];
	let center_mass: MultiBodyGravitationOptions['center_mass'] = 500;
	let distance_range: MultiBodyGravitationOptions['distance_range'] = [10_000, 20_000];
	let gravity: MultiBodyGravitationOptions['gravity'] = 0.05;
	let palette: MultiBodyGravitationOptions['palette'] = ['#ffffff'];
	let alpha: MultiBodyGravitationOptions['alpha'] = 0.4;
	let trail: MultiBodyGravitationOptions['trail'] = 1;

	function gravitation(canvas: HTMLCanvasElement, options: MultiBodyGravitationOptions) {
		const ctx = canvas.getContext('2d');
		let instance: MultiBodyGravitation | null = null;

		function update(options: MultiBodyGravitationOptions) {
			if (!ctx) return;
			if (instance) {
				instance.destroy();
			}
			canvas.width = window.innerWidth * 0.6;
			canvas.height = (canvas.width * 3) / 4;
			instance = new MultiBodyGravitation(ctx, options);
		}

		update(options);

		return {
			update,
			destroy() {
				if (instance) {
					instance.destroy();
				}
			}
		};
	}

	function save_options() {
		const name = prompt('Name of the options');
		if (!name) return;
		const options = {
			amount,
			velocity_magnitude,
			position_magnitude,
			mass_range,
			center_mass,
			distance_range,
			gravity,
			palette,
			alpha,
			trail
		};
		localStorage.setItem(name, JSON.stringify(options));
		get_saved_options();
	}

	function get_saved_options() {
		const keys = Object.entries(localStorage);
		const options = keys
			.filter(([_, value]) => {
				let parsed;
				try {
					parsed = JSON.parse(value);
				} catch (e) {
					return false;
				}
				return parsed.amount !== undefined;
			})
			.map(([key, value]) => [key, JSON.parse(value)] as [string, MultiBodyGravitationOptions]);
		saved_options = options;
	}

	function load_options(options: MultiBodyGravitationOptions) {
		return () => {
			amount = options.amount;
			velocity_magnitude[0] = options.velocity_magnitude[0];
			velocity_magnitude[1] = options.velocity_magnitude[1];
			position_magnitude[0] = options.position_magnitude[0];
			position_magnitude[1] = options.position_magnitude[1];
			mass_range[0] = options.mass_range[0];
			mass_range[1] = options.mass_range[1];
			center_mass = options.center_mass;
			distance_range[0] = options.distance_range[0];
			distance_range[1] = options.distance_range[1];
			gravity = options.gravity;
			palette = options.palette || ['#ffffff'];
			alpha = options.alpha || 0.4;
			trail = options.trail || 1;
		};
	}

	function copy_saved_options(options: MultiBodyGravitationOptions) {
		return () => {
			navigator.clipboard.writeText(JSON.stringify(options));
		};
	}

	function delete_saved_options(key: string) {
		return () => {
			localStorage.removeItem(key);
		};
	}

	function add_new_options() {
		const string_options = prompt('Options in JSON format');
		if (!string_options) return;
		const name = prompt('Name of the options');
		if (!name) return;
		localStorage.setItem(name, string_options);
		get_saved_options();
	}

	function add_color() {
		palette = [...palette, '#ffffff'];
	}

	function remove_color(color: string) {
		return () => {
			palette = palette.filter((c) => c !== color);
		};
	}

	onMount(() => {
		get_saved_options();
	});
</script>

<svelte:head>
	<title>Multi Body Gravitation</title>
</svelte:head>
<canvas
	use:gravitation={{
		amount,
		velocity_magnitude,
		position_magnitude,
		mass_range,
		center_mass,
		distance_range,
		gravity,
		palette,
		alpha,
		trail
	}}
></canvas>

<menu>
	<h2>Options</h2>
	<details>
		<summary>Saved options ({saved_options.length})</summary>
		<ul>
			{#each saved_options as [key, options]}
				<li>
					<h3>{key}</h3>
					<button on:click={load_options(options)}>Load</button>
					<button on:click={copy_saved_options(options)}>Copy</button>
					<button on:click={delete_saved_options(key)}>Delete</button>
				</li>
			{/each}
		</ul>

		<button on:click={add_new_options}>+ Add new options</button>
	</details>

	<fieldset>
		<legend>Amount</legend>
		<input type="range" bind:value={amount} min="1" max="500" />
		<input type="text" bind:value={amount} />
	</fieldset>
	<fieldset>
		<legend>Velocity magnitude</legend>
		<input type="range" bind:value={velocity_magnitude[0]} min="0" max="2" step="0.001" />
		<input type="text" bind:value={velocity_magnitude[0]} />
		<input type="range" bind:value={velocity_magnitude[1]} min="0" max="2" step="0.001" />
		<input type="text" bind:value={velocity_magnitude[1]} />
	</fieldset>
	<fieldset>
		<legend>Position magnitude</legend>
		<input type="range" bind:value={position_magnitude[0]} min="0" max="10000" />
		<input type="text" bind:value={position_magnitude[0]} />
		<input type="range" bind:value={position_magnitude[1]} min="0" max="10000" />
		<input type="text" bind:value={position_magnitude[1]} />
	</fieldset>
	<fieldset>
		<legend>Mass range</legend>
		<input type="range" bind:value={mass_range[0]} min="1" max="10000" />
		<input type="text" bind:value={mass_range[0]} />
		<input type="range" bind:value={mass_range[1]} min="1" max="10000" />
		<input type="text" bind:value={mass_range[1]} />
	</fieldset>
	<fieldset>
		<legend>Center mass</legend>
		<input type="range" bind:value={center_mass} min="1" max="10000" />
		<input type="text" bind:value={center_mass} />
	</fieldset>
	<fieldset>
		<legend>Distance range</legend>
		<input type="range" bind:value={distance_range[0]} min="1" max="100000" />
		<input type="text" bind:value={distance_range[0]} />
		<input type="range" bind:value={distance_range[1]} min="1" max="100000" />
		<input type="text" bind:value={distance_range[1]} />
	</fieldset>
	<fieldset>
		<legend>Gravity</legend>
		<input type="range" bind:value={gravity} min="0" max="10" step="0.001" />
		<input type="text" bind:value={gravity} />
	</fieldset>
	<fieldset>
		<legend>Palette</legend>
		<ol>
			{#each palette as color, idx}
				<li>
					<input type="color" bind:value={color} />
					{#if idx > 0}
						<button on:click={remove_color(color)}>X</button>
					{/if}
				</li>
			{/each}
		</ol>
		<button on:click={add_color}>Add color</button>
		<label for="alpha">Alpha</label>
		<input id="alpha" type="range" bind:value={alpha} min="0" max="1" step="0.01" />
		<input type="text" bind:value={alpha} />
	</fieldset>
	<fieldset>
		<legend>Trail (1 is no trail, 0 is infinite trail)</legend>
		<input type="range" bind:value={trail} min="0" max="1" step="0.01" />
		<input type="text" bind:value={trail} />
	</fieldset>
	<button on:click={save_options}>Save options</button>
</menu>

<style>
	:global(body) {
		background-color: #f8f8f8;
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}

	menu {
		display: flex;
		flex-direction: column;
		gap: 1em;

		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: auto;
		width: 20vw;
		padding-right: 1em;
	}

	ul,
	ol {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		list-style: none;
		padding: 0;
	}

	ul li h3 {
		font-size: 1em;
		margin: 0.1em 0 0;
	}
	ol {
		flex-direction: row;
		flex-wrap: wrap;
	}
	ol + button {
		margin-top: 2em;
	}
	button + label {
		margin-top: 1em;
	}

	fieldset {
		display: flex;
		flex-direction: column;
	}

	details summary {
		cursor: pointer;
	}

	details ul + button {
		margin-top: 3em;
	}

	h2 {
		margin: 0 0 0.1em;
	}
</style>
