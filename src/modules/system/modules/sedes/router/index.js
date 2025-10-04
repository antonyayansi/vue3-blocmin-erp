export default {
    name: 'sedes',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: 'sedes.index',
            path: '/sedes',
            component: () => import('../views/Index.vue'),
        },
        {
            name: 'sedes.create',
            path: '/sedes/create',
            component: () => import('../views/Create.vue')
        }
    ]
}
