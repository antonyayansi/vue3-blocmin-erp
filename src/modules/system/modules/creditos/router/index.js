export default {
    name: "creditos",
    path: "/creditos",
    component: () => import("../layouts/Layout.vue"),
    children: [
        {
            name: 'creditos.index',
            path: '',
            component: () => import('../views/Index.vue')
        },
        {
            name: 'creditos.create',
            path: 'create',
            component: () => import('../views/Create.vue')
        },
        // {
        //     name: 'autorizaciones.index',
        //     path: '/autorizaciones',
        //     component: () => import('../../autorizaciones/views/Index.vue')
        // }
    ]
}