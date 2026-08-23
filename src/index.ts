import { KeysResult, Preferences } from '@capacitor/preferences';
import type { PiniaPluginContext } from 'pinia';

type Store = PiniaPluginContext['store'];
type PartialState = Partial<Store['$state']>;
type RestoredFunction = (store: Store) => void;

export interface PersistOptions {
	enabled: true;
	include?: string[];
	exclude?: string[];
	onRestored?: RestoredFunction;
}
export interface PersistRules {
	include?: string[];
	exclude?: string[];
}

declare module 'pinia' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export interface DefineStoreOptionsBase<S, Store> {
		persist?: PersistOptions;
	}
	export interface PiniaCustomProperties {
		restored: Promise<void>;
	}
}
const replacer = (value: Record<string, unknown>) => {
	return Object.fromEntries(
		Object.entries(value).map(([key, value]) => {
			if (value instanceof Map) {
				return [key, { __type: 'Map', value: [...value.entries()] }];
			}
			if (value instanceof Set) {
				return [key, { __type: 'Set', value: [...value.values()] }];
			}
			return [key, value];
		})
	);
};
const reviver = (value: Record<string, unknown>): PartialState => {
	return Object.fromEntries(
		Object.entries(value).map(([key, value]) => {
			if (value && typeof value === 'object' && '__type' in value) {
				const typed = value as { __type: string; value: Iterable<unknown> };
				if (typed.__type === 'Map') {
					return [key, new Map(typed.value as [unknown, unknown][])];
				}
				if (typed.__type === 'Set') {
					return [key, new Set(typed.value)];
				}
			}
			return [key, value];
		})
	) as PartialState;
};
const getItem = async (key: string) => {
	const { value } = await Preferences.get({ key });
	return value ? reviver(JSON.parse(value)) : null;
};
const setItem = async (key: string, value: Record<string, unknown>): Promise<void> => {
	return Preferences.set({ key, value: JSON.stringify(replacer(value)) });
};
export const clear = async (): Promise<void> => {
	return Preferences.clear();
};
export const removeItem = async (key: string): Promise<void> => {
	return Preferences.remove({ key });
};
export const getKeys = async (): Promise<KeysResult> => {
	return Preferences.keys();
};
export const updateStorage = async (store: Store, rules: PersistRules) => {
	const storeKey = store.$id;
	if (rules.include || rules.exclude) {
		const exclude = rules.exclude ?? [];
		const paths =
			rules.include && rules.include.length
				? rules.include
				: Object.keys(store.$state).filter((key) => exclude.includes(key) === false);
		const partialState = paths.reduce((acc, curr) => {
			acc[curr] = store.$state[curr];
			return acc;
		}, {} as PartialState);
		await setItem(storeKey, partialState);
	} else {
		await setItem(storeKey, store.$state);
	}
};
const restoreState = async (store: Store, rules: PersistRules, onRestored?: RestoredFunction): Promise<void> => {
	const state = await getItem(store.$id);
	if (state) {
		store.$patch(state);
	}
	store.$subscribe(() => {
		void updateStorage(store, rules);
	});
	await onRestored?.(store);
};
export const piniaCapacitorPersist = ({ options, store }: PiniaPluginContext): void => {
	if (options.persist?.enabled !== true) return;
	const rules: PersistRules = { include: options.persist.include, exclude: options.persist.exclude };
	store.restored = restoreState(store, rules, options.persist.onRestored);
};
