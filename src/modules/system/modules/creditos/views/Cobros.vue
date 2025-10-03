<template>
    <Panel header="Cobrar crédito" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
        :leave="{ opacity: 0, y: -30 }" :transition="{ duration: 0.3 }">
        <div class="mb-2">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <!-- Input -->
                <div class="w-full md:w-auto">
                    <label class="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Buscar
                        crédito</label>
                    <IconField class="w-full">
                        <InputText v-model="buscar" size="small" @keypress.enter="getCreditosByCliente()"
                            placeholder="Ingrese DNI" class="w-full md:w-auto" id="dni" />
                        <InputIcon class="cursor-pointer pi pi-search" @click="getCreditosByCliente()" />
                    </IconField>
                </div>
            </div>
        </div>
        <CardCliente v-if="cliente" :cliente="cliente" />
        <CardCreditos v-if="creditos.length" v-for="credito in creditos" :key="credito.id" :credito="credito" />
    </Panel>
    <Loading :show="isLoading" title="Cargando créditos..." />
</template>

<script setup>
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { onFocus } from '@/lib/onFocus'
import useCobro from '../hooks/useCobro'
import Loading from '@/components/Loading.vue'
import CardCliente from '../components/CardCliente.vue'
import CardCreditos from '../components/CardCreditos.vue'

const {
    buscar,
    isLoading,
    getCreditosByCliente,
    creditos,
    cliente
} = useCobro()

setTimeout(() => {
    onFocus('dni')
}, 300);
</script>