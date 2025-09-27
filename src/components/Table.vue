<template>
    <div class="">
        <div class="bg-white rounded-md dark:bg-zinc-900">
            <div style=""
                class="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-600 relative scrollbar scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-white dark:scrollbar-track-zinc-900  ">
                <slot />
            </div>
            <div class="py-2 flex justify-start">
                <vue-awesome-paginate :total-items="total" :items-per-page="cant_reg"
                    :max-pages-shown="cantidad ? 3 : 4" v-model="nro_pag_ref" @click="onChangePage"
                    paginate-buttons-class="px-2 inline-flex rounded mx-1 hover:text-zinc-700 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-300 h-8 sm:h-auto flex items-center  "
                    active-page-class="bg-primary-500 text-white dark:bg-primary-500 dark:text-white"
                    back-button-class="text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200"
                    next-button-class="text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200">
                    <template #prev-button>
                        <span>
                            <i class="pi pi-caret-left"></i>
                        </span>
                    </template>
                    <template #next-button>
                        <span>
                            <i class="pi pi-caret-right"></i>
                        </span>
                    </template>
                </vue-awesome-paginate>
                <select v-if="cantidad"
                    class="border border-zinc-200 dark:border-zinc-600 rounded-md px-2 py-1 text-sm text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
                    v-model="cant_reg_ref" @change="onChangeCant($event.target.value)">
                    <option v-for="nro in [10, 20, 30, 50, 100]" :key="nro" :value="nro"
                        :selected="nro_pag_ref === nro">{{ nro }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    total: null,
    cant_reg: null,
    nro_pag: null,
    cantidad: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['changePage', 'changeCant'])

const nro_pag_ref = ref(props.nro_pag)
const cant_reg_ref = ref(props.cant_reg)

const onChangePage = (e) => {
    emits('changePage', e)
}

const onChangeCant = (e) => {
    emits('changeCant', parseInt(e))
}

watch(
    () => props.nro_pag,
    (nro_pag) => {
        nro_pag_ref.value = nro_pag
    }
)
</script>

<style scoped></style>