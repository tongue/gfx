function create_persisted_options() {
	const persisted_options: { [key: string]: unknown } = $state({});
	const persisted_keys = $derived(Object.keys(persisted_options));

	function update() {
		for (const key in localStorage) {
			const value = localStorage.getItem(key)!;
			try {
				const parsed_value = JSON.parse(value);
				if (parsed_value && typeof parsed_value === 'object' && parsed_value.amount !== undefined) {
					persisted_options[key] = parsed_value;
				}
			} catch (e) {
				continue;
			}
		}
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
