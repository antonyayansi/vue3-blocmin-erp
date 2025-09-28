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
                <label
                    :class="new_credito.tem <= 0 ? 'text-xs font-medium text-red-500' : 'text-xs font-medium text-gray-700 dark:text-gray-300'">T.E.A.</label>
                <InputText disabled="" v-model="new_credito.tea" @keyup="calcularTEM" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label
                    :class="new_credito.tem <= 0 ? 'text-xs font-medium text-red-500' : 'text-xs font-medium text-gray-700 dark:text-gray-300'">T.E.M.</label>
                <InputText v-model="new_credito.tem" @keyup="calcularTEA" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Importe</label>
                <InputText v-model="new_credito.importe" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">N° Cuotas</label>
                <InputText v-model="new_credito.nro_cuotas" @keyup="keyTasaEAandEM()" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Cuota Fija</label>
                <InputText v-model="new_credito.cuota_definida" @keyup="keyTasaEAandEM()" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Comisión total</label>
                <InputText v-model="new_credito.comision" size="small" />
            </div>
            <div class="col-span-2 md:col-span-1 flex flex-col space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tipo Pago</label>
                <Select v-model="new_credito.modo_pago" :options="[
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
        <div class="mt-2 flex space-x-2 items-center justify-start">
            <Button @click="generateCuotas" label="Calcular cuotas" severity="info" size="small"
                icon="pi pi-calendar" />
            <Button v-if="new_credito.cuotas.length" @click="generateCuotas" label="Guardar credito" severity="success"
                size="small" icon="pi pi-save" />
        </div>

        <div v-if="new_credito.cuotas.length" class="mt-4">
            <Table :total="0" :cant_reg="10" :nro_pag="1">
                <table class="prov-id w-full table-fixed xxl:table-auto">
                    <thead>
                        <tr
                            class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                            <th class="w-[50px] p-2 text-left">Nro</th>
                            <th class="w-[100px] p-2 text-left">Día</th>
                            <th class="w-[100px] p-2 text-left">Fecha</th>
                            <th class="w-[100px] p-2 text-right">Saldo</th>
                            <th class="w-[100px] p-2 text-right">Capital</th>
                            <th class="w-[100px] p-2 text-right">Interés</th>
                            <th class="w-[100px] p-2 text-right">Comisión</th>
                            <th class="w-[100px] p-2 text-right">Cuota</th>
                            <!-- <th class="w-[130px] p-2 text-right"></th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cuota in new_credito.cuotas" :key="cuota"
                            class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                cuota.cuota_nro }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                cuota.cuota_dia }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                                cuota.cuota_fecha }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                cuota.cuota_saldo }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                cuota.cuota_capital }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                cuota.cuota_interes }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right">{{
                                cuota.cuota_comision }}</td>
                            <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 font-bold text-right">{{
                                cuota.cuota_total }}</td>
                        </tr>
                        <tr v-if="!new_credito.cuotas.length">
                            <td colspan="7"
                                class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No
                                hay
                                cajas</td>
                        </tr>
                    </tbody>
                </table>
            </Table>
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
import Table from '@/components/Table.vue';

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
    new_credito.value.tea = TEA.toFixed(2);
}

const calcularTEM = () => {
    const TEA = new_credito.value.tea;
    const TEM = (Math.pow((1 + (TEA / 100)), 1 / 12) - 1) * 100
    new_credito.value.tem = TEM.toFixed(2);
}

const keyTasaEAandEM = () => {
    if (!new_credito.value.nro_cuotas || !new_credito.value.cuota_definida) {
        new_credito.value.tem = 0;
        new_credito.value.tea = 0;
        return
    }
    //calcular tem solo con nro de cuotas y cuota definida
    let cuota_definida = new_credito.value.cuota_definida;
    let nro_cuotas = new_credito.value.nro_cuotas;
    let importe = new_credito.value.importe;

    if (cuota_definida > 0 && nro_cuotas > 0 && importe > 0) {
        let tem = (((cuota_definida * nro_cuotas) / importe) - 1) * 100;
        new_credito.value.tem = tem.toFixed(4);
        calcularTEA();
    }

}

getClientes()
</script>