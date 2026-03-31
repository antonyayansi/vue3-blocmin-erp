<template>
    <div @click.self="open = !open"
        class="w-full rounded-md items-center my-2 border-l-4 bg-white text-zinc-800 dark:text-zinc-200 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 cursor-pointer flex justify-between px-4 py-2">
        <div @click="open = !open">
            <h1><i :class="`pi ${icon}`" /> {{ name }}</h1>
        </div>
        <div class="flex space-x-2 items-center justify-center">
            <ToggleSwitch
                :modelValue="estado == 1"
                @update:modelValue="val => val ? activarMenuEmpresa(id) : desactivarMenuEmpresa(menuempresa_id)"
            />
        </div>
    </div>
    <div v-if="open" class="ml-4 bg-white border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 rounded-md">
        <ul class="">
            <li v-for="menu in menus" :key="menu.id">
                <div class="flex justify-between items-center border-b py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:border-zinc-700 border-zinc-200">
                    <h1 class="text-zinc-700 text-sm dark:text-zinc-300"><i :class="`pi ${menu.icon}`" /> {{ menu.name }}</h1>
                    <div class="flex space-x-2 items-center justify-center">
                        <ToggleSwitch
                            :modelValue="menu.estado == 1"
                            @update:modelValue="val => val ? activarMenuEmpresa(menu.id) : desactivarMenuEmpresa(menu.menuempresa_id)"
                        />
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import {
    ToggleSwitch
} from 'primevue'
import { ref } from 'vue';
import useMenuEmpresa from '../hooks/useMenuEmpresa';

const {
    activarMenuEmpresa,
    desactivarMenuEmpresa
} = useMenuEmpresa()

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
        type: Number,
        required: true
    },
    menuempresa_id: {
        type: [String, Number],
        required: false
    },
    estado: {
        type: Number, // 0 = Inactivo, 1 = Activo
        required: true
    }
})

const open = ref(false)

</script>
