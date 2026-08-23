<template>
	<main
		class="bg-linear-to-br from-slate-700 to-blue-400 min-h-screen text-white/70 flex flex-col justify-center items-center gap-4"
	>
		<div class="backdrop-blur px-4 py-2 bg-white/20 rounded-lg min-w-sm w-1/4">
			<h1 class="text-2xl text-center mb-4 uppercase font-black">Something Formy</h1>
			<InputText v-model="name" label="Name" id="name" />
			<InputText v-model="address" label="Address Line 1" id="address" />
			<InputText v-model="address_2" label="Address Line 2" id="address_2" />
			<InputText v-model="city" label="Town / City" id="city" />
			<InputText v-model="country" label="Country" id="country" />
		</div>
		<div class="backdrop-blur px-4 py-2 bg-white/20 rounded-lg min-w-sm w-1/4">
			<table class="w-full">
				<tr v-for="[key, value] in map">
					<td class="w-1/2 font-bold">{{ key }}</td>
					<td class="w-1/2">{{ value }}</td>
				</tr>
			</table>
			<hr class="opacity-50 my-4" />
			<div class="flex justify-between">
				<button class="bg-amber-700 text-white px-4 py-2 rounded-sm" @click="map.clear">Clear Map</button>
				<button class="bg-zinc-900 text-white px-4 py-2 rounded-sm" @click="onRandomiseMap">
					Randomise Map
				</button>
			</div>
		</div>
		<div class="backdrop-blur px-4 py-2 bg-white/20 rounded-lg min-w-sm w-1/4">
			{{ set }}
			<hr class="opacity-50 my-4" />
			<div class="flex justify-between">
				<button class="bg-amber-700 text-white px-4 py-2 rounded-sm" @click="set.clear">Clear Set</button>
				<button class="bg-zinc-900 text-white px-4 py-2 rounded-sm" @click="onRandomiseSet">
					Randomise Set
				</button>
			</div>
		</div>
	</main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import InputText from './components/InputText.vue';
import { useMainStore } from './stores/main';

const mainStore = useMainStore();
const { name, address, address_2, city, country, map, set } = storeToRefs(mainStore);

(async () => {
	await mainStore.restored;
	console.log(mainStore.restored);
	console.log(mainStore.name);
})();

const randomString = () => Math.random().toString(36).slice(2);
const onRandomiseMap = () => {
	const key = randomString();
	const value = randomString();
	map.value.set(key, value);
};
const onRandomiseSet = () => {
	const value = randomString();
	set.value.add(value);
};
</script>
