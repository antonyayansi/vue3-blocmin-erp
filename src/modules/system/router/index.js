import routerClientes from '../modules/clientes/router';
import routerCreditos from '../modules/creditos/router';

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
            name: 'clientes',
            path: '/clientes',
            ...routerClientes
        },
        {
            name: 'cajas',
            path: '/cajas',
            component: () => import('../modules/cajas/views/Caja.vue')
        },
        {
            name: 'creditos',
            path: '/creditos',
            ...routerCreditos
        },
        {
            name: 'miempresa',
            path: '/miempresa',
            component: () => import('../modules/empresa/views/MiEmpresa.vue')
        }
    ]
}