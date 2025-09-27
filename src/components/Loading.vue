<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 select-none bg-white/70 dark:bg-zinc-950/80 z-[9999] flex items-center justify-center"
      >
        <div class="flex flex-col items-center space-y-4 text-zinc-800 dark:text-white font-medium">
          <slot />
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="6"
            fill="transparent"
            animationDuration=".6s"
            aria-label="Loading"
          />
          <p class="text-sm opacity-80">{{ title }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Cargando...'
  }
});

// Bloquear scroll al mostrar el loader
const toggleBodyScroll = (enabled) => {
  document.body.style.overflow = enabled ? 'hidden' : '';
};

watch(() => props.show, (val) => {
  toggleBodyScroll(val);
});

onUnmounted(() => {
  toggleBodyScroll(false); // Por si acaso
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>