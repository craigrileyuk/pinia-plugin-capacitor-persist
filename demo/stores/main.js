import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useMainStore = defineStore(
	'main',
	() => {
		const name = ref('');
		const address = ref('');
		const address_2 = ref('');
		const city = ref('');
		const country = ref('');
		const map = reactive(new Map());
		const set = ref(new Set());

		return {
			name,
			address,
			address_2,
			city,
			country,
			map,
			set,
		};
	},
	{
		persist: {
			enabled: true,
			onRestored: (store) => {
				console.log(`"${store.$id}" was successfully restored`);
			},
			/* 		serialiser: {
			serialise: (value) => {
				console.log('Running serialise function');
				return JSON.stringify(value);
			},
		}, */
		},
	}
);
