<template>
    <Panel header="Administración de clientes" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
        :leave="{ opacity: 0, y: -30 }" :transition="{ duration: 0.3 }">
        <div class="mb-2">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <!-- Input -->
                <div class="w-full md:w-auto">
                    <IconField class="w-full">
                        <InputIcon @click="changePage(1)" class="pi pi-search" />
                        <InputText v-model="pag.buscar" size="small" @keypress.enter="changePage(1)"
                            placeholder="Buscar..." class="w-full md:w-auto" />
                    </IconField>
                </div>

                <!-- Botón -->
                <div class="w-full flex justify-end md:w-auto">
                    <Button @click="newCliente()" label="Nuevo cliente" icon="pi pi-plus" size="small" class="" />
                </div>
            </div>
        </div>
        <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @changePage="changePage" :cantidad="true"
            @changeCant="changeCant">
            <table class="prov-id w-full table-fixed xxl:table-auto">
                <thead>
                    <tr class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                        <th class="w-[80px] p-2 text-left">T. doc.</th>
                        <th class="w-[100px] p-2 text-left">N° Documento</th>
                        <th class="w-[200px] p-2 text-left">Nombres</th>
                        <th class="w-[200px] p-2 text-left">Dirección</th>
                        <th class="w-[100px] p-2 text-right">Telefono</th>
                        <th class="w-[130px] p-2 text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clientes" :key="cliente"
                        class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            cliente.tipo_documento == 1 ? 'DNI' : 'RUC' }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            cliente.documento }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            cliente.nombre }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            cliente.direccion }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            cliente.telefono }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                            <div class="flex space-x-2 justify-end">
                                <Button @click="getClienteById(cliente.id)" icon="pi pi-pen-to-square"
                                    variant="outlined" severity="warn" size="small" />
                                <Button @click="confirmDelete(cliente)" icon="pi pi-trash" variant="outlined"
                                    severity="danger" size="small" />
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!clientes.length">
                        <td colspan="6"
                            class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No hay
                            clientes que mostrar.</td>
                    </tr>
                </tbody>
            </table>
        </Table>
    </Panel>
    <Loading :show="isLoading" />
    <Dialog v-model:visible="openModal" modal header="Crear cliente" :style="{ width: '100vw', maxWidth: '600px' }">
        <div class="grid grid-cols-4 gap-2">
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                <Select v-model="new_cliente.tipo_documento" :options="[
                    { descripcion: 'DNI', codigo: 1 },
                    { descripcion: 'RUC', codigo: 6 },
                    { descripcion: 'OTROS', codigo: 0 }
                ]" mode="offline" id="tipo_documento" @selected="onFocus('nro_documento')"
                    placeholder="Seleccione un cliente" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Documento</label>
                <InputText v-model="new_cliente.documento" id="nro_documento" size="small"
                    @blur="getDataByDNI()"
                    @keypress.enter="onFocus('nombres')" />
            </div>
            <div class="col-span-4 md:col-span-2 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Nombres</label>
                <InputText v-model="new_cliente.nombre" id="nombres" size="small"
                    @keypress.enter="onFocus('rsocial')" />
            </div>
            <div class=" col-span-4 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Razón social (opcional)</label>
                <InputText v-model="new_cliente.razon_social" id="rsocial" size="small"
                    @keypress.enter="onFocus('telefono')" />
            </div>
            <div class=" col-span-4 md:col-span-2 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Telefono</label>
                <InputText v-model="new_cliente.telefono" id="telefono" size="small"
                    @keypress.enter="onFocus('correo')" />
            </div>
            <div class="col-span-4 md:col-span-2 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Correo</label>
                <InputText v-model="new_cliente.email" id="correo" size="small"
                    @keypress.enter="onFocus('direccion')" />
            </div>
            <div class="col-span-4 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Dirección</label>
                <InputText v-model="new_cliente.direccion" id="direccion" size="small"
                    @keypress.enter="onFocus('direccion_laboral')" />
            </div>
            <div class="col-span-4 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Dirección Laboral</label>
                <InputText v-model="new_cliente.direccion_laboral" id="direccion_laboral" size="small"
                    @keypress.enter="onSubmit()" />
            </div>
        </div>
        <div class="mt-4 flex space-x-2 items-center">
            <Button @click="onSubmit()" label="Guardar" icon="pi pi-save" size="small" />
        </div>
    </Dialog>
    <ConfirmDialog />
</template>

<script setup>
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog';
import useCliente from '../hooks/useCliente';
import Table from '@/components/Table.vue'
import Loading from '@/components/Loading.vue'
import Select from '@/components/Select.vue'
import { onFocus } from '@/lib/onFocus'
import { useConfirm } from 'primevue'

const confirm = useConfirm()

const {
    isLoading,
    getClientes,
    clientes,
    pag,
    openModal,
    new_cliente,
    onSubmit,
    resetForm,
    getClienteById,
    onDelete,
    getDataByDNI
} = useCliente()

const newCliente = () => {
    resetForm()
    openModal.value = true
    setTimeout(() => {
        onFocus('tipo_documento', true)
    }, 300)
}

const confirmDelete = (cliente) => {
    confirm.require({
        message: `¿Está seguro de eliminar este cliente ${cliente?.nombre}?`,
        header: 'Confirmación',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Eliminar',
            severity: 'danger'
        },
        accept: async () => {
            await onDelete(cliente.id)
        },
        reject: () => {

        }
    });
};

const changePage = async (page) => {
    pag.value.page = page
    await getClientes()
}

const changeCant = async (cant) => {
    pag.value.cant_reg = cant
    await changePage(1)
}

getClientes()
</script>