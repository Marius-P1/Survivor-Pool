import {createRouter, createWebHistory} from 'vue-router';

import home from "@/pages/AppHome.vue";
import login from "@/pages/master/AppLogin.vue";
import profile from "@/pages/AppProfile.vue";
import astrological from "@/pages/AppAstrological.vue";
import wardrobe from "@/pages/AppWardrobe.vue";
import employees from "@/pages/AppEmployees.vue";
import customers from "@/pages/AppCustomers.vue";
import tips from "@/pages/AppTips.vue";


const routes = [
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
        name: 'NotFound',
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Home' }
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
