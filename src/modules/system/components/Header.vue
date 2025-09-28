<template>
    <div class="sticky top-0 bg-white/30 backdrop-blur-md dark:bg-zinc-950/30 z-50">
        <div class="py-2 flex justify-between items-center px-4">
            <div v-if="activeEmpresa" v-motion :initial="{ opacity: 0, x: 30 }" :enter="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.3 }" class="flex items-center space-x-2">
                <div class="hidden lg:inline-block">
                    <Button @click="toggleSidebar()" size="small" icon="pi pi-bars" severity="secondary" rounded
                        aria-label="Menu" />
                </div>
                <div class="inline-block lg:hidden">
                    <Button @click="visible = true" size="small" icon="pi pi-bars" severity="secondary" rounded
                        aria-label="Menu" />
                </div>
                <router-link to="/"
                    class="text-zinc-700 hover:text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-300">
                    <h1 class="text-xl font-medium">{{ activeEmpresa?.razon_social }}</h1>
                </router-link>
            </div>
            <div class="flex space-x-2 items-center">
                <!-- Dark Mode Toggle -->
                <Button size="small" :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" severity="secondary"
                    @click="toggleLight" />
                <Button :label="user?.Iniciales" size="small" icon="pi pi-user" severity="secondary" class="mr-2"
                    @click="toggle" />
            </div>
        </div>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
    <Drawer v-model:visible="visible" header="Menu">
        <MenuCustom @close-menu="visible = false" v-for="menu in menus" :key="menu.path" :node="menu" />
    </Drawer>
</template>

<script setup>
import { computed, ref } from 'vue';
import useSystem from '../hooks/useSystem';
import Menu from 'primevue/menu';
import Button from 'primevue/button'
import Drawer from 'primevue/drawer';
import useAuth from '../../auth/hooks/useAuth';
import { useDark } from '@vueuse/core'
import MenuCustom from './Menu.vue';

const isDark = useDark()
const visible = ref(false)

const toggleLight = () => {
    isDark.value = !isDark.value;
}

const {
    activeEmpresa,
    toggleSidebar,
    menus
} = useSystem()

const {
    user,
    onLogout
} = useAuth()

const menu = ref()
const items = computed(() => [
    {
        label: user.value?.name,
        items: [
            {
                label: 'Perfil',
                icon: 'pi pi-user'
            },
            {
                label: 'Cambiar empresa',
                icon: 'pi pi-sync',
                command: () => {
                    activeEmpresa.value = null
                    localStorage.removeItem('bloc-empresa')
                    localStorage.removeItem('bloc-menu')
                    localStorage.removeItem('bloc-sede')
                }
            },
            {
                separator: true
            },
            {
                label: 'Salir',
                icon: 'pi pi-sign-out',
                command: async () => {
                    await onLogout()
                }
            }
        ]
    }
])


const toggle = (event) => {
    menu.value.toggle(event);
};
</script>