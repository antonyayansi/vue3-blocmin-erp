<template>
    <div @click.self="open = !open"
        class="w-full rounded-md bg-white border-l-4 border-primary-500 text-zinc-800 dark:text-zinc-200 dark:bg-zinc-900 shadow-sm cursor-pointer flex justify-between px-4 py-1 items-center  ">
        <div @click="open = !open">
            <h1><i :class="`pi ${icon}`" /> {{ name }}</h1>
        </div>
        <div>
            <div class="flex space-x-2 items-center justify-center">
                <button v-if="estado == 1" @click="desactivarMenuEmpresa(menuempresa_id)"
                    class="text-2xl text-skin-success">
                    <i class="pi pi-verified" />
                </button>
                <button v-if="estado == 0" @click="activarMenuEmpresa(id)"
                    class="text-2xl hover:text-skin-success dark:hover:text-skin-success dark:text-zinc-500  ">
                    <i class="pi pi-verified" />
                </button>
            </div>
        </div>
    </div>
    <div v-if="open" class="ml-4 bg-white dark:bg-zinc-900 rounded-md p-4  ">
        <ul class="space-y-4">
            <li v-for="menu in menus" :key="menu.id">
                <div class="flex justify-between">
                    <h1 class="text-zinc-700 dark:text-zinc-300 text-sm  "><i :class="`pi ${menu.icon}`" /> {{ menu.name
                    }}</h1>
                    <div class="flex space-x-2 items-center justify-center">
                        <button v-if="menu.estado == 1" @click="desactivarMenuEmpresa(menu.menuempresa_id)"
                            class="text-2xl text-skin-success">
                            <i class="pi pi-verified" />
                        </button>
                        <button v-if="menu.estado == 0" @click="activarMenuEmpresa(menu.id)"
                            class="text-2xl hover:text-skin-success dark:hover:text-skin-success dark:text-zinc-500  ">
                            <i class="pi pi-verified" />
                        </button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
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
        type: Number,
        required: false
    },
    estado: {
        type: Number, // 0 = Inactivo, 1 = Activo
        required: true
    }
})

const open = ref(false)

</script>
