export default {
    name: 'menus',
    component: () => import('../views/Layout.vue'),
    children: [
        {
            name: 'menu',
            path: '/menus',
            component: () => import('../views/Index.vue'),
        },
        {
            name: 'menu.empresas',
            path: '/menuempresas',
            component: () => import('../views/MenuEmpresa.vue'),
        },
        {
            name: 'menu.usuarios',
            path: '/menuusers',
            component: () => import('../views/MenuUsuarios.vue'),
        }
    ]
}
