<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GraficoEstadoCreditos :estados_total="estados_credito" />
        <GraficoDesembolsosMes :libroingresos="libroingresos" />
    </div>
    <Loading :show="isLoading" />
</template>

<script setup>
import Loading from '../../../components/Loading.vue';
import GraficoDesembolsosMes from '../modules/creditos/components/GraficoDesembolsosMes.vue';
import GraficoEstadoCreditos from '../modules/creditos/components/GraficoEstadoCreditos.vue';
import { useCrediReporte } from '../modules/creditos/hooks/useCrediReporte';

const {
    isLoading,
    libroingresos,
    getLibroIngreso,
    estados_credito,
    getEstadosCredito
} = useCrediReporte()

getEstadosCredito()
getLibroIngreso()
</script>