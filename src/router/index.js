import { createWebHistory, createRouter } from 'vue-router'

import routerSystem from '../modules/system/router'
import isAuth from '../middleware/isAuth'
import isRedirect from '../middleware/isRedirect'
import topbar from 'topbar'
import isPermission from '../middleware/isPermission'

topbar.config({
    barThickness: 4,
    barColors: { 0: '#29d' },
    shadowBlur: 5,
})

const routes = [
    {
        path: '/',
        name: 'system',
        ...routerSystem,
        beforeEnter: [isPermission]
        // beforeEnter: [isAuth],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../modules/auth/views/Login.vue'),
        beforeEnter: [isRedirect]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../components/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Iniciar NProgress antes de cambiar de ruta
router.beforeEach((to, from, next) => {
    topbar.show();
    next();
});

// Detener NProgress una vez que la ruta haya terminado de cargarse
router.afterEach(() => {
    topbar.hide();
});

export default router