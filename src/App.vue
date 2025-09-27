<template>
  <RouterView />
  <Toaster :richColors="true" :dark="isDark" position="top-right" />
</template>

<script setup>
import { useDark } from '@vueuse/core'
import { Toaster } from 'vue-sonner'

const isDark = useDark()

document.title = import.meta.env.VITE_APP_NAME || 'Blocmin ERP'
</script>