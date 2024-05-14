import { MutatorType } from './gravitation';

function create_persisted_options() {
	const persisted_options: { [key: string]: unknown } = $state({});
	const persisted_keys = $derived(Object.keys(persisted_options));

	function update() {
		for (const key in localStorage) {
			const value = localStorage.getItem(key)!;
			try {
				const parsed_value = JSON.parse(value);
				if (parsed_value && typeof parsed_value === 'object' && parsed_value.amount !== undefined) {
					migrate_to_single_mutators(key, parsed_value);
					persisted_options[key] = parsed_value;
				}
			} catch (e) {
				continue;
			}
		}
	}

	function migrate_to_single_mutators(
		key: string,
		value: Record<string, unknown>
	): Record<string, unknown> {
		if (!value.single_mutators && value.mutators && Array.isArray(value.mutators)) {
			const new_mutators = [];
			const single_mutators = [];
			for (const mutator of value.mutators) {
				if (mutator.type !== MutatorType.InvisibleGravitationalBody) {
					single_mutators.push(mutator);
				} else {
					new_mutators.push(mutator);
				}
			}
			value.mutators = new_mutators;
			value.single_mutators = single_mutators;
			localStorage.setItem(key, JSON.stringify(value));
			console.log('Migrated `', key, '` to single mutators');
		}

		return value;
	}

	function remove(key: string) {
		delete persisted_options[key];
		localStorage.removeItem(key);
	}

	function add(key: string, options: unknown) {
		persisted_options[key] = options;
		localStorage.setItem(key, JSON.stringify(options));
	}

	return {
		get options() {
			return persisted_options;
		},
		get keys() {
			return persisted_keys;
		},
		update,
		remove,
		add
	};
}

export const persisted_options = create_persisted_options();
