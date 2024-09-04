import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';

import 'primevue/resources/themes/md-dark-indigo/theme.css'       // theme
import 'primevue/resources/primevue.min.css'                    // core css
import 'primeicons/primeicons.css'                              // icons


const app = createApp(App);
app.use(PrimeVue);
app.component('PrimeMenubar', Menubar);
app.component('PrimeButton', Button);
app.component('InputText', InputText);
app.mount('#app')
