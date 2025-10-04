<template>
    <Dialog v-model:visible="openmodal" :header="submenu_id == null ? 'Nuevo Submenu' : 'Editar Submenu'">
        <form v-if="submenu_id == null" @submit.prevent="onSubmit()">
            <div class="mb-4">
                <div class="flex flex-wrap">
                    <div class="w-full md:w-1/2 pr-0 md:pr-2">
                        <label for="" class="text-sm text-zinc-500">
                            Nombre
                        </label>
                        <input placeholder="Nombre" v-model="new_menu.name" type="text"
                            class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                    </div>
                    <div class="w-full md:w-1/2">
                        <label for="" class="text-sm text-zinc-500">
                            Icono <a class="text-primary-500" href="https://primevue.org/icons/"
                                target="_blank">Librería
                            </a>
                        </label>
                        <input placeholder="Icono" v-model="new_menu.icon" type="text"
                            class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                    </div>
                    <div class="w-full md:w-1/2 pr-0 md:pr-2">
                        <label for="" class="text-sm text-zinc-500">
                            URL / Ruta
                        </label>
                        <input placeholder="/url" v-model="new_menu.url" type="text"
                            class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                    </div>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <button type="button" @click="openmodal = false"
                    class="text-zinc-600 dark:text-zinc-400 font-medium py-1 px-2 rounded-md  ">
                    Cancelar
                </button>
                <button :disabled="isLoading" :class="{ 'opacity-50': isLoading }" type="submit"
                    class="text-white bg-primary-500 hover:bg-primary-500_hover font-medium py-1 px-2 rounded-md  ">
                    <fa icon="save" />
                    Guardar
                </button>
            </div>
        </form>
        <form v-else @submit.prevent="onPutSubmit()">
            <div class="mb-4">
                <div class="my-2 flex flex-wrap">
                    <div class="w-full md:w-1/2 pr-0 md:pr-2">
                        <label for="" class="text-sm text-zinc-500">
                            Nombre
                        </label>
                        <input placeholder="Nombre" v-model="new_menu.name" type="text"
                            class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                    </div>
                    <div class="w-full md:w-1/2">
                        <label for="" class="text-sm text-zinc-500">
                            Icono <a class="text-primary-500" href="https://fontawesome.com/search"
                                target="_blank">Librería
                                <fa icon="arrow-up-right-from-square" />
                            </a>
                        </label>
                        <input placeholder="Icono" v-model="new_menu.icon" type="text"
                            class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                    </div>
                    <div class="w-full md:w-1/2 pr-0 md:pr-2">
                        <label for="" class="text-sm text-zinc-500">
                            URL / Ruta
                        </label>
                        <input placeholder="/url" v-model="new_menu.url" type="text"
                            class="w-full outline-none px-2 py-1 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border  ">
                    </div>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <button type="button" @click="openmodal = false"
                    class="text-zinc-600 dark:text-zinc-400 py-1 px-2 rounded-md  ">
                    Cancelar
                </button>
                <button :disabled="isLoading" :class="{ 'opacity-50': isLoading }" type="submit"
                    class="text-white bg-primary-500 hover:bg-primary-500_hover py-1 px-2 rounded-md  ">
                    <fa icon="save" />
                    Modificar
                </button>
            </div>
        </form>
    </Dialog>
    <div @click.self="open = !open"
        class="w-full rounded-md items-center my-2 border-l-4 border-primary-500 bg-white text-zinc-800 dark:text-zinc-200 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 cursor-pointer flex justify-between px-4 py-2  ">
        <div @click="open = !open">
            <h1><i :class="`pi ${icon}`" /> {{ name }}</h1>
        </div>
        <div>
            <div class="flex space-x-2 items-center justify-center">
                <button @click="onEdit"
                    class="rounded-full border border-zinc-200 dark:border-zinc-600 text-primary-500 hover:text-white hover:bg-primary-500 border-primary-500 px-2 py-1 text-sm font-medium  ">
                    Editar
                </button>
            </div>
        </div>
    </div>
    <div v-if="open" class="ml-4 bg-white border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 rounded-md">
        <ul class="">
            <li v-for="menu in menus" :key="menu.id">
                <div
                    class="flex justify-between items-center border-b py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:border-zinc-700">
                    <h1 class="text-zinc-700 text-sm dark:text-zinc-300  "><i :class="`pi ${menu.icon}`" /> {{ menu.name
                    }}</h1>
                    <div class="flex space-x-2 items-center justify-center">
                        <Button icon="pi pi-pen-to-square" severity="warn" size="small" variant="text"
                            @click="editSubMenu(menu)" />
                        <Button icon="pi pi-trash" severity="danger" size="small" variant="text"
                            @click="deleteSubMenu(menu.id)" />
                    </div>
                </div>
            </li>
            <li class="text-center py-2">
                <Button @click="newSubMenu()" label="Agregar" size="small" icon="pi pi-plus" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useMenus from '../hooks/useMenus';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';


const props = defineProps({
    menus: {
        type: Array,
        required: false
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
    }
})

const emit = defineEmits(['edit'])

const onEdit = () => {
    emit('edit')
}

const {
    submenu_id,
    new_menu,
    postSubMenu,
    putSubMenu,
    deleteSubMenu,
} = useMenus()

const open = ref(false)
const openmodal = ref(false)
const isLoading = ref(false)

const newSubMenu = () => {
    new_menu.value = {
        name: '',
        icon: '',
        url: '*',
        menu_id: null
    }
    openmodal.value = true
}

const editSubMenu = (submenu) => {
    submenu_id.value = submenu.id
    new_menu.value = {
        name: submenu.name,
        icon: submenu.icon,
        url: submenu.url,
        menu_id: submenu.menu_id
    }
    openmodal.value = true
}

const onSubmit = async () => {
    isLoading.value = true
    const confirm = await postSubMenu(props.id)
    if (confirm) {
        openmodal.value = false
        isLoading.value = false
    } else {
        isLoading.value = false
    }
}

const onPutSubmit = async () => {
    isLoading.value = true
    const confirm = await putSubMenu(props.id)
    if (confirm) {
        openmodal.value = false
        isLoading.value = false
        submenu_id.value = null
    } else {
        isLoading.value = false
    }
}

</script>
