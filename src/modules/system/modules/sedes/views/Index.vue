<template>
    <Dialog v-model:visible="openModal" modal header="Eliminar sede">
        <div class="my-4">
            <p class="text-zinc-600 dark:text-zinc-400  ">¿Está seguro de eliminar esta sede?</p>
        </div>
        <div class="py-2 flex justify-end space-x-2">
            <button type="button" @click="openModal = false"
                class="text-zinc-600 dark:text-zinc-400 font-medium py-1 px-2 rounded-md  ">
                Cancelar
            </button>
            <button :disabled="isLoading" :class="{ 'opacity-50': isLoading }" @click="destroy()" type="submit"
                class="text-white bg-red-500 hover:bg-red-500_hover font-medium py-1 px-2 rounded-md  ">
                <i class="pi pi-trash" />
                Eliminar
            </button>
        </div>
    </Dialog>
    <Panel header="Sedes">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div class="w-full md:w-auto">
                <IconField class="w-full">
                    <InputIcon @click="changePage(1)" class="pi pi-search" />
                    <InputText v-model="pag.buscar" size="small" @keypress.enter="changePage(1)" placeholder="Buscar..."
                        class="w-full md:w-auto" />
                </IconField>
            </div>
            <div class="w-full flex justify-end md:w-auto">
                <Button @click="newSede()" label="Nueva sede" icon="pi pi-plus" size="small" class="" />
            </div>
        </div>
        <div class="py-2">
            <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.nro_pagina" @change-page="changePage">
                <table class="w-full table-fixed xxl:table-auto">
                    <thead>
                        <tr
                            class="bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-700">
                            <th class="w-[150px] text-left p-2">
                                Nombre</th>
                            <th class="w-[150px] text-left p-2">
                                Dirección</th>
                            <th class="w-[100px] text-left p-2">
                                Teléfono</th>
                            <th class="w-[100px] text-left p-2">
                                Email</th>
                            <th class="w-[150px] text-right p-2">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="sedes.length"
                            class="hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-700"
                            v-for="sede in sedes" :key="sede">
                            <td class="px-4 py-2 text-sm text-left">{{ sede.name }}</td>
                            <td class="px-4 py-2 text-sm text-left">{{ sede.direccion }}</td>
                            <td class="px-4 py-2 text-sm text-left">{{ sede.telefono }}</td>
                            <td class="px-4 py-2 text-sm text-left">{{ sede.email }}</td>
                            <td class="px-4 py-2 text-sm text-left">
                                <div class="flex space-x-2 items-center justify-end">
                                    <Button @click="editSede(sede)" icon="pi pi-pen-to-square" severity="warn"
                                        variant="text" size="small" />
                                    <Button @click="deleteSede(sede.id)" icon="pi pi-trash" severity="danger"
                                        variant="text" size="small" />
                                </div>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="5" class="px-4 py-4 text-sm text-center text-zinc-500 font-light">
                                No hay datos
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Table>
        </div>
    </Panel>
    <Loading :show="isLoading" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import useSede from '../hooks/useSede';
import Table from '@/components/Table.vue'
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel'
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Loading from '@/components/Loading.vue';

const router = useRouter()

const {
    isLoading,
    pag,
    sedes,
    get,
    openModal,
    resetForm,
    destroy,
    new_sede
} = useSede()

const changePage = async (e) => {
    pag.value.nro_pagina = e
    await get()
}

const newSede = () => {
    resetForm()
    router.push({ name: 'sedes.create' })
}

const editSede = (sede) => {
    new_sede.value = { ...sede }
    router.push({ name: 'sedes.create' })
}

const deleteSede = async (id) => {
    new_sede.value.id = id
    openModal.value = true
}

get()
</script>