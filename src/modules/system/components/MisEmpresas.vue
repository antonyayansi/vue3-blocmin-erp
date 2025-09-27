<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Mis Empresas</h1>
        <div v-if="empresas.length === 0" class="text-center text-zinc-500">
            No tienes empresas asociadas.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="empresa in empresas" :key="empresa" class="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 shadow hover:shadow-lg transition">
                <h2 class="text-xl font-semibold mb-2">{{ empresa.razon_social }}</h2>
                <p class="text-zinc-600 mb-4">{{ empresa.direccion }}</p>
                <Button
                    @click="selectEmpresa(empresa)"
                    label="Ingresar"
                    size="small"
                />
            </div>
        </div>
    </div>
    <Loading :show="isLoading" />
</template>

<script setup>
import Loading from '../../../components/Loading.vue';
import useSystem from '../hooks/useSystem';
import Button from 'primevue/button';

const {
    empresas,
    isLoading,
    getEmpresas,
    selectEmpresa,
    activeEmpresa
} = useSystem()

if(!localStorage.getItem('bloc-empresa')) getEmpresas()
</script>