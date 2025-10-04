<template>
    <div>
        <div class="mt-2 bg-white dark:bg-zinc-950 w-full rounded-md shadow-sm p-4  ">
            <h1 class="font-bold text-xl dark:text-zinc-300  ">Menus Usuarios</h1>
            <div class="mt-2">
                <Select placeholder="Seleccione un usuario" v-model="user_id" mode="offline" :options="userscombo" />
            </div>
        </div>
        <div class="mt-2 space-y-2">
            <DropdownMenuUser v-for="menu in menuuser" :key="menu.id" :menus="menu.children" :id="menu.id"
                :menuuser_id="menu.menuuser_id" :menuempresa_id="menu.menuempresa_id" :name="menu.name"
                :icon="menu.icon" :estado="menu.estado" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import useMenuUser from '../hooks/useMenuUser';
import Select from '@/components/Select.vue'
import DropdownMenuUser from '../components/DropdownMenuUser.vue';

const {
    menuuser,
    getMenuUser,
    userscombo,
    user_id,
    getUsersCombo
} = useMenuUser();

watch(
    () => user_id.value,
    () => {
        getMenuUser();
    }
);

onMounted(() => {
    getUsersCombo();
});
</script>