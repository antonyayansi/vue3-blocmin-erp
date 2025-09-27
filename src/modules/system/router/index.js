export default {
    name: 'system',
    path: '/',
    component: () => import('../layouts/Layout.vue'),
    children: [
        {
            name: 'home',
            path: '',
            component: () => import('../views/Home.vue')
        },
        {
            name: 'cajas',
            path: '/cajas',
            component: () => import('../modules/cajas/views/Caja.vue')
        }
    ]
}