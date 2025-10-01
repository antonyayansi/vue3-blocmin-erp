<template>
    <Panel header="Autorizar desembolso" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
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
                    <Select :options="[
                        { codigo: 'pendiente', descripcion: 'Pendientes' },
                        { codigo: 'aprobado', descripcion: 'Aprobados' },
                    ]" mode="offline" v-model="pag.estado" @selected="changePage(1)" />
                </div>
            </div>
        </div>
        <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @changePage="changePage" :cantidad="true"
            @changeCant="changeCant">
            <table class="prov-id w-full table-fixed xxl:table-auto">
                <thead>
                    <tr class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                        <th class="w-[70px] p-2 text-left">Código</th>
                        <th class="w-[100px] p-2 text-left">Fecha</th>
                        <th class="w-[150px] p-2 text-left">Nombres</th>
                        <th class="w-[100px] p-2 text-right">Importe</th>
                        <th class="w-[100px] p-2 text-right">Cuota</th>
                        <th class="w-[100px] p-2 text-right">T.E.M</th>
                        <th class="w-[100px] p-2 text-center">Estado</th>
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
                            credito.nombre }}
                            <p class="text-xs text-zinc-500">{{ credito.documento }}</p>
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                            formatMoneda(credito.importe) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                            formatMoneda(credito.cuota) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                            formatMoneda(credito.tem) }} %</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-center">
                            <Tag :value="credito.estado == 'aprobado' ? 'Aprobado' : 'Pendiente'"
                                :severity="credito.estado == 'aprobado' ? 'success' : 'warn'" size="small" />
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                            <div v-if="credito.estado == 'pendiente'" class="flex space-x-2 justify-end">
                                <Button @click="getCronogramaPDF(credito.id)" icon="pi pi-print" variant="outlined"
                                    severity="info" size="small" />
                                <Button @click="openAutorizacion(credito, 'Aprobacion')" icon="pi pi-check-circle"
                                    variant="outlined" severity="success" size="small" />
                                <Button @click="openAutorizacion(credito, 'Rechazo')" icon="pi pi-times"
                                    variant="outlined" severity="danger" size="small" />
                            </div>
                            <div v-else class="flex space-x-2 justify-end">
                                <Button @click="getCronogramaPDF(credito.id)" icon="pi pi-print" variant="outlined"
                                    severity="info" size="small" />
                                <Button v-tooltip.top="'Imprimir DJ y Pagaré'" @click="onPrintDjAndPagare(credito.id)"
                                    icon="pi pi-file-check" variant="outlined" severity="success" size="small" />
                                <Button @click="openAutorizacion(credito, 'Rechazo')" icon="pi pi-trash"
                                    variant="outlined" severity="danger" size="small" />
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
    <Loading :show="isLoading" />
    <Loading :show="isLoadingPrint" />
    <Dialog v-model:visible="openModal" modal :header="new_autorizacion?.tipo"
        :style="{ width: '100vw', maxWidth: '600px' }">
        {{ new_autorizacion?.tipo ? '¿Está seguro de ' + (new_autorizacion?.tipo == 'Aprobacion' ? 'aprobar' :
            'rechazar') + ' el desembolso?' : '' }}
        <div v-if="new_autorizacion?.tipo == 'Aprobacion'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 mb-1">Tipo de credito</label>
            <Select v-model="new_autorizacion.tipo_credito" :options="tipo_credito" mode="offline"
                placeholder="Seleccione un tipo de crédito" />
        </div>
        <div class="mt-4">
            <p>N° Crédito: <strong>{{ new_autorizacion?.id.toString().padStart(4, '0') }}</strong></p>
            <p>Cliente: <strong>{{ new_autorizacion?.nombre }}</strong></p>
            <p>Importe: <strong>{{ formatMoneda(new_autorizacion?.importe) }}</strong></p>
            <p>T.E.M.: <strong>{{ new_autorizacion?.tem }}%</strong></p>
            <p>N° Cuotas: <strong>{{ new_autorizacion?.nro_cuotas }}</strong></p>
            <p>Cuota: <strong>{{ formatMoneda(new_autorizacion?.cuota) }}</strong></p>
            <Button @click="getCronogramaPDF(new_autorizacion?.id)" label="Ver cronograma" icon="pi pi-print"
                severity="info" size="small" class="mt-2" variant="link" />
        </div>
        <div class="mt-4 flex justify-start space-x-2">
            <Button @click="onAutorizacion()" :label="new_autorizacion?.tipo == 'Aprobacion' ? 'Autorizar' : 'Rechazar'"
                icon="pi pi-check-circle" :severity="new_autorizacion?.tipo == 'Aprobacion' ? 'success' : 'danger'"
                size="small" />
        </div>
    </Dialog>
</template>

<script setup>
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'
import useAutorizacion from '../hooks/useAutorizacion';
import Table from '@/components/Table.vue'
import Loading from '@/components/Loading.vue'
import Tag from 'primevue/tag'
import Select from '@/components/Select.vue'
import { format } from 'date-fns'
import { formatMoneda } from '@/lib/formatMoneda'
import useCredito from '../hooks/useCredito'

const {
    getCronogramaPDF,
    isLoading: isLoadingPrint
} = useCredito()

const {
    isLoading,
    getCreditos,
    pag,
    creditos,
    openModal,
    new_autorizacion,
    tipo_credito,
    onAutorizacion,
    onPrintDjAndPagare
} = useAutorizacion()

const openAutorizacion = (credito, tipo = 'Aprobacion') => {
    new_autorizacion.value = credito
    new_autorizacion.value.tipo = tipo
    new_autorizacion.value.tipo_credito = tipo_credito.value[0]?.codigo || null
    openModal.value = true
}

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