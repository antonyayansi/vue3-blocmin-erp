<template>
    <div @click.self="open = !open"
        class="w-full rounded-md bg-white border border-zinc-200 dark:border-zinc-700 py-3 text-zinc-800 dark:text-zinc-200 dark:bg-zinc-950 cursor-pointer flex justify-between px-4 items-center">
        <div @click="open = !open">
            <h1><i :class="`pi ${icon}`" /> {{ name }}</h1>
        </div>
        <div>
            <div class="flex space-x-2 items-center justify-center">
                <button v-if="estado == 1" @click="desactivarMenuUser(menuuser_id)" class="text-2xl text-green-500">
                    <i class="pi pi-check-circle" />
                </button>
                <button v-if="estado == 0" @click="activarMenuUser(menuempresa_id)"
                    class="text-2xl hover:text-green-500 dark:hover:text-green-500 dark:text-zinc-500  ">
                    <i class="pi pi-check-circle" />
                </button>
            </div>
        </div>
    </div>
    <div v-if="open" class="ml-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-md">
        <ul class="">
            <li v-for="menu in menus" :key="menu.id" class="border-b border-zinc-200 dark:border-zinc-700 px-4 py-2">
                <div class="flex justify-between items-center">
                    <h1 class="text-zinc-700 text-sm dark:text-zinc-300  "><i :class="`pi ${menu.icon}`" /> {{ menu.name
                    }}</h1>
                    <div class="flex space-x-2 items-center justify-center">
                        <button v-if="menu.estado == 1" @click="desactivarMenuUser(menu.menuuser_id)"
                            class="text-2xl text-green-500">
                            <i class="pi pi-check-circle" />
                        </button>
                        <button v-if="menu.estado == 0" @click="activarMenuUser(menu.menuempresa_id)"
                            class="text-2xl hover:text-green-500 dark:hover:text-green-500 dark:text-zinc-500  ">
                            <i class="pi pi-check-circle" />
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useMenuUser from '../hooks/useMenuUser'

const {
    activarMenuUser,
    desactivarMenuUser
} = useMenuUser()

const props = defineProps({
    menus: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    id: {
        type: [Number, String],
        required: true
    },
    menuuser_id: {
        type: [Number, String],
        required: false
    },
    menuempresa_id: {
        type: [Number, String],
        required: true
    },
    estado: {
        type: [Number, String], // 0 = Inactivo, 1 = Activo
        required: true
    }
})

const open = ref(false)

</script>
