<template>
  <div class="flex min-h-screen">
    <!-- Panel Izquierdo (Formulario de Login) -->
    <div class="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-zinc-900">
      <div class="max-w-md w-full space-y-6 px-6 py-8">
        <div class="text-center">
          <img :src="logoImg" alt="Logo" class="h-14 mx-auto mb-4" />
          <h2 class="text-3xl font-extrabold text-zinc-900 dark:text-white">Bienvenido de nuevo</h2>
          <p class="mt-2 text-sm text-zinc-500">Ingresa tu DNI y clave para continuar</p>
        </div>
        <div>
          <label for="correo" class="block text-sm font-medium text-zinc-700 dark:text-zinc-500">Correo</label>
          <InputText v-model="payload.email" 
            placeholder="Ingrese su correo" 
            @keypress.enter="onFocus('clave')"
            id="correo"
            type="email"
            class="mt-1" fluid />
        </div>
        <div>
          <label for="clave" class="block text-sm font-medium text-zinc-700 dark:text-zinc-500">Clave</label>
          <InputText v-model="payload.password" type="password" placeholder="Ingrese su clave"
            @keypress.enter="onLogin(payload)" id="clave" class="mt-1" fluid />
        </div>
        <div v-if="errorMessage" class="text-rose-500 font-medium bg-rose-500/10 p-2 rounded-md text-sm mt-2">
          {{ errorMessage }}
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember_me" name="remember_me" type="checkbox"
              class="h-4 w-4 text-primary-600 border-zinc-300 rounded" />
            <label for="remember_me" class="ml-2 block text-sm text-zinc-900 dark:text-zinc-100">Recuérdame</label>
          </div>
          <!-- <div class="text-sm">
            <a @click="recuperClave(payload.dni)" class="font-medium text-primary-600 hover:text-primary-500">¿Olvidaste tu clave?</a>
          </div> -->
        </div>
        <div class="space-y-4">
          <Button :loading="isLoading" :disabled="isLoading" label="Iniciar Sesión" @click="onLogin(payload)" fluid />
          <!-- <GoogleLogin :callback="callback" style="width: 100%">
            <Button class="w-full" label="Ingresar con Google" variant="outlined" icon="pi pi-google" type="button" />
          </GoogleLogin> -->
        </div>
        <div class="flex items-center justify-center space-x-2">
          <!-- <span class="text-zinc-400 text-sm">¿No tienes una cuenta?</span> -->
          <!-- <a href="#" class="text-primary-600 text-sm font-medium hover:underline">Regístrate</a> -->
        </div>
      </div>
    </div>

    <!-- Panel Derecho (Informativo) -->
    <div class="hidden md:flex md:w-1/2 bg-primary-600 text-white items-center justify-center px-10">
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-semibold leading-tight">Blocmin ERP - 2025</h2>
        <p class="text-sm opacity-80">Sistema de gestión empresarial todo en uno.</p>
        <p class="text-sm opacity-80">Optimiza tus operaciones, mejora la productividad y toma decisiones informadas con nuestra solución integral.</p>
        <p class="text-sm opacity-80">Gestiona inventarios, ventas, compras, finanzas y más desde una única plataforma.</p>
        <p class="text-sm opacity-80">¡Impulsa tu negocio con Blocmin ERP!</p>
        <!-- <p class="text-sm opacity-80">Desarrollado por <a href="https://github.com/antonyayansi" target="_blank" class="underline font-medium">@dankira</a></p> -->
        <!-- <img src="/home/danki/Descargas/logo (1).jpeg" alt="Panel CRM" class="rounded-lg shadow-lg w-full" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useAuth from '../hooks/useAuth'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { onFocus } from '@/lib/onFocus'
import logoImg from '@/assets/logo.jpeg'

const payload = ref({
  email: '',
  password: '',
})

const {
  login: onLogin,
  isLoading,
  errorMessage
} = useAuth()

setTimeout(() => {
  onFocus('correo')
}, 100)
</script>