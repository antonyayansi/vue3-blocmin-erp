<template>
    <Panel header="Libro de Ingresos" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
        :leave="{ opacity: 0, y: -30 }" :transition="{ duration: 0.3 }">
        <div class="">
            <div class="mb-2">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <!-- Input -->
                    <div class="w-full md:w-auto">
                        <IconField class="w-full">
                            <InputIcon @click="searchReporte()" class="pi pi-search" />
                            <InputText v-model="buscar" size="small" @keyup="searchReporte()" placeholder="Buscar..."
                                class="w-full md:w-auto" />
                        </IconField>
                    </div>

                    <!-- Botón -->
                    <div class="w-full flex justify-end md:w-auto">
                        <Button @click="getLibroIngreso(true)" label="Exportar" icon="pi pi-file-excel"
                            severity="success" size="small" class="" />
                    </div>
                </div>
            </div>
            <Table :total="0" :cant_reg="10" :nro_pag="1">
                <table class="prov-id w-full table-fixed xxl:table-auto">
                    <thead>
                        <tr
                            class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                            <th class="w-[100px] p-2 text-left">Fecha</th>
                            <th class="w-[100px] p-2 text-left">N° Documento</th>
                            <th class="w-[200px] p-2 text-left">Nombres</th>
                            <th class="w-[100px] p-2 text-right">Monto</th>
                            <th class="w-[100px] p-2 text-right">Total Cuotas</th>
                            <th class="w-[100px] p-2 text-right">Cuotas Pagadas</th>
                            <th class="w-[100px] p-2 text-right">Monto Cuota</th>
                            <th class="w-[100px] p-2 text-right">Saldo Capital</th>
                            <th class="w-[100px] p-2 text-right">Interes</th>
                            <th class="w-[100px] p-2 text-right">Saldo Pagado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="credito in libroingresos_filtrado" :key="credito"
                            class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                format(new Date(credito.Fecha_Desembolso), 'dd/MM/yyyy') }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                credito?.DNI }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                credito.Nombre }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                                formatMoneda(credito.Monto) }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                credito.Total_Cuotas }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                credito.Cuotas_Pagadas }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                formatMoneda(credito.Monto_Cuota) }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                formatMoneda(credito.Saldo_Capital) }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                formatMoneda(credito.Interes) }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                formatMoneda(credito.Saldo_Pagado) }}</td>
                        </tr>
                        <tr v-if="!libroingresos.length">
                            <td colspan="10"
                                class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No hay
                                creditos que mostrar.</td>
                        </tr>
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

const {
    isLoading,
    getLibroIngreso,
    libroingresos,
    libroingresos_filtrado,
    buscar,
    searchReporte
} = useCrediReporte()

getLibroIngreso()

</script>