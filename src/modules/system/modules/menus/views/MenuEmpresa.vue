<template>
    <div>
        <div class="mt-2 bg-white dark:bg-zinc-900 w-full rounded-md shadow-sm p-4  ">
            <h1 class="font-bold text-xl dark:text-zinc-300  ">Menus Empresa</h1>
            <div class="mt-2">
                <Select placeholder="Seleccione una empresa" v-model="empresa_id" :options="empresas_combo"
                    mode="offline" />
            </div>
        </div>
        <div class="mt-2 space-y-2">
            <DropdownMenu v-for="menu in menus_empresa" :key="menu.id" :menus="menu.children" :id="menu.id"
                :menuempresa_id="menu.menuempresa_id" :name="menu.name" :icon="menu.icon" :estado="menu.estado" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import useMenuEmpresa from '../hooks/useMenuEmpresa';
import DropdownMenu from '../components/DropdownMenu.vue';
import Select from '@/components/Select.vue';

const {
    empresa_id,
    empresas_combo,
    menus_empresa,
    getEmpresasCombo,
    getMenusEmpresa
} = useMenuEmpresa()

watch(
    () => empresa_id.value,
    () => {
        getMenusEmpresa()
    }
)

onMounted(() => {
    getEmpresasCombo()
})

</script>