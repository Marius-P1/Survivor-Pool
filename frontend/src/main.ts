import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue, {usePrimeVue} from 'primevue/config'
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';
import Ripple from "primevue/ripple";
import StyleClass from 'primevue/styleclass';
import Image from 'primevue/image';

// Import css
import './assets/main.css'

// Import router
import router from './router'

// Import components
import AppSidebar from "@/components/AppSidebar.vue";


const app = createApp(App);

app.use(PrimeVue, {ripple: true});
app.use(router);

app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('PrimeImage', Image);
app.component('AppSidebar', AppSidebar);
app.component('PrimeMenubar', Menubar);
app.component('PrimeButton', Button);
app.component('InputText', InputText);

app.mount('#app')
