<template>
    <div v-for="sede in sedes" :key="sede"
        class="cursor-pointer p-4 border my-2 border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        @click="selectSede(sede)">
        <h2 class="text-lg font-medium text-zinc-700 dark:text-zinc-300">{{ sede.name }}</h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ sede.direccion }}</p>
    </div>
</template>

<script setup>
import useSystem from '../hooks/useSystem';

const {
    sedes,
    getSedes,
    selectSede
} = useSystem()

getSedes()
</script>