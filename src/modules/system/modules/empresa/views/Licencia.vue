<template>
    <div class="py-2">
        <div v-if="status"
            class="p-4 border-2 border-zinc-950 dark:border-zinc-700 rounded-md w-full md:w-1/2 lg:w-1/2 xl:w-1/3 xxl:w-1/4    ">
            <h1 class="font-bold text-xl text-black dark:text-white    ">{{ status.name }}</h1>
            <p class="text-zinc-800 dark:text-zinc-200    ">{{ status.precio }}</p>
            <p class="text-sm font-light text-zinc-500">{{ status.expires_at }}</p>
            <p :class="status.estado == 'Activo' ? 'text-green-500' : 'text-rose-500'" class="   ">{{ status.estado }}
            </p>
            <button v-if="status.estado != 'Activo'" class="mt-2 bg-skin-primary p-2 text-white rounded-md">
                Renovar
            </button>
        </div>
        <!-- <div v-else>
            <Pago />
        </div> -->
    </div>
</template>

<script setup>
import useLicencia from '../hooks/useLicencia';
// import Pago from './Pago.vue';

const {
    getStatus,
    status
} = useLicencia()

getStatus()
</script>