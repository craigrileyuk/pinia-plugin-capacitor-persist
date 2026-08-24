import { useMainStore } from '../stores/main';

export const useStoreValue = async () => {
	const store = useMainStore();
	await store.restored;

	return store.map;
};
