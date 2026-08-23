import type { PiniaPluginContext } from 'pinia';
import { createPinia, defineStore, setActivePinia } from 'pinia';
import { beforeEach, describe, test, vi } from 'vitest';
import { ref } from 'vue';
import { type PersistRules, updateStorage } from '../src/index';
type Store = PiniaPluginContext['store'];

vi.mock('@capacitor/preferences', () => ({
	Preferences: {
		set: vi.fn().mockResolvedValue({}),
		get: vi.fn(),
		remove: vi.fn(),
		clear: vi.fn(),
		keys: vi.fn(),
	},
}));

describe('updateStorage()', () => {
	let store: Store;

	beforeEach(() => {
		setActivePinia(createPinia());
		const useStoreDefinition = defineStore('test', () => {
			const foo = ref('bar');
			return {
				foo,
			};
		});
		store = useStoreDefinition();
	});

	test('update storage works', () => {
		updateStorage(store, { exclude: [], include: [] } as PersistRules);
	});
});
