<template>
    <div class="w-full flex space-x-1">
        <div ref="select" class="w-full flex flex-col items-center relative">
            <div :class="open
                    ? 'border-2 border-primary-500 dark:border-primary-500'
                    : 'border border-zinc-200 dark:border-zinc-700 hover:border-primary-300 hover:dark:border-primary-600',
                dark
                    ? 'dark:bg-zinc-950'
                    : 'dark:bg-zinc-950'" class="w-full flex bg-white dark:text-white  rounded-md pl-2  ">
                <input ref="input" :disabled="props.disabled"
                    :class="props.disabled ? 'cursor-not-allowed opacity-50' : ''" @focus="open = true, query = '',
                        result = props.options,
                        props.modelValue ? indexItem = props.options.findIndex(option => option.codigo === props.modelValue) : 0,
                        scrollToSelectedItem()" v-model="query" @keyup="onSearch()"
                    @keypress.enter="onSelect(result[indexItem]), result.length ? emits('selected', item) : null"
                    @keydown.arrow-down="onKeydown($event)" @keydown.arrow-up="onKeydown($event)"
                    @keydown.tab="open = false"
                    :placeholder="props.placeholder ? props.placeholder : 'Seleccione un Item'"
                    class="p-1 appearance-none outline-none w-full placeholder:font-light">
                <input hidden class="p-1 appearance-none bg-transparent outline-none w-full" :value="modelValue">
                <div class="text-zinc-300 w-8 flex items-center border-zinc-200">
                    <label for="input">
                        <button @click="open = !open, result = props.options, input.focus()" type="button"
                            :disabled="props.disabled"
                            class="hidden md:inline-block cursor-pointer w-8 h-6 text-zinc-600 dark:text-zinc-300 outline-none focus:outline-none  ">
                            <i v-if="!open" class="pi pi-caret-down" />
                            <i v-else class="pi pi-caret-up" />
                        </button>
                        <button v-if="!open" @click="open = !open, result = props.options, input.focus()"
                            :disabled="props.disabled" type="button"
                            class="inline-block md:hidden cursor-pointer w-8 h-6 text-zinc-600 dark:text-zinc-300 outline-none focus:outline-none  ">
                            <i class="pi pi-caret-down" />
                        </button>
                        <button v-if="open" @click="onSearch()" :disabled="props.disabled" type="button"
                            class="inline-block md:hidden">
                            <i class="pi pi-search" />
                        </button>
                    </label>
                </div>
            </div>
            <div v-if="open" ref="divResultRef"
                class="z-[9] bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-600 mt-1 absolute shadow border top-full w-full lef-0 rounded max-h-48 overflow-y-auto scrollbar scrollbar-thumb-primary-200 dark:scrollbar-thumb-primary-500 scrollbar-track-white dark:scrollbar-track-zinc-800">
                <div v-if="result.length">
                    <ul v-if="!table">
                        <li ref="listItems" v-for="(item, index) in result" :key="item"
                            @click="onSelect(item), emits('selected', item)"
                            class="scroll-item w-full cursor-pointer text-zinc-800 border-zinc-200 border-b dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200"
                            :class="{ 'bg-primary-500 text-white hover:bg-primary-500 dark:hover:bg-primary-500': item.codigo == modelValue }">
                            <div class="w-full px-2 py-1" :class="{ 'text-white': item.codigo == modelValue }">
                                <h1 :class="{ 'text-cyan-400 dark:text-cyan-300': indexItem == index }">
                                    {{ item.descripcion }}
                                </h1>
                            </div>
                        </li>
                    </ul>
                    <div v-else>
                        <table class="w-full table-fixed">
                            <thead>
                                <tr>
                                    <th v-for="(value, key, index) in result[0]" :key="key"
                                        :class="index == 1 ? 'w-[150px]' : index == 0 ? 'w-[65px]' : 'w-[40px]'"
                                        class="text-left text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-950 dark:text-white border-b dark:border-zinc-700">
                                        {{ key }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in result" :key="index"
                                    @click="onSelect(item), emits('selected', item)"
                                    class="w-full text-xs cursor-pointer text-zinc-800 border-b dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    :class="{ 'bg-primary-500 text-white hover:bg-primary-500 dark:hover:bg-primary-500': item.codigo == modelValue }">
                                    <td v-for="(value, key) in item" :key="key" class="px-2 py-1">{{ value }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <ul v-else class="text-center py-2">
                    <li class="text-zinc-500 text-sm">🤔 No hay datos</li>
                    <div v-if="add" class="py-2">
                        <button type="button" @click="addItem()" class="text-skin-success">
                            <i class="pi pi-plus" /> Nuevo
                        </button>
                    </div>
                </ul>
            </div>
        </div>
        <button v-if="isReload" @click="onReload()" class="bg-primary-500 px-2 rounded-md text-white"
            :disabled="disabled" :class="{ 'opacity-50': disabled }" type="button">
            <i :spin="disabled" class="pi pi-sync" />
        </button>
    </div>
</template>


<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core'

const props = defineProps([
    'modelValue',
    'options', // options is [{codigo: 001, descripcion: 'text'}] 👈
    'mode', //mode is 'offline' or 'online' 📡
    'placeholder',
    'focus',
    'dark',
    'add', //true, false,
    'table', //true, false,
    'disabled',
    'isReload'
])

const emits = defineEmits(['update:modelValue', 'keywords', 'blur', 'selected', 'addItem', 'unfocus', 'reload'])

const select = ref(null) //para acceder al DOM de todo el componente

const query = ref('') //texto que se muestra en el box y tambien para realizar busquedas
const result = ref([])
const open = ref(false)
const input = ref(null)

const onReload = () => {
    emits('reload')
}

//observador de foco de input - buscador
onClickOutside(select, (event) => {
    open.value = false
    onBlur()
    if (props.modelValue) {
        props.options?.map(item => {
            if (item.codigo == `${props.modelValue}`) {
                onSelect(item)
            }
        })
    }
})

const onSelect = (item) => {
    if (!item) return
    emits('update:modelValue', item.codigo)
    query.value = item.descripcion
    open.value = false
    input.value.blur()
}

const addItem = () => {
    emits('addItem', query.value)
}

//blur
const onBlur = () => {
    emits('blur')
}

let lastQuery = ''

const onSearch = async () => {
    if (props.mode === 'offline') {
        const regex = new RegExp(query.value, 'i')
        result.value = props.options.filter(item => regex.test(item.descripcion))

        if (query.value !== lastQuery) {
            indexItem.value = 0
            lastQuery = query.value
        }
    } else {
        if (query.value.length >= 3) {
            emits('keywords', query.value)
        }
    }
}

const listItems = ref([])
const scrollToSelectedItem = () => {
    nextTick(() => {
        const selectedIndex = result.value.findIndex(
            (item) => item.codigo == props.modelValue
        )
        if (selectedIndex !== -1 && listItems.value[selectedIndex]) {
            listItems.value[selectedIndex].scrollIntoView({
                behavior: 'auto',
                block: 'nearest'
            })
        }
    })
}

const scrollToIndexItem = () => {
    nextTick(() => {
        if (listItems.value[indexItem.value]) {
            listItems.value[indexItem.value].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }
    })
}


//crear un index para manejar la posicion y del array con el teclado y al presionar enter selecionar ese item
const indexItem = ref(0)
const onKeydown = (event) => {
    if (event.key === 'ArrowDown') {
        if (indexItem.value < result.value.length - 1) {
            indexItem.value++
            scrollToIndexItem()
        }
    }
    if (event.key === 'ArrowUp') {
        if (indexItem.value > 0) {
            indexItem.value--
            scrollToIndexItem()
        }
    }
}

watch(
    () => props.focus,
    (value) => {
        if (value) {
            input.value.focus()
            let index = props.options.findIndex(option => option.codigo === props.modelValue);
            indexItem.value = index
        }
    }
)

watch(
    () => props.options,
    (value) => {
        result.value = value
        //si el vmodel no existe en las opciones se limpia el input
        if (!value.find(item => item.codigo == props.modelValue)) {
            query.value = ''
            emits('update:modelValue', null)
            indexItem.value = 0;
        }
    }
)

watch(
    () => props.modelValue,
    (value) => {
        if (value === null) {
            // Limpiar el estado interno directamente si el valor es null
            query.value = '';
            result.value = props.options;
            indexItem.value = 0;
        } else {
            // Si no es null, buscar y seleccionar el elemento correspondiente
            props.options?.map(item => {
                if (item.codigo == `${value}`) {
                    onSelect(item);
                }
            });
        }
    }
);


onMounted(() => {
    result.value = props.options
    props.options?.map(item => {
        if (item.codigo == `${props.modelValue}`) {
            onSelect(item)
        }
    })
})

</script>


<style scoped>
.scroll-item {
    scroll-margin-top: 8px;
    /* o 16px, según tu gusto */
}
</style>