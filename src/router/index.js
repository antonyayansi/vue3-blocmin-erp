import { createWebHistory, createRouter } from 'vue-router'

import routerSystem from '../modules/system/router'
import isAuth from '../middleware/isAuth'
import isRedirect from '../middleware/isRedirect'

const routes = [
    {
        path: '/',
        name: 'system',
        ...routerSystem,
        beforeEnter: [isAuth],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../modules/auth/views/Login.vue'),
        beforeEnter: [isRedirect]
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})