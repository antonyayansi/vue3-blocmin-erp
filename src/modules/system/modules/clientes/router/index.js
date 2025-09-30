export default {
    name: 'clientes',
    path: '/clientes',
    component: () => import('../layouts/Layout.vue'),
    children: [
        {
            name: 'clientes.index',
            path: '',
            component: () => import('../views/Index.vue'),
        },
    ]
}