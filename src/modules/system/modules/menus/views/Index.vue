<template>
    <Dialog v-model:visible="openmodal" modal :header="menu_id == null ? 'Nuevo menu' : 'Editar menu'">
        <form v-if="menu_id == null" @submit.prevent="postMenu()">
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
                    Guardar
                </button>
            </div>
        </form>
        <form v-else @submit.prevent="putMenu()">
            <div class="mb-4">
                <div class="my-2 flex flex-wrap">
                    <div class="w-full md:w-1/2 space-y-1 pr-0 md:pr-2">
                        <label for="" class="text-xs text-zinc-500">
                            Nombre
                        </label>
                        <input placeholder="Nombre" v-model="new_menu.name" type="text"
                            class="w-full outline-none p-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-primary-500 border  ">
                    </div>
                    <div class="w-full md:w-1/2 space-y-1">
                        <label for="" class="text-xs text-zinc-500">
                            Icono <a class="text-primary-500" href="https://fontawesome.com/icon"
                                target="_blank">Librería
                                <fa icon="arrow-up-right-from-square" />
                            </a>
                        </label>
                        <input placeholder="Icono" v-model="new_menu.icon" type="text"
                            class="w-full outline-none p-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-primary-500 border  ">
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
                    Modificar
                </button>
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
</template>

<script setup>
import { onMounted } from 'vue';
import useMenus from '../hooks/useMenus';
import Dropdown from '../components/Dropdown.vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

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