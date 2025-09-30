<template>
    <Panel header="Administración de creditos" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
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
                    <Button @click="newCredito()" label="Nueva credito" icon="pi pi-plus" size="small" class="" />
                </div>
            </div>
        </div>
        <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @changePage="changePage" :cantidad="true"
            @changeCant="changeCant">
            <table class="prov-id w-full table-fixed xxl:table-auto">
                <thead>
                    <tr class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                        <th class="w-[100px] p-2 text-left">Código</th>
                        <th class="w-[100px] p-2 text-left">Fecha</th>
                        <th class="w-[100px] p-2 text-left">N° Documento</th>
                        <th class="w-[200px] p-2 text-left">Nombres</th>
                        <th class="w-[100px] p-2 text-right">Importe</th>
                        <th class="w-[100px] p-2 text-right">Cuota</th>
                        <th class="w-[100px] p-2 text-right">T.E.M</th>
                        <th class="w-[130px] p-2 text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="credito in creditos" :key="credito"
                        class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            credito.id.toString().padStart(4, '0') }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            format(new Date(credito.created_at), 'dd/MM/yyyy') }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            credito.documento }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            credito.nombre }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                            formatMoneda(credito.importe) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                            formatMoneda(credito.cuota) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                            formatMoneda(credito.tem) }} %</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                            <div class="flex space-x-2 justify-end">
                                <Button @click="getCronogramaPDF(credito.id)" icon="pi pi-print" variant="outlined"
                                    severity="info" size="small" />
                                <Button @click="confirmDelete(credito)" icon="pi pi-trash" variant="outlined"
                                    severity="danger" size="small" />
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!creditos.length">
                        <td colspan="8"
                            class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No hay
                            creditos que mostrar.</td>
                    </tr>
                </tbody>
            </table>
        </Table>
    </Panel>
    <ConfirmDialog />
    <Loading :show="isLoading" />
</template>

<script setup>
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import useCredito from '../hooks/useCredito'
import Table from '@/components/Table.vue'
import { useRouter } from 'vue-router'
import { formatMoneda } from '../../../../../lib/formatMoneda'
import { format } from 'date-fns'
import Loading from '@/components/Loading.vue'
import { useConfirm } from 'primevue'
import ConfirmDialog from 'primevue/confirmdialog';

const router = useRouter()
const confirm = useConfirm()

const {
    isLoading,
    pag,
    creditos,
    getCreditos,
    onDelete,
    resetForm,
    getCronogramaPDF
} = useCredito()

const newCredito = () => {
    resetForm()
    router.push({ name: 'creditos.create' })
}

const confirmDelete = (credito) => {
    confirm.require({
        message: `¿Está seguro de eliminar el credito ${credito.id.toString().padStart(4, '0')}?`,
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
            await onDelete(credito.id)
        },
        reject: () => {

        }
    });
};

const changePage = async (page) => {
    pag.value.page = page
    await getCreditos()
}

const changeCant = async (cant) => {
    pag.value.cant_reg = cant
    await changePage(1)
}

getCreditos()
</script>