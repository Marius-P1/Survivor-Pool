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
import ProgressBar from 'primevue/progressbar';
import card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import AutoComplete from 'primevue/autocomplete';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';

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
app.component('ProgressBar', ProgressBar);
app.component('PrimeCard', card);
app.component('ProgressSpinner', ProgressSpinner);
app.component('AutoComplete', AutoComplete);
app.component('PrimeDataTable', DataTable);
app.component('PrimeColumn', Column);
app.component('PrimeDialog', Dialog);
app.component('PrimeCheckbox', Checkbox);

app.mount('#app')
