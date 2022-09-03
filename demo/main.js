import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { piniaCapacitorPersist } from '../src';
import App from './App.vue';
import './index.css';

const pinia = createPinia();
pinia.use(piniaCapacitorPersist);
createApp(App).use(pinia).mount('#app');
