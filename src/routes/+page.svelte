<script lang="ts">
	import {
		EntityCluster,
		MutatorType,
		options as cluster_options,
		type EntityClusterOptions
	} from './gravitation';
	import Option from './option.svelte';
	import PersistedOptions from './persist.svelte';
	import { persisted_options } from './persisted-options.svelte';
	import { options as igb_options } from './mutators/invisible-gravitational-body';
	import { options as g_options } from './mutators/gravity';
	import { deep_clone } from './utils';

	let options: { [key: string]: any } = $state(deep_clone(cluster_options.default));
	let dialog: HTMLDialogElement;

	const mutator_options: { [key: string]: any } = {
		[MutatorType.Gravity]: g_options,
		[MutatorType.InvisibleGravitationalBody]: igb_options
	};

	function cluster(canvas: HTMLCanvasElement, options: any) {
		const ctx = canvas.getContext('2d');
		let instance: EntityCluster | null = null;

		function update(options: EntityClusterOptions) {
			if (!ctx) return;
			if (instance) {
				instance.destroy();
			}
			canvas.width = window.innerWidth;
			canvas.height = (canvas.width * 3) / 4;
			instance = new EntityCluster(ctx, options);
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

	function add_mutator(event: Event) {
		event.preventDefault();
		const values = new FormData(event.target as HTMLFormElement);
		const type = values.get('type') as MutatorType;
		options.mutators.push({ type, options: deep_clone(mutator_options[type].default) });
	}

	function remove_mutator(idx: number) {
		return () => {
			if (Array.isArray(options.mutators)) {
				options.mutators.splice(idx, 1);
			}
		};
	}

	function save_options() {
		const name = prompt('Enter a name for this configuration');
		if (!name) return;
		persisted_options.add(name, options);
	}

	function show_options() {
		dialog.showModal();
	}

	function hide_options() {
		dialog.close();
	}
</script>

<svelte:head>
	<title>Cluster</title>
</svelte:head>
<canvas use:cluster={options}></canvas>

<dialog bind:this={dialog}>
	<menu>
		<header>
			<h2>Options</h2>
			<button onclick={hide_options}>Close</button>
		</header>

		<PersistedOptions bind:options />

		<details open>
			<summary>{cluster_options.config.title}</summary>
			<div>
				{#each cluster_options.config.configuration as { value, title, controls }}
					<Option {title} {controls} bind:value={options[value]} />
				{/each}

				<fieldset>
					<legend>Mutators</legend>
					{#each options.mutators as mutator, idx}
						{#if mutator.type in mutator_options}
							{@const mutator_cfg = mutator_options[mutator.type].config}
							<details>
								<summary>{mutator_cfg.title}</summary>
								<div>
									{#each mutator_cfg.configuration as { value, title, controls }}
										<Option {title} {controls} bind:value={options.mutators[idx].options[value]} />
									{/each}
								</div>
								<button onclick={remove_mutator(idx)}>Remove mutator</button>
							</details>
						{/if}
					{/each}
					<form onsubmit={add_mutator}>
						<select name="type">
							{#each Object.keys(mutator_options) as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
						<button>Add mutator</button>
					</form>
				</fieldset>
				<button onclick={save_options}>Save options</button>
			</div>
		</details>
	</menu>
</dialog>
<nav>
	<button onclick={show_options}>Show options</button>
</nav>

<style>
	:global(body) {
		margin: 0;
		background-color: #f8f8f8;
		font-family: system-ui, sans-serif;
	}

	nav {
		position: fixed;
		top: 1em;
		right: 1em;
	}

	canvas {
		background-color: #000;
	}

	dialog {
		width: 100%;
		border: 0;
		background-color: transparent;
	}
	dialog::backdrop {
		background: none;
	}

	menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		margin: 0;

		background-color: #f8f8f8;

		display: flex;
		flex-direction: column;
		gap: 1em;

		overflow: auto;
		width: 20vw;
		padding-right: 1em;
	}

	menu header {
		display: flex;
		justify-content: space-between;
	}

	button {
		margin: 1em 0;
	}

	details div {
		display: flex;
		flex-direction: column;
		gap: 1em;
		margin-top: 1em;
	}

	details :global(summary) {
		cursor: pointer;
	}
</style>
