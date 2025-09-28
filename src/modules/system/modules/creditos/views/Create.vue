<template>
    <div class="flex space-x-2 items-center">
        <Button icon="pi pi-arrow-left" label="Volver" severity="secondary" size="small" @click="$router.go(-1)" />
    </div>
    <Panel v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }" :leave="{ opacity: 0, y: -30 }"
        class="mt-2" :transition="{ duration: 0.3 }" toggleable :collapsed="!openPanel">
        <template #header>
            <div @click="openPanel = !openPanel" class="w-full font-bold flex items-center space-x-2 cursor-pointer">
                <i class="pi pi-money-bill" />
                <span>{{ new_credito.id ? 'Editar Credito' : 'Nuevo Credito' }}</span>
            </div>
        </template>
        <div class="grid grid-cols-4 gap-2">
            <div class="col-span-4 md:col-span-2 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Cliente</label>
                <Select v-model="new_credito.clientes_id" :options="comboClientes" mode="offline"
                    placeholder="Seleccione un cliente" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">T.E.A. (%)</label>
                <InputText v-model="new_credito.tea" @keyup="calcularTEM" size=" small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">T.E.M. (%)</label>
                <InputText v-model="new_credito.tem" @keyup="calcularTEA" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Importe</label>
                <InputText v-model="new_credito.importe" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">N° Cuotas</label>
                <InputText v-model="new_credito.nro_cuotas" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Cuota Fija</label>
                <InputText v-model="new_credito.cuota_definida" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Comisión total</label>
                <InputText v-model="new_credito.comision" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tipo Pago</label>
                <Select v-model="new_credito.tipo_pago" :options="[
                    { descripcion: 'Diario', codigo: 'diario' },
                    { descripcion: 'Semanal', codigo: 'semanal' },
                    { descripcion: 'Quincenal', codigo: 'quincenal' },
                    { descripcion: 'Mensual', codigo: 'mensual' },
                ]" mode="offline" placeholder="Seleccione un tipo de pago" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Primer pago</label>
                <InputText v-model="new_credito.fecha_primer_pago" size="small" type="date" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Aporte</label>
                <InputText v-model="new_credito.aporte" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Ahorro</label>
                <InputText v-model="new_credito.ahorro" size="small" />
            </div>
        </div>
        <div class="mt-2 flex justify-start">
            <Button @click="generateCuotas" label="Calcular cuotas" size="small" icon="pi pi-calendar" />
        </div>
    </Panel>
    <Loading :show="isLoading" />
</template>

<script setup>
import Button from 'primevue/button'
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import useCredito from '../hooks/useCredito';
import Select from '@/components/Select.vue';
import Loading from '@/components/Loading.vue';

const {
    openPanel,
    new_credito,
    getClientes,
    isLoading,
    comboClientes,
    generateCuotas
} = useCredito();

const calcularTEA = () => {
    const TEM = new_credito.value.tem;
    const TEA = (Math.pow((1 + (TEM / 100)), 12) - 1) * 100
    new_credito.value.tea = TEA;
}

const calcularTEM = () => {
    const TEA = new_credito.value.tea;
    const TEM = (Math.pow((1 + (TEA / 100)), 1 / 12) - 1) * 100
    new_credito.value.tem = TEM;
}

getClientes()
</script>