import { Preferences, GetResult, KeysResult } from '@capacitor/preferences';
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
	include: string[];
	exclude: string[];
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

const getItem = async (key: string) => {
	return Preferences.get({
		key,
	}).then((res: GetResult) => {
		if (res && res.value) return JSON.parse(res.value);
		else return res.value;
	});
};

const setItem = async (key: string, value: string | number | object): Promise<void> => {
	return Preferences.set({
		key,
		value: JSON.stringify(value),
	});
};

export const clear = async (): Promise<void> => {
	return Preferences.clear();
};

export const removeItem = async (key: string): Promise<void> => {
	return Preferences.remove({
		key,
	});
};

export const getKeys = async (): Promise<KeysResult> => {
	return Preferences.keys();
};

const updateStorage = async (store: Store, rules: PersistRules) => {
	const storeKey = store.$id;

	if (rules.include || rules.exclude) {
		const paths = rules.include
			? rules.include
			: Object.keys(store.$state).filter((key) => rules.exclude.includes(key) === false);

		const partialState = paths.reduce((acc, curr) => {
			acc[curr] = store.$state[curr];
			return acc;
		}, {} as PartialState);
		setItem(storeKey, partialState);
	} else {
		setItem(storeKey, store.$state);
	}
};

const restoreState = (
	store: Store,
	storeKey: string,
	rules: PersistRules,
	onRestored?: RestoredFunction
): Promise<void> =>
	new Promise((resolve) => {
		getItem(storeKey).then((result) => {
			const subscribe = () => {
				store.$subscribe(() => {
					updateStorage(store, rules);
				});
			};
			if (result) {
				store.$patch(result);
				updateStorage(store, rules).then(() => {
					subscribe();
					if (onRestored) onRestored(store);
					return resolve();
				});
			} else {
				subscribe();
				return resolve();
			}
		});
	});

export const piniaCapacitorPersist = async ({ options, store }: PiniaPluginContext): Promise<void> => {
	if (options.persist?.enabled !== true) return;

	const rules = {
		include: options.persist.include,
		exclude: options.persist.exclude,
	} as PersistRules;

	const storeKey = store.$id;
	store.restored = restoreState(store, storeKey, rules, options.persist.onRestored);
};
