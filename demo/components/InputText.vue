<template>
	<div class="pb-3">
		<div class="flex flex-col group relative">
			<input
				v-model="internalProxy"
				:id="props.id"
				placeholder=""
				class="w-full px-3 pt-4 pb-1 border outline-none focus-within:outline-none border-slate-400 rounded peer duration-300 bg-slate-900 transition-all ring-2 ring-transparent focus:ring-slate-400"
				type="text"
			/>
			<label
				:for="props.id"
				class="opacity-50 absolute top-1/2 transition-transform origin-left left-2 -translate-y-full scale-75 group-focus-within:peer-placeholder-shown:-translate-y-full group-focus-within:peer-placeholder-shown:scale-75 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100"
				>{{ props.label }}</label
			>
		</div>
		<div class="h-4 px-1 text-xs text-red-400">{{ props.error }}</div>
	</div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	error: {
		type: String,
		default: '',
	},
	label: {
		type: String,
		default: '',
	},
	modelValue: {
		type: String,
		default: '',
	},
});

let internalValue = $ref('');

const internalProxy = $computed({
	get() {
		return props.modelValue || internalValue;
	},
	set(v) {
		emit('update:modelValue', v);
		internalValue = v;
	},
});
</script>
