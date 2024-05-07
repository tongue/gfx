<script lang="ts">
	import { persisted_options } from './persisted-options.svelte';

	let { options = $bindable() }: { options: { [key: string]: any } } = $props();

	function load_options(event: Event) {
		if (event.target instanceof HTMLButtonElement) {
			const opts = persisted_options.options[event.target.value];
			if (typeof opts === 'object') {
				options = { ...options, ...opts };
			}
		}
	}

	function copy_saved_options(event: Event) {
		if (event.target instanceof HTMLButtonElement) {
			navigator.clipboard.writeText(JSON.stringify(persisted_options.options[event.target.value]));
		}
	}

	function delete_saved_options(event: Event) {
		if (event.target instanceof HTMLButtonElement) {
			persisted_options.remove(event.target.value);
		}
	}

	function add_new_options() {
		const string_options = prompt('Options in JSON format');
		if (!string_options) return;
		const name = prompt('Name of the options');
		if (!name) return;
		persisted_options.add(name, JSON.parse(string_options));
	}

	$effect(() => {
		persisted_options.update();
	});
</script>

<details>
	<summary>Saved options ({persisted_options.keys.length})</summary>
	<ul>
		{#each persisted_options.keys as key}
			<li>
				<h3>{key}</h3>
				<div>
					<button value={key} onclick={load_options}>Load</button>
					<button value={key} onclick={copy_saved_options}>Copy</button>
					<button value={key} onclick={delete_saved_options}>Delete</button>
				</div>
			</li>
		{/each}
	</ul>
	<button onclick={add_new_options}>+ Add new options</button>
</details>

<style>
	ul {
		margin-top: 1em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		list-style: none;
		padding: 0;
	}

	ul li {
		display: flex;
		justify-content: space-between;
	}

	ul li h3 {
		font-weight: normal;
		font-size: 1em;
		margin: 0.1em 0 0;
	}

	ul + button {
		margin-top: 2em;
	}
</style>
