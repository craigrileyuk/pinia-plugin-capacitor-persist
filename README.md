# Pinia Persist Plugin for Capacitor

Pinia plugin that syncs with Capacitor's Preferences plugin's storage.

## Installation

```
npm i pinia-plugin-capacitor-persist
```

## Usage

First, install the plugin as part of your Pinia initialisation

```js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { piniaCapacitorPersist } from 'pinia-plugin-capacitor-persist';
import App from './App.vue';

const pinia = createPinia();
pinia.use(piniaCapacitorPersist);

createApp(App)
    .use(pinia)
    .mount('#app');
```

Then you can enable persist as part of your store declarations:

```js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
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
        // See below for additional options that go here
	},
});
```

## Persist options

| Option    | Type  | Example       | Description                    |
| --------- | ----- | ------------- | ------------------------------ |
| `include` | Array | `['address']` | Only persist these properties  |
| `exclude` | Array | `['name']`    | Don't persist these properties |

---

## Async Restoration

Because CapacitorJS uses async functions to read/write its storage, there may be times when you need to await your store being hydrated from local storage before doing an action.

Fortunately, there's a property, `restored`, that's added to *each* of your persist enabled stores that can be awaited.

```js
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "@/router/routes";
import { useUserStore } from "@/stores/user";
import { axiosInstance } from "@/plugins/axios";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async () => {
    const userStore = useUserStore();
    await userStore.restored;

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${userStore.token}`;
})

export default router;
```

