import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';

// Import css
import './assets/main.css'

// Import router
import router from './router'


const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.component('PrimeMenubar', Menubar);
app.component('PrimeButton', Button);
app.component('InputText', InputText);
app.mount('#app')
