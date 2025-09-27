<template>
    <div v-if="activeEmpresa">
        <Sidebar />
    </div>
    <MisEmpresas v-else />
    <Dialog v-model:visible="openModalSede" modal :close-on-escape="false" :dismissable-mask="false" :closable="false"
        pt:mask:class="backdrop-blur-sm" header="Seleccionar Sede" :style="{ width: '90vw', maxWidth: '600px' }">
        <Sedes />
    </Dialog>
</template>

<script setup>
import MisEmpresas from '../components/MisEmpresas.vue';
import useSystem from '../hooks/useSystem';
import Sidebar from '../components/Sidebar.vue';
import { Dialog } from 'primevue';
import Sedes from '../components/Sedes.vue';

const {
    activeEmpresa,
    openModalSede,
    checkEmpresa,
    checkMenus,
    checkSede,
} = useSystem();

checkEmpresa()
checkSede()
checkMenus()
</script>