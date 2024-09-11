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
import ToastService from 'primevue/toastservice';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import AutoComplete from 'primevue/autocomplete';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import Knob from 'primevue/knob';
import TabMenu from 'primevue/tabmenu';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import OverlayPanel from 'primevue/overlaypanel';

// Import css
import './assets/main.css'

// Import router
import router from './router'

// Import components
import AppHeader from "@/components/AppHeader.vue";

// Import services
import ConfirmationService from 'primevue/confirmationservice';


const app = createApp(App);

app.use(PrimeVue, {ripple: true});
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);

app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('PrimeDropdown', Dropdown);
app.component('PrimeImage', Image);
app.component('AppHeader', AppHeader);
app.component('PrimeMenuBar', Menubar);
app.component('PrimeButton', Button);
app.component('InputText', InputText);
app.component('PrimePassword', PrimePassword);
app.component('PrimeAvatar', Avatar);
app.component('PrimePanel', Panel);
app.component('PrimeCard', Card);
app.component('ProgressSpinner', ProgressSpinner);
app.component('AutoComplete', AutoComplete);
app.component('PrimeDataTable', DataTable);
app.component('PrimeColumn', Column);
app.component('PrimeDialog', Dialog);
app.component('PrimeCheckbox', Checkbox);
app.component('PrimeKnob', Knob);
app.component('PrimeTabMenu', TabMenu);
app.component('PrimeConfirmPopup', ConfirmPopup);
app.component('PrimeToast', Toast);
app.component('PrimeOverlayPanel', OverlayPanel);
app.component('PrimeConfirmDialog', ConfirmDialog);

app.mount('#app')
