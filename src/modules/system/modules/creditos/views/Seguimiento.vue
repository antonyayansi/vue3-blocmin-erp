<template>
    <Panel header="Seguimiento de crédito" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
        :leave="{ opacity: 0, y: -30 }" :transition="{ duration: 0.3 }">
        <div class="">
            <div class="mb-2">
                <div class="mb-2 w-full md:w-1/3 xl:w-1/4">
                    <label class="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">Modo de
                        pago</label>
                    <Select v-model="pag.modo_pago" :options="[
                        { codigo: 'diario', descripcion: 'Diario' },
                        { codigo: 'mensual', descripcion: 'Mensual' },
                        { codigo: 'semanal', descripcion: 'Semanal' },
                        { codigo: 'quincenal', descripcion: 'Quincenal' },
                    ]" mode="offline" id="modo_pago" @selected="changePage(1)" />
                </div>
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
                        <Button @click="exportSeguimientoCredito()" label="Exportar" icon="pi pi-file-excel"
                            severity="success" size="small" class="" />
                    </div>
                </div>
            </div>
            <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @changePage="changePage">
                <table class="prov-id w-full table-fixed xxl:table-auto">
                    <thead>
                        <tr
                            class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                            <th class="w-[200px] p-2 text-left">Nombres</th>
                            <th class="w-[100px] p-2 text-left">Fecha Venc.</th>
                            <th class="w-[70px] p-2 text-left">Dia</th>
                            <th class="w-[90px] p-2 text-left">Tipo</th>
                            <th class="w-[100px] p-2 text-right">Cuota</th>
                            <th class="w-[100px] p-2 text-right">Cuotas Pagadas</th>
                            <th class="w-[100px] p-2 text-right">Cuota Pendientes</th>
                            <th class="w-[100px] p-2 text-right">Dias atraso</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="credito in seguimientos" :key="credito"
                            class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                credito?.nombre }}
                                <span class="block text-xs font-light text-zinc-500 dark:text-zinc-400">{{
                                    credito?.documento }}</span>
                            </td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                format(new Date(`${credito.fecha_vencimiento} 00:00:00`), 'dd/MM/yyyy') }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                credito.dia_pago }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                credito.modo_pago }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                                formatMoneda(credito.cuota) }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                credito.cuotas_pagadas }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                credito.cuotas_pendientes }}</td>
                            <td :class="credito.dias_retraso < 0 ? 'text-red-500 font-bold' : 'text-zinc-700 dark:text-zinc-300'"
                                class="px-2 py-1 text-right">{{
                                    credito.dias_retraso }}</td>
                        </tr>
                        <!-- <tr v-if="!seguimientos.length">
                            <td colspan="10"
                                class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No hay
                                creditos que mostrar.</td>
                        </tr> -->
                    </tbody>
                </table>
            </Table>
        </div>
    </Panel>
    <Loading :show="isLoading" />
</template>

<script setup>
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { useCrediReporte } from '../hooks/useCrediReporte';
import Table from '@/components/Table.vue';
import { format } from 'date-fns';
import { formatMoneda } from '../../../../../lib/formatMoneda';
import Loading from '../../../../../components/Loading.vue';
import Select from '../../../../../components/Select.vue'

const {
    isLoading,
    pag_seguimiento: pag,
    getSeguimientoCredito,
    seguimientos,
    exportSeguimientoCredito
} = useCrediReporte();

const changePage = async (page) => {
    pag.value.page = page;
    await getSeguimientoCredito();
}

getSeguimientoCredito()
</script>