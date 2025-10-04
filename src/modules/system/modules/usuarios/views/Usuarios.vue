<template>
    <Dialog v-model:visible="open" modal :header="user_id == null ? 'Nuevo usuario' : 'Editar usuario'">
        <form v-if="user_id == null" @submit.prevent="postUsers()" method="post">
            <div class="my-4">
                <div class="my-2 flex flex-wrap">
                    <InputText v-model="new_user.name" required type="text" size="small" fluid />
                </div>
                <div class="my-2 flex flex-wrap">
                    <InputText v-model="new_user.email" required type="email" size="small" fluid />
                </div>
                <div class="my-2 flex flex-wrap">
                    <InputText v-model="new_user.password" type="password" size="small" fluid />
                </div>
                <div class="my-2 flex flex-wrap">
                    <select v-model="new_user.rol" required
                        class="w-full outline-none p-2 bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-skin-primary border  ">
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                    </select>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <Button variant="outlined" label="Cancelar" size="small" @click="open = false" />
                <Button type="submit" label="Guardar" icon="pi pi-save" size="small" :loading="isLoading" />
            </div>
        </form>
        <form v-else @submit.prevent="putUsers()" method="post">
            <div class="my-4">
                <div class="my-2 flex flex-wrap">
                    <InputText v-model="new_user.name" required type="text" size="small" fluid />
                </div>
                <div class="my-2 flex flex-wrap">
                    <InputText v-model="new_user.email" required type="email" size="small" fluid />
                </div>
                <div class="my-2 flex flex-wrap">
                    <InputText v-model="new_user.password" type="password" size="small" fluid />
                </div>
                <div class="my-2 flex flex-wrap">
                    <select v-model="new_user.rol" required
                        class="w-full outline-none p-2 bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-2 focus:ring-skin-primary border  ">
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                    </select>
                </div>
            </div>
            <div class="py-2 flex justify-end space-x-2">
                <Button variant="outlined" label="Cancelar" size="small" @click="open = false" />
                <Button type="submit" label="Guardar" icon="pi pi-save" size="small" :loading="isLoading" />
            </div>
        </form>
    </Dialog>
    <Dialog v-model:visible="openDelete" modal header="Eliminar usuario">
        <div class="my-4">
            <p class="text-zinc-600 dark:text-zinc-400  ">¿Está seguro de eliminar este
                usuario?</p>
        </div>
        <div class="py-2 flex justify-end space-x-2">
            <Button variant="outlined" label="Cancelar" size="small" @click="openDelete = false" />
            <Button label="Eliminar" icon="pi pi-trash" size="small" severity="danger" :loading="isLoading"
                @click="deleteUsers()" />
        </div>
    </Dialog>
    <Panel header="Administración de Usuarios">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div class="w-full md:w-auto">
                <IconField class="w-full">
                    <InputIcon @click="changePage(1)" class="pi pi-search" />
                    <InputText v-model="pag.buscar" size="small" @keypress.enter="changePage(1)" placeholder="Buscar..."
                        class="w-full md:w-auto" />
                </IconField>
            </div>
            <div class="w-full flex justify-end md:w-auto">
                <Button @click="newUser()" label="Nuevo personal" icon="pi pi-plus" size="small" class="" />
            </div>
        </div>
        <div class="mt-4">
            <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.nro_pagina" @change-page="changePage">
                <table class="w-full table-fixed xxl:table-auto">
                    <thead>
                        <tr
                            class="bg-zinc-50 dark:bg-zinc-800 font-bold text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-700">
                            <th class="w-[150px] text-left p-2">
                                Nombre</th>
                            <th class="w-[180px] text-left p-2">
                                Correo</th>
                            <th class="w-[100px] text-left p-2">
                                Rol</th>
                            <th class="w-[100px] text-left p-2">
                                Estado</th>
                            <th class="w-[100px] text-right p-2">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="users.length"
                            class="hover:bg-zinc-50 border-b border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200  "
                            v-for="user in users" :key="user">
                            <td class="px-2 py-2 text-sm text-left">
                                <div class="flex space-x-2 items-center">
                                    <p>{{ user.name }}</p>
                                </div>
                            </td>
                            <td class="px-2 py-2 text-sm text-left">{{ user.email }}</td>
                            <td class="px-2 py-2 text-sm text-left">{{ user.rol }}</td>
                            <td class="px-2 py-2 text-sm text-left">
                                <Tag :value="user.estado == '1' ? 'Activo' : 'Desactivado'"
                                    :severity="user.estado == '1' ? 'success' : 'danger'" />
                            </td>
                            <td class="px-2 py-2 text-sm text-left">
                                <div class="flex space-x-2 items-center justify-end">
                                    <Button @click="editUser(user)" icon="pi pi-pen-to-square" variant="text"
                                        size="small" />
                                    <Button variant="text" severity="danger" icon="pi pi-trash" size="small"
                                        @click="deleteUser(user.id)" />
                                </div>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="4" class="px-4 py-4 text-sm text-center text-zinc-500 font-medium">
                                🍃 No hay datos
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Table>
        </div>
    </Panel>
    <Loading :show="isLoading" title="Cargando" />
</template>

<script setup>
import { onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Table from '@/components/Table.vue';
import Tag from 'primevue/tag';
import Loading from '@/components/Loading.vue';
import useUsuario from '../hooks/useUsuario';

const {
    pag,
    users,
    getUsers,
    open,
    user_id,
    isLoading,
    postUsers,
    resetForm,
    new_user,
    putUsers,
    openDelete,
    deleteUsers
} = useUsuario()

const changePage = (page) => {
    pag.nro_pagina = page
    getUsers()
}

const newUser = () => {
    resetForm()
    open.value = true
}

const deleteUser = (id) => {
    user_id.value = id
    openDelete.value = true
}

const editUser = (user) => {
    new_user.value.name = user.name
    new_user.value.email = user.email
    new_user.value.rol = user.rol

    user_id.value = user.id
    open.value = true
}

onMounted(async () => {
    await getUsers()
})

</script>