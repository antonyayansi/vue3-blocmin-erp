<template>
    <div>
        <div class="flex items-center">
            <Button @click="$router.back()" label="Regresar" icon="pi pi-arrow-left" variant="text" size="small"
                class="mr-2" />
        </div>
        <Panel class="mt-2" :header="new_sede?.id ? 'Actualizar sede' : 'Crear nueva sede'">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">General</Tab>
                    <Tab value="1">Detalles</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <form @submit.prevent="store()">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-600 dark:text-zinc-300  ">
                                        Nombre de sede
                                    </label>
                                    <InputText v-model="new_sede.name" fluid placeholder="Nombre de sede" size="small"
                                        required type="text" />
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-600 dark:text-zinc-300  ">
                                        Dirección
                                    </label>
                                    <InputText v-model="new_sede.direccion" fluid placeholder="Dirección" size="small"
                                        required type="text" />
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-600 dark:text-zinc-300  ">
                                        Teléfono
                                    </label>
                                    <InputText v-model="new_sede.telefono" inputmode="numeric" fluid
                                        placeholder="Teléfono" size="small" type="text" />
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-600 dark:text-zinc-300  ">
                                        Correo electrónico
                                    </label>
                                    <InputText v-model="new_sede.email" fluid placeholder="Email" size="small"
                                        type="email" />
                                </div>
                            </div>
                            <div class="flex py-2 w-full justify-end items-center space-x-2">
                                <Button :disabled="isLoading" size="small" type="submit" label="Guardar"
                                    icon="pi pi-save" />
                            </div>
                        </form>
                    </TabPanel>
                    <TabPanel value="1">
                        <div>
                            <form @submit.prevent="storeSerie()" class="w-full flex flex-wrap">
                                <div class="w-full md:w-1/2 pr-0 md:pr-2 space-y-1 py-1">
                                    <label class="block text-xs text-gray-700 dark:text-zinc-300  ">
                                        Tipo de documento
                                    </label>
                                    <select v-model="new_serie.tipo_documento" required
                                        class="w-full outline-none p-2 bg-white dark:bg-zinc-950 dark:border-zinc-700 dark:text-zinc-200 rounded-md focus:ring-1 focus:ring-primary-500 border border-zinc-200 ">
                                        <option v-for="tipo in tipo_docs" :key="tipo" :value="`${tipo.id}`">{{ tipo.name
                                            }}</option>
                                    </select>
                                </div>
                                <div class="w-full md:w-1/2 space-y-1 py-1">
                                    <label class="block text-xs text-gray-700 dark:text-zinc-300  ">
                                        Serie
                                    </label>
                                    <InputText v-model="new_serie.serie" fluid size="small" />
                                </div>
                                <div class="w-full flex py-2 justify-end">
                                    <Button :disabled="isLoading" size="small" type="submit" label="Agregar"
                                        icon="pi pi-plus" />
                                </div>
                            </form>
                            <div class="mt-2 ">
                                <table class="w-full">
                                    <thead>
                                        <tr>
                                            <th
                                                class="bg-white px-2 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300   text-left border-b dark:border-zinc-700 py-2">
                                                Tipo de documento</th>
                                            <th
                                                class="bg-white px-2 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300   text-left border-b dark:border-zinc-700 py-2">
                                                Serie</th>
                                            <th
                                                class="bg-white px-2 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300    border-b dark:border-zinc-700 py-2">
                                                Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="serie in series" :key="serie.id">
                                            <td class="text-gray-700 dark:text-zinc-300 p-2  ">
                                                {{tipo_docs.find(tipo => tipo.id == serie.tipo_documento).name}}
                                            </td>
                                            <td class="text-gray-700 dark:text-zinc-300 p-2  ">{{ serie.serie
                                                }}</td>
                                            <td class="text-gray-700 dark:text-zinc-300 p-2   text-center">
                                                <button @click="destroySerie(serie.id)"
                                                    class="text-red-500 hover:text-red-700  ">
                                                    <i class="pi pi-trash" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Panel>
        <Loading :show="isLoading" title="Guardando..." />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useSede from '../hooks/useSede';
import { Button, Panel } from 'primevue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import Loading from '@/components/Loading.vue';

const tipo_docs = ref([
    {
        id: '01',
        name: 'Factura'
    },
    {
        id: '03',
        name: 'Boleta de venta'
    },
    {
        id: '07',
        name: 'Nota de crédito'
    },
    {
        id: '08',
        name: 'Nota de débito'
    },
    {
        id: '09',
        name: 'Guía de remisión remitente'
    }
])

const {
    new_sede,
    sede_id,
    step,
    isLoading,
    store,
    new_serie,
    series,
    getSeries,
    storeSerie,
    destroySerie
} = useSede()

getSeries()

</script>