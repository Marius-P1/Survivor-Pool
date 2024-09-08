import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue, {usePrimeVue} from 'primevue/config'
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';
import Ripple from "primevue/ripple";
import StyleClass from 'primevue/styleclass';
import Image from 'primevue/image';
import Dropdown from 'primevue/dropdown';
import PrimePassword from 'primevue/password';
import Avatar from "primevue/avatar";
import Panel from "primevue/panel";
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';


// Import css
import './assets/main.css'

// Import router
import router from './router'

// Import components
import AppSidebar from "@/components/AppSidebar.vue";


const app = createApp(App);

app.use(PrimeVue, {ripple: true});
app.use(router);
app.use(ToastService);

app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('PrimeDropdown', Dropdown);
app.component('PrimeImage', Image);
app.component('AppSidebar', AppSidebar);
app.component('PrimeMenubar', Menubar);
app.component('PrimeButton', Button);
app.component('InputText', InputText);
app.component('PrimePassword', PrimePassword);
app.component('PrimeAvatar', Avatar);
app.component('PrimePanel', Panel);

app.mount('#app')
