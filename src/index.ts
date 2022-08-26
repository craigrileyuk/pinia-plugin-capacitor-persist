import { Preferences, GetResult, KeysResult } from '@capacitor/preferences';
import { PiniaPluginContext } from 'pinia';

export interface PersistOptions {
	enabled: true;
	include?: string[];
	exclude?: string[];
}

export interface PersistRules {
	include: string[];
	exclude: string[];
}

type Store = PiniaPluginContext['store'];
type PartialState = Partial<Store['$state']>;

declare module 'pinia' {
	export interface DefineStoreOptionsBase<S, Store> {
		persist?: PersistOptions;
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

export default async ({ options, store /*, pinia, app */ }: PiniaPluginContext): Promise<void> => {
	if (options.persist?.enabled !== true) return;

	const rules = {
		include: options.persist.include,
		exclude: options.persist.exclude,
	} as PersistRules;

	const storeKey = store.$id;
	const storageResult = await getItem(storeKey);

	if (storageResult) {
		store.$patch(storageResult);
		updateStorage(store, rules);
	}

	store.$subscribe(() => {
		updateStorage(store, rules);
	});
};
