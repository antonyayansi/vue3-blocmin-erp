<template>
    <Dialog v-model:visible="openmodal" :header="submenu_id == null ? 'Nuevo Submenu' : 'Editar Submenu'" modal>
        <form v-if="submenu_id == null" @submit.prevent="onSubmit()">
            <div class="mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="">
                        <label for="" class="mb-1 text-xs font-medium text-zinc-500">
                            Nombre
                        </label>
                        <InputText 
                            size="small"
                            v-model="new_menu.name"
                            fluid
                            placeholder="Nombre"
                        />
                    </div>
                    <div class="">
                        <label for="" class="mb-1 text-xs font-medium text-zinc-500">
                            Icono <a class="text-primary-500" href="https://primevue.org/icons/"
                                target="_blank">Librería
                            </a>
                        </label>
                        <InputText 
                            size="small"
                            v-model="new_menu.icon"
                            fluid
                            placeholder="Icono"
                        />
                    </div>
                    <div class="">
                        <label for="" class="mb-1 text-xs font-medium text-zinc-500">
                            URL / Ruta
                        </label>
                        <InputText 
                            size="small"
                            v-model="new_menu.url"
                            fluid
                            placeholder="/url"
                        />
                    </div>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <Button size="small" type="button" label="Cancelar" @click="openmodal = false" severity="secondary"/>
                <Button :loading="isLoading" size="small" type="submit" label="Guardar" severity="primary"/>
            </div>
        </form>
        <form v-else @submit.prevent="onPutSubmit()">
            <div class="mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="">
                        <label for="" class="mb-1 text-xs font-medium text-zinc-500">
                            Nombre
                        </label>
                        <InputText 
                            size="small"
                            v-model="new_menu.name"
                            fluid
                            placeholder="Nombre"
                        />
                    </div>
                    <div class="">
                        <label for="" class="mb-1 text-xs font-medium text-zinc-500">
                            Icono <a class="text-primary-500" href="https://fontawesome.com/search"
                                target="_blank">Librería
                                <i class="pi pi-link" />
                            </a>
                        </label>
                        <InputText 
                            size="small"
                            v-model="new_menu.icon"
                            fluid
                            placeholder="Icono"
                        />
                    </div>
                    <div class="">
                        <label for="" class="mb-1 text-xs font-medium text-zinc-500">
                            URL / Ruta
                        </label>
                        <InputText 
                            size="small"
                            v-model="new_menu.url"
                            fluid
                            placeholder="/url"
                        />
                    </div>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <Button 
                    label="Modificar"
                    :loading="isLoading"
                    size="small"
                    type="submit"
                    severity="primary"
                />
            </div>
        </form>
    </Dialog>
    <div @click.self="open = !open"
        class="w-full rounded-md items-center my-2 border-l-4 bg-white text-zinc-800 dark:text-zinc-200 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 cursor-pointer flex justify-between px-4 py-2  ">
        <div @click="open = !open">
            <h1><i :class="`pi ${icon}`" /> {{ name }}</h1>
        </div>
        <div>
            <div class="flex space-x-2 items-center justify-center">
                <Button label="Editar" severity="warning" size="small" variant="text" @click="onEdit" />
            </div>
        </div>
    </div>
    <div v-if="open" class="ml-4 bg-white border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 rounded-md">
        <ul class="">
            <li v-for="menu in menus" :key="menu.id">
                <div
                    class="flex justify-between items-center border-b py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:border-zinc-700 border-zinc-200">
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
import {
    Button,
    Dialog,
    InputText
} from 'primevue'


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
