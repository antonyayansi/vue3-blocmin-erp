<template>
    <Dialog v-model:visible="openmodal" modal :header="menu_id == null ? 'Nuevo menu' : 'Editar menu'">
        <form v-if="menu_id == null" @submit.prevent="postMenu()">
            <div class="mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="">
                        <label for="" class="mb-1 font-medium text-xs text-zinc-500">
                            Nombre
                        </label>
                        <InputText size="small" v-model="new_menu.name" fluid placeholder="Nombre" />
                    </div>
                    <div class="">
                        <label for="" class="mb-1 font-medium text-xs text-zinc-500">
                            Icono <a class="text-primary-500" href="https://fontawesome.com/search"
                                target="_blank">Librería
                                <i class="pi pi-link" />
                            </a>
                        </label>
                        <InputText size="small" v-model="new_menu.icon" fluid placeholder="Icono" />
                    </div>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <Button size="small" severity="primary" label="Guardar" :loading="isLoading" type="submit" />
            </div>
        </form>
        <form v-else @submit.prevent="putMenu()">
            <div class="mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="">
                        <label for="" class="mb-2 font-medium text-xs text-zinc-500">
                            Nombre
                        </label>
                        <InputText size="small" v-model="new_menu.name" fluid placeholder="Nombre" />
                    </div>
                    <div class="">
                        <label for="" class="mb-2 font-medium text-xs text-zinc-500">
                            Icono <a class="text-primary-500" href="https://fontawesome.com/icon"
                                target="_blank">Librería
                                <i class="pi pi-link" />
                            </a>
                        </label>
                        <InputText size="small" v-model="new_menu.icon" fluid placeholder="Icono" />
                    </div>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <Button :loading="isLoading" size="small" type="submit" label="Modificar" severity="primary" />
            </div>
        </form>
    </Dialog>
    <div>
        <div
            class="mt-2 bg-white dark:bg-zinc-950 w-full rounded-md border border-zinc-200 dark:border-zinc-700 inline-block md:flex justify-between items-center p-4  ">
            <h1 class="font-bold text-xl dark:text-zinc-300 ">Menus</h1>
            <div class="mt-2 md:mt-0">
                <Button label="Agregar" icon="pi pi-plus" size="small" @click="newMenu()" />
            </div>
        </div>
        <div class="mb-4">
            <Dropdown v-for="menu in menus_all" :key="menu.id" :menus="menu.children" :id="menu.id" :name="menu.name"
                :icon="menu.icon" @edit="editMenu(menu)" />
        </div>
    </div>
    <Loading :show="isLoading" />
</template>

<script setup>
import { onMounted } from 'vue';
import useMenus from '../hooks/useMenus';
import Dropdown from '../components/Dropdown.vue';
import Loading from '../../../../../components/Loading.vue';
import {
    Dialog,
    Button,
    InputText
} from 'primevue'

const {
    isLoading,
    menus_all,
    getMenu,
    openmodal,
    new_menu,
    menu_id,
    postMenu,
    putMenu
} = useMenus()

const newMenu = () => {
    openmodal.value = true
    menu_id.value = null
    new_menu.value.name = ''
    new_menu.value.url = '*'
    new_menu.value.icon = ''
    new_menu.value.menu_id = null
}

const editMenu = (menu) => {
    openmodal.value = true
    menu_id.value = menu.id
    new_menu.value.name = menu.name
    new_menu.value.url = menu.url
    new_menu.value.icon = menu.icon
    new_menu.value.menu_id = null
}

onMounted(() => {
    getMenu()
});
</script>