<script lang="ts">
	import { MultiBodyGravitation, type MultiBodyGravitationOptions } from './gravitation';

	let saved_options: { [key: string]: MultiBodyGravitationOptions } = $state({});
	let saved_keys = $derived(Object.keys(saved_options));

	let options: MultiBodyGravitationOptions = $state({
		amount: 20,
		velocity_magnitude: [0.1, 0.5],
		position_magnitude: [100, 150],
		mass_range: [100, 300],
		center_mass: 500,
		distance_range: [10_000, 20_000],
		gravity: 0.05,
		palette: ['#ffffff'],
		alpha: 0.4,
		trail: 1
	});

	function gravitation(canvas: HTMLCanvasElement, options: MultiBodyGravitationOptions) {
		const ctx = canvas.getContext('2d');
		let instance: MultiBodyGravitation | null = null;

		function update(options: MultiBodyGravitationOptions) {
			if (!ctx) return;
			if (instance) {
				instance.destroy();
			}
			canvas.width = window.innerWidth * 0.75;
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
		localStorage.setItem(name, JSON.stringify(options));
		get_saved_options();
	}

	function get_saved_options() {
		for (const key in localStorage) {
			const value = localStorage.getItem(key)!;
			try {
				const parsed_value = JSON.parse(value);
				if (parsed_value && typeof parsed_value === 'object' && parsed_value.amount !== undefined) {
					saved_options[key] = parsed_value;
				}
			} catch (e) {
				continue;
			}
		}
	}

	function load_options(event: Event) {
		if (event.target instanceof HTMLButtonElement) {
			const key = event.target.value;
			const persisted_options = saved_options[key];
			options = { ...options, ...persisted_options };
		}
	}

	function copy_saved_options(event: Event) {
		if (event.target instanceof HTMLButtonElement) {
			const key = event.target.value;
			const persisted_options = saved_options[key];
			navigator.clipboard.writeText(JSON.stringify(persisted_options));
		}
	}

	function delete_saved_options(event: Event) {
		if (event.target instanceof HTMLButtonElement) {
			const key = event.target.value;
			localStorage.removeItem(key);
			get_saved_options();
		}
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
		options.palette = [...options.palette, '#ffffff'];
	}

	function remove_color(color: string) {
		return () => {
			options.palette = options.palette.filter((c) => c !== color);
		};
	}

	$effect(() => {
		get_saved_options();
	});
</script>

<svelte:head>
	<title>Multi Body Gravitation</title>
</svelte:head>
<canvas use:gravitation={options}></canvas>

<menu>
	<h2>Options</h2>
	<details>
		<summary>Saved options ({saved_keys.length})</summary>
		<ul>
			{#each saved_keys as key}
				<li>
					<h3>{key}</h3>
					<button value={key} onclick={load_options}>Load</button>
					<button value={key} onclick={copy_saved_options}>Copy</button>
					<button value={key} onclick={delete_saved_options}>Delete</button>
				</li>
			{/each}
		</ul>

		<button onclick={add_new_options}>+ Add new options</button>
	</details>

	<fieldset>
		<legend>Amount</legend>
		<input type="range" bind:value={options.amount} min="1" max="500" />
		<input type="text" bind:value={options.amount} />
	</fieldset>
	<fieldset>
		<legend>Velocity magnitude</legend>
		<input type="range" bind:value={options.velocity_magnitude[0]} min="0" max="2" step="0.001" />
		<input type="text" bind:value={options.velocity_magnitude[0]} />
		<input type="range" bind:value={options.velocity_magnitude[1]} min="0" max="2" step="0.001" />
		<input type="text" bind:value={options.velocity_magnitude[1]} />
	</fieldset>
	<fieldset>
		<legend>Position magnitude</legend>
		<input type="range" bind:value={options.position_magnitude[0]} min="0" max="10000" />
		<input type="text" bind:value={options.position_magnitude[0]} />
		<input type="range" bind:value={options.position_magnitude[1]} min="0" max="10000" />
		<input type="text" bind:value={options.position_magnitude[1]} />
	</fieldset>
	<fieldset>
		<legend>Mass range</legend>
		<input type="range" bind:value={options.mass_range[0]} min="1" max="10000" />
		<input type="text" bind:value={options.mass_range[0]} />
		<input type="range" bind:value={options.mass_range[1]} min="1" max="10000" />
		<input type="text" bind:value={options.mass_range[1]} />
	</fieldset>
	<fieldset>
		<legend>Center mass</legend>
		<input type="range" bind:value={options.center_mass} min="1" max="10000" />
		<input type="text" bind:value={options.center_mass} />
	</fieldset>
	<fieldset>
		<legend>Distance range</legend>
		<input type="range" bind:value={options.distance_range[0]} min="1" max="100000" />
		<input type="text" bind:value={options.distance_range[0]} />
		<input type="range" bind:value={options.distance_range[1]} min="1" max="100000" />
		<input type="text" bind:value={options.distance_range[1]} />
	</fieldset>
	<fieldset>
		<legend>Gravity</legend>
		<input type="range" bind:value={options.gravity} min="0" max="10" step="0.001" />
		<input type="text" bind:value={options.gravity} />
	</fieldset>
	<fieldset>
		<legend>Palette</legend>
		<ol>
			{#each options.palette as color, idx}
				<li>
					<input type="color" bind:value={options.palette[idx]} />
					{#if idx > 0}
						<button onclick={remove_color(color)}>X</button>
					{/if}
				</li>
			{/each}
		</ol>
		<button onclick={add_color}>Add color</button>
		<label for="alpha">Alpha</label>
		<input id="alpha" type="range" bind:value={options.alpha} min="0" max="1" step="0.01" />
		<input type="text" bind:value={options.alpha} />
	</fieldset>
	<fieldset>
		<legend>Trail (1 is no trail, 0 is infinite trail)</legend>
		<input type="range" bind:value={options.trail} min="0" max="1" step="0.01" />
		<input type="text" bind:value={options.trail} />
	</fieldset>
	<button onclick={save_options}>Save options</button>
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
