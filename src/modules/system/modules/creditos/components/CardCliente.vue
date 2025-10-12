<template>
    <div
        class="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md hover:shadow-lg transition-shadow duration-200">
        <!-- Header -->
        <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                {{ cliente.nombre }}
            </h2>
            <!-- Score Badge -->
            <div v-if="score" class="flex items-center space-x-2">
                <div class="flex flex-col items-end">
                    <span class="text-xs text-zinc-500 dark:text-zinc-400">Score de crédito</span>
                    <div class="flex items-center space-x-1">
                        <span class="text-xs font-medium mr-1" :class="{
                            'text-blue-600': score.score >= 750,
                            'text-green-600': score.score >= 600 && score.score < 750,
                            'text-yellow-600': score.score >= 450 && score.score < 600,
                            'text-red-600': score.score < 450
                        }">
                            {{ score.score >= 750 ? 'Excelente' :
                                score.score >= 600 ? 'Bueno' :
                                    score.score >= 450 ? 'Regular' : 'Malo' }}
                        </span>
                        <span class="text-sm font-bold" :class="{
                            'text-blue-600': score.score >= 750,
                            'text-green-600': score.score >= 600 && score.score < 750,
                            'text-yellow-600': score.score >= 450 && score.score < 600,
                            'text-red-600': score.score < 450
                        }">
                            {{ score.score }}
                        </span>
                        <i class="pi pi-circle-fill text-xs" :class="{
                            'text-blue-600': score.score >= 750,
                            'text-green-600': score.score >= 600 && score.score < 750,
                            'text-yellow-600': score.score >= 450 && score.score < 600,
                            'text-red-600': score.score < 450
                        }"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información en grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <!-- Documento -->
            <div class="flex items-center space-x-2">
                <i class="pi pi-id-card text-blue-500 w-4"></i>
                <span class="text-zinc-600 dark:text-zinc-300 truncate">{{ cliente.documento }}</span>
            </div>

            <!-- Teléfono -->
            <div class="flex items-center space-x-2">
                <i class="pi pi-phone text-green-500 w-4"></i>
                <span class="text-zinc-600 dark:text-zinc-300 truncate">{{ cliente.telefono }}</span>
            </div>

            <!-- Email -->
            <div class="flex items-center space-x-2 sm:col-span-2">
                <i class="pi pi-envelope text-purple-500 w-4"></i>
                <span class="text-zinc-600 dark:text-zinc-300 truncate">{{ cliente.email }}</span>
            </div>

            <!-- Dirección Personal -->
            <div class="flex items-center space-x-2 sm:col-span-2">
                <i class="pi pi-home text-orange-500 w-4"></i>
                <span class="text-zinc-600 dark:text-zinc-300 truncate">{{ cliente.direccion }}</span>
            </div>

            <!-- Dirección Laboral -->
            <div v-if="cliente.direccion_laboral" class="flex items-center space-x-2 sm:col-span-2">
                <i class="pi pi-building text-green-500 w-4"></i>
                <span class="text-zinc-600 dark:text-zinc-300 truncate">{{ cliente.direccion_laboral }}</span>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="openModalPagar" modal :header="'Pagar cuotas'" :style="{ width: '700px' }"
        :breakpoints="{ '960px': '90vw', '640px': '100vw' }">
        <div class="mb-4 font-mono text-sm bg-green-500/20 rounded-xl p-4 text-green-700 dark:text-green-300">
            <h1 class="text-xl font-bold">S/. {{ formatMoneda(totalPagar) }}</h1>
            ------------------
            <p>Se van a pagar <strong>{{ new_pago.cuotas.length }}</strong> cuota(s)</p>
            <p>Gastos: <strong>{{ formatMoneda(new_pago.gastos) }}</strong></p>
            <p>Interes: <strong :class="new_pago.menos_interes > 0 ? 'line-through' : ''">{{
                formatMoneda(new_pago.interes) }}</strong><Button class="ml-2"
                    :label="new_pago.menos_interes > 0 ? 'Mantenes interes' : 'Quitar interes'" size="small"
                    variant="text" :severity="new_pago.menos_interes == 0 ? 'danger' : 'info'"
                    @click="toggleInteres()" /></p>
            <p>Ahorros: <strong>{{ new_pago.ahorros ? formatMoneda(new_pago.ahorros) : '' }}</strong></p>
            ------------------
            <p>Monto adicional: <strong>{{ new_pago.monto_adicional ? formatMoneda(new_pago.monto_adicional) : ''
            }}</strong>
            </p>
            <p class="text-red-600 dark:text-red-400 font-bold" v-if="new_pago.dias_vencidos > 0">({{
                new_pago.dias_vencidos }} días
                vencidos, S/. {{
                    formatMoneda(new_pago.monto_x_dias)
                }} por días)</p>
        </div>
        <div class="grid grid-cols-4 gap-2">
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Monto adicional
                </label>
                <InputText v-model="new_pago.monto_adicional" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Metodo</label>
                <Select v-model="new_pago.tipo_pago" :options="[
                    { codigo: 'efectivo', descripcion: 'Efectivo' },
                    { codigo: 'tarjeta', descripcion: 'Tarjeta' },
                ]" mode="offline" id="clientes_id" @selected="onFocus('importe')"
                    placeholder="Seleccione un cliente" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Ahorros
                </label>
                <InputText disabled="" v-model="new_pago.ahorros" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Gastos
                </label>
                <InputText disabled="" v-model="new_pago.gastos" size="small" />
            </div>
            <div class="col-span-4 text-xs text-zinc-500">
                <p>Si es un descuento, ingrese un monto negativo</p>
            </div>
            <div class="col-span-4 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Observacion
                </label>
                <InputText v-model="new_pago.observacion" fluid size="small" />
            </div>
        </div>
        <Button label="Confirmar pago" icon="pi pi-check" class="mt-4" @click="onPagar()" severity="success" />
    </Dialog>
    <ConfirmDialog />
</template>

<script setup>
import { computed } from 'vue';
import useCobro from '../hooks/useCobro';
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Select from '../../../../../components/Select.vue';
import { formatMoneda } from '../../../../../lib/formatMoneda';
import Decimal from 'decimal.js-light';

const {
    openModalPagar,
    onPagarCuotas,
    new_pago,
    score,
    isLoading
} = useCobro()

const props = defineProps({
    cliente: {
        type: Object,
        required: true
    },
})

const safeNumber = (val) => {
    const n = parseFloat(val)
    return isNaN(n) ? 0 : n
}

const totalPagar = computed(() => {
    let total = new Decimal(
        Array.isArray(new_pago.value.cuotas)
            ? new_pago.value.cuotas.reduce((acc, cuota) => acc + safeNumber(cuota.cuota), 0)
            : 0
    );
    const montoAdicional = safeNumber(new_pago.value.monto_adicional);
    total = total.plus(montoAdicional);
    total = total.minus(new_pago.value.menos_interes || 0);
    return total.toNumber();
})

const toggleInteres = () => {
    if (new_pago.value.menos_interes > 0) {
        new_pago.value.menos_interes = 0
    } else {
        new_pago.value.menos_interes = new_pago.value.interes
    }
}

const onPagar = async () => {
    onPagarCuotas()
}
</script>