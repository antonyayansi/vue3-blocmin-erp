<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 dark:text-white p-6">
        <div v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, ease: 'easeOut' }" class="text-center space-y-6">
            <h1 class="text-6xl font-bold tracking-wider text-red-500 drop-shadow-lg">
                404
            </h1>
            <p class="text-xl md:text-2xl font-medium">Página no encontrada</p>
            <p class="text-zinc-700 dark:text-zinc-300 text-sm md:text-base max-w-md mx-auto">
                La página que estás buscando no existe o esta en construcción.
            </p>
            <div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }"
                :transition="{ delay: 0.3, duration: 0.4 }">
                <button @click="goHome"
                    class="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 transition-colors duration-300 rounded-full text-white font-semibold shadow-lg">
                    Regresar al inicio
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
    router.push('/')
}
</script>
