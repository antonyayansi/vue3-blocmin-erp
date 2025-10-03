<template>
    <div
        class="mt-4 border border-t-4 border-t-primary-500 dark:border-t-primary-500 border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md hover:shadow-lg transition-shadow duration-200">
        <h1 class="font-bold">S/. {{ credito?.importe }}</h1>
        <div :class="colorMap[credito?.estado] || 'text-gray-500'" class="flex items-center space-x-2 mt-2">
            <span class="font-medium text-sm">{{ credito?.estado == 'pagado' ? 'Pagado' : 'En proceso de pago'
                }}</span>
            <i v-if="credito?.estado != 'pagado'" class="pi pi-clock" />
            <i v-else class="pi pi-check-circle" />
        </div>
        <div class="mt-2 flex justify-start">
            <Button @click="getCuotas" variant="text" :label="openCuotas ? 'Ocultar cuotas' : 'Ver cuotas'"
                icon="pi pi-calendar" size="small" />
        </div>
        <div v-if="openCuotas" class="mt-2">
            <div class="flex justify-end mb-2">
                <Button @click="onOpenPagar()" label="Pagar cuotas" size="small" severity="success" />
            </div>
            <Table :total="0" :cant_reg="10" :nro_pag="1">
                <table class="prov-id w-full table-fixed xxl:table-auto">
                    <thead>
                        <tr
                            class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                            <th class="w-[70px] p-2 text-center">Nro</th>
                            <th class="w-[60px] p-2 text-left">Dia</th>
                            <th class="w-[100px] p-2 text-left">F. Vencimiento</th>
                            <th class="w-[150px] p-2 text-left">Observaciones</th>
                            <th class="w-[100px] p-2 text-right">Cuota</th>
                            <th class="w-[100px] p-2 text-left">Estado</th>
                            <th class="w-[100px] p-2 text-left">F. Pago</th>
                            <th class="w-[130px] p-2 text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cuota in cuotas" :key="cuota"
                            class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-center">
                                <CheckBox v-if="cuota.estado !== 'pagado'" v-model="cuota.checked" binary
                                    size="small" />
                                {{ cuota.numero_cuota }}
                            </td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                cuota.dia }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                format(new Date(`${cuota.fecha_vencimiento} 00:00:00`), 'dd/MM/yyyy') }}</td>
                            <td :class="cuota.observacion.includes('Vencido') ? 'text-red-500' : 'text-zinc-700 dark:text-zinc-300'"
                                class="px-2 py-1 font-light">{{
                                    cuota.observacion }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                                formatMoneda(cuota.cuota) }}</td>
                            <td :class="colorMap[cuota?.estado] || 'text-zinc-700 dark:text-zinc-300'"
                                class="px-2 py-1 text-left">{{
                                    cuota?.estado == 'pagado' ? 'Pagado' : 'Pendiente' }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                cuota.fecha_pago ? format(new Date(`${cuota.fecha_pago} 00:00:00`), 'dd/MM/yyyy') : ''
                            }}
                            </td>
                            <td v-if="cuota.estado == 'pagado'" class="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                                <div class="flex space-x-2 justify-end">
                                    <Button v-tooltip.top="'Imprimir recibo'" @click="getCronogramaPDF(credito.id)"
                                        icon="pi pi-print" variant="outlined" severity="info" size="small" />
                                    <Button @click="confirmDelete(credito)" icon="pi pi-trash" variant="outlined"
                                        severity="danger" size="small" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import useCobro from '../hooks/useCobro'
import CheckBox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Table from '../../../../../components/Table.vue'
import { formatMoneda } from '../../../../../lib/formatMoneda'
import { format } from 'date-fns'
import { toast } from 'vue-sonner'
import Decimal from 'decimal.js-light'

const openCuotas = ref(false)
const cuotas = ref([])

const {
    getCuotasByCredito,
    openModalPagar,
    new_pago
} = useCobro()

const colorMap = {
    'aprobado': 'dark:text-yellow-500 text-yellow-600',
    'pagado': 'text-green-500',
    'pendiente': 'dark:text-yellow-500 text-yellow-600',
}

const props = defineProps({
    credito: {
        type: Object,
        required: true
    },
})

const getCuotas = async () => {
    if (openCuotas.value) {
        openCuotas.value = false;
        return;
    }
    cuotas.value = await getCuotasByCredito(props.credito.id);
    openCuotas.value = true;
}

const onOpenPagar = () => {

    const cuotasSeleccionadas = cuotas.value.filter(c => c.checked);
    if (cuotasSeleccionadas.length === 0) {
        toast.error('Seleccione al menos una cuota para pagar.');
        return;
    }

    openModalPagar.value = true;
    new_pago.value.creditos_id = props.credito.id;
    new_pago.value.cuotas = cuotasSeleccionadas;
    new_pago.value.ahorros = new Decimal(props.credito.ahorro).toNumber();
    new_pago.value.total = cuotasSeleccionadas.reduce((acc, cuota) => acc + new Decimal(cuota.cuota).toNumber(), 0);
    new_pago.value.gastos = cuotasSeleccionadas.reduce((acc, cuota) => acc + new Decimal(cuota.gastos).toNumber(), 0);
}
</script>