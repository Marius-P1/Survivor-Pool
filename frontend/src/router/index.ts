import {createRouter, createWebHistory} from 'vue-router';

import dashboard from "@/pages/master/AppDashboard.vue";
import home from "@/pages/AppHome.vue";
import login from "@/pages/master/AppLogin.vue";
import profile from "@/pages/AppProfile.vue";
import astrological from "@/pages/AppAstrological.vue";
import wardrobe from "@/pages/AppWardrobe.vue";
import employees from "@/pages/AppEmployees.vue";
import customers from "@/pages/AppCustomers.vue";
import tips from "@/pages/AppTips.vue";
import events from "@/pages/AppEvents.vue";


const routes = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: dashboard
    },
    {
        name: 'Login',
        path: '/',
        component: login
    },
    {
        name: 'Home',
        path: '/home',
        component: home
    },
    {
        name: 'profile',
        path: '/profile',
        component: profile
    },
    {
        name: 'Astrological',
        path: '/astrological',
        component: astrological
    },
    {
        name: 'Wardrobe',
        path: '/wardrobe',
        component: wardrobe
    },
    {
        name: 'Employees',
        path: '/employees',
        component: employees
    },
    {
        name: 'Customers',
        path: '/customers',
        component: customers
    },
    {
        name: 'Tips',
        path: '/tips',
        component: tips,
    },
    {
        name: 'Events',
        path: '/events',
        component: events,
    }
];

const router = Router();
export default router;

function Router() {
    return createRouter({
        history: createWebHistory(),
        routes
    });
}
