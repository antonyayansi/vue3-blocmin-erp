<template>
    <Panel header="Administración de creditos" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
        :leave="{ opacity: 0, y: -30 }" :transition="{ duration: 0.3 }">
        <div class="mb-2">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <!-- Input -->
                <div class="w-full md:w-auto">
                    <IconField class="w-full">
                        <InputIcon @click="changePage(1)" class="pi pi-search" />
                        <InputText v-model="pag.buscar" size="small" @keypress.enter="changePage(1)"
                            placeholder="Buscar..." class="w-full md:w-auto" />
                    </IconField>
                </div>

                <!-- Botón -->
                <div class="w-full flex justify-end md:w-auto">
                    <Button @click="newCredito()" label="Nueva credito" icon="pi pi-plus" size="small" class="" />
                </div>
            </div>
        </div>
        <Table :total="pag.total" :cant_reg="pag.cant_reg" :nro_pag="pag.page" @changePage="changePage" :cantidad="true"
            @changeCant="changeCant">
            <table class="prov-id w-full table-fixed xxl:table-auto">
                <thead>
                    <tr class="text-sm sticky top-0 z-[4] text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-white  ">
                        <th class="w-[200px] p-2 text-left">Descripción</th>
                        <th class="w-[100px] p-2 text-left">Fecha Apertura</th>
                        <th class="w-[100px] p-2 text-left">Fecha Cierre</th>
                        <th class="w-[100px] p-2 text-right">M. Inicial</th>
                        <th class="w-[100px] p-2 text-right">M. Final</th>
                        <th class="w-[100px] p-2 text-center">Estado</th>
                        <th class="w-[130px] p-2 text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="caja in creditos" :key="caja"
                        class="cursor-default text-sm border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            caja.name }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            caja.created_at ? format(new Date(caja.created_at), 'dd/MM/yyyy') : '' }}
                            <p class="text-xs text-zinc-500">{{
                                caja.created_at ? format(new Date(caja.created_at), 'HH:mm a') : '' }}</p>
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">{{
                            caja.created_at ? format(new Date(caja.updated_at), 'dd/MM/yyyy') : '' }}
                            <p class="text-xs text-zinc-500">{{
                                caja.created_at ? format(new Date(caja.updated_at), 'HH:mm a') : '' }}</p>
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                            formatMoneda(caja.monto_inicial) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-right font-bold">{{
                            formatMoneda(caja.monto_final) }}</td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300 text-center">
                            <Tag :value="caja.estado == 1 ? 'Abierto' : 'Cerrado'"
                                :severity="caja.estado === 1 ? 'success' : 'danger'" />
                        </td>
                        <td class="px-2 py-1 text-zinc-700 dark:text-zinc-300">
                            <div class="flex space-x-2 justify-end">
                                <Button v-if="caja.estado == 1" @click="editCaja(caja)" icon="pi pi-lock"
                                    variant="outlined" size="small" />
                                <!-- <Button v-if="caja.estado == 1" @click="editCaja(caja)" icon="pi pi-pen-to-square"
                                    variant="outlined" size="small" severity="warn" /> -->
                                <Button v-if="caja.estado == 1" @click="eliminarCaja(caja)" icon="pi pi-trash"
                                    variant="outlined" severity="danger" size="small" />
                                <Button v-if="caja.estado == 0" @click="cerrarCaja(caja)" icon="pi pi-print"
                                    variant="outlined" severity="info" size="small" />
                            </div>
                        </td>
                    </tr>
                    <tr v-if="!creditos.length">
                        <td colspan="7"
                            class="px-2 text-sm text-zinc-700 dark:text-zinc-300 font-light text-center py-8">No hay
                            cajas</td>
                    </tr>
                </tbody>
            </table>
        </Table>
    </Panel>
</template>

<script setup>
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import useCredito from '../hooks/useCredito'
import Table from '@/components/Table.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const {
    pag,
    creditos
} = useCredito()

const newCredito = () => {
    router.push({ name: 'creditos.create' })
}

const changePage = async (page) => {
    pag.value.page = page
}

const changeCant = async (cant) => {
    pag.value.cant_reg = cant
    await changePage(1)
}

</script>