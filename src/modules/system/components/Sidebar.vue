<template>
    <div>
        <div class="grid grid-cols-12 bg-zinc-100 dark:bg-zinc-900">
            <!-- Sidebar -->
            <div v-if="openSidebar" v-motion :initial="{ opacity: 0, x: -30 }" :enter="{ opacity: 1, x: 0 }"
                :leave="{ opacity: 0, x: -30 }" :transition="{ duration: 0.3 }"
                class="hidden lg:inline-block lg:col-span-3 xl:col-span-2">
                <div
                    class="h-screen sticky top-0 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900">
                    <div
                        class="w-full sticky top-0 backdrop-blur-sm bg-white/20 dark:bg-zinc-900/20 z-50 text-center py-4 border-b border-zinc-200 dark:border-zinc-700">
                        <h2 class="text-primary-500 dark:text-white text-lg font-semibold">
                            <img src="/img/logo.jpeg" alt="Logo Tukuy Asistencia" class="h-8 inline-block mr-2">
                            {{ activeEmpresa?.nombre_comercial }}
                        </h2>
                    </div>
                    <div class="overflow-y-auto px-2">
                        <Menu v-for="menu in menus" :key="menu.path" :node="menu" />
                    </div>
                </div>
            </div>
            <!-- Contenido -->
            <div :class="openSidebar ? 'col-span-12 lg:col-span-9 xl:col-span-10' : 'col-span-12'" class="min-h-screen">
                <Header />
                <div class="mx-auto p-4">
                    <router-view />
                    <Footer />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import useSystem from '../hooks/useSystem'
import Header from './Header.vue'
import Menu from './Menu.vue'
import Footer from './Footer.vue'

const {
    checkStatusSidebar,
    openSidebar,
    menus,
    activeEmpresa
} = useSystem()

checkStatusSidebar()
</script>