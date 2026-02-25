<template>
  <RouterView />
  <Toaster :richColors="true" :dark="isDark" position="top-right" />
</template>

<script setup>
import { useDark } from '@vueuse/core'
import { Toaster } from 'vue-sonner'
import useAuth from './modules/auth/hooks/useAuth'

const isDark = useDark()

const {
  checkJWToken
} = useAuth()

document.title = import.meta.env.VITE_APP_NAME || 'Blocmin ERP'
checkJWToken()
</script>