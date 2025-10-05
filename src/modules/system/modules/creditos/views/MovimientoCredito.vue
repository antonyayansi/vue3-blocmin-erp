<template>
    <Panel header="Movimientos de Crédito" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
        :leave="{ opacity: 0, y: -30 }" :transition="{ duration: 0.3 }">
        <div class="mb-2">
            <div class="flex flex-row items-center gap-2">
                <!-- Input -->
                <div class="w-full md:w-auto">
                    <InputText v-model="pag.fecha_inicio" type="date" size="small" @change="changePage(1)"
                        placeholder="Buscar..." class="w-full md:w-auto" />
                </div>
                <div class="w-full md:w-auto">
                    <InputText v-model="pag.fecha_fin" type="date" size="small" @change="changePage(1)"
                        placeholder="Buscar..." class="w-full md:w-auto" />
                </div>
            </div>
        </div>
        <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @changePage="changePage" :cantidad="true"
            @changeCant="changeCant">
            <table class="prov-id w-full table-fixed xxl:table-auto">
                <thead>
                    <tr class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                        <th class="w-[100px] p-2 text-left">Fecha</th>
                        <th class="w-[200px] p-2 text-left">Cliente</th>
                        <th class="w-[100px] p-2 text-right">Pago</th>
                        <th class="w-[100px] p-2 text-right">Penalidad</th>
                        <th class="w-[100px] p-2 text-left">Estado</th>
                        <th class="w-[100px] p-2 text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pago in movimientos" :key="pago"
                        class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            format(new Date(pago.fecha), 'dd/MM/yyyy') }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            pago.nombre }}
                            <p class="text-xs font-light text-zinc-500 dark:text-zinc-400">DNI: {{
                                pago.documento }}</p>
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                            formatMoneda(pago.pago) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                            formatMoneda(pago.monto_adicional) }}</td>
                        <td v-tooltip.top="`Venc: ${format(new Date(`${pago.fecha_vencimiento} 00:00:00`), 'dd/MM/yyyy')}\nPago: ${format(new Date(`${pago.fecha_pago} 00:00:00`), 'dd/MM/yyyy')}`"
                            class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-left">
                            <span v-if="pago.isAtrasado"
                                class="text-xs font-semibold text-red-600 dark:text-red-400">Atrasado
                                ({{ pago.diasAtraso }} días)</span>
                            <span v-else class="text-xs font-semibold text-green-600 dark:text-green-400">Al Día</span>
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                            <div class="flex space-x-2 justify-end">
                                <Button @click="onPrintCobro(pago.detallecredito_id, pago.nro_recibo)"
                                    icon="pi pi-print" variant="outlined" severity="info" size="small" />
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!movimientos.length">
                        <td colspan="6"
                            class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No hay
                            pagos que mostrar.</td>
                    </tr>
                </tbody>
            </table>
        </Table>
    </Panel>
    <Loading :show="isLoading" title="Cargando..." />
    <Loading :show="isLoadingCobro" title="Cargando..." />
</template>

<script setup>
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import Table from '@/components/Table.vue'
import Button from 'primevue/button'
import { useCrediReporte } from '../hooks/useCrediReporte'
import { formatMoneda } from '../../../../../lib/formatMoneda'
import { format } from 'date-fns'
import Loading from '../../../../../components/Loading.vue'
import useCobro from '../hooks/useCobro'

const {
    onPrintCobro,
    isLoading: isLoadingCobro
} = useCobro()

const {
    pag,
    getMovimientosCredito,
    movimientos,
    isLoading
} = useCrediReporte()

const changePage = async (page) => {
    pag.value.page = page
    await getMovimientosCredito()
}

const changeCant = async (cant) => {
    pag.value.cant_reg = cant
    await changePage(1)
}
</script>