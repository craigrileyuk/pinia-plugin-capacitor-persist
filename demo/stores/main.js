import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
	state() {
		return {
			name: '',
			address: '',
			address_2: '',
			city: '',
			country: '',
		};
	},
	persist: {
		enabled: true,
	},
});
