<template>
	<main
		class="bg-linear-to-br from-slate-700 to-blue-400 min-h-screen text-white/70 flex justify-center items-center"
	>
		<div class="backdrop-blur px-4 py-2 bg-white/20 rounded-lg min-w-sm w-1/4">
			<h1 class="text-2xl text-center mb-4 uppercase font-black">Something Formy</h1>
			<InputText v-model="name" label="Name" id="name" />
			<InputText v-model="address" label="Address Line 1" id="address" />
			<InputText v-model="address_2" label="Address Line 2" id="address_2" />
			<InputText v-model="city" label="Town / City" id="city" />
			<InputText v-model="country" label="Country" id="country" />
		</div>
	</main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMainStore } from './stores/main';
import InputText from './components/InputText.vue';

const mainStore = useMainStore();
const { name, address, address_2, city, country } = storeToRefs(mainStore);

(async () => {
	await mainStore.restored;
	console.log(mainStore.restored);
	console.log(mainStore.name);
})();

console.log(mainStore.name);
</script>
