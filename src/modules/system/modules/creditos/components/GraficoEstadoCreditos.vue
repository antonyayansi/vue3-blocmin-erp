<template>
    <div class="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
        <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Estado de Créditos</h3>
        <div class="relative h-80">
            <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ estados_total.totalCreditosPagados }}</div>
                <div class="text-zinc-600 dark:text-zinc-400">Completados</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">{{ estados_total.totalCreditosActivos }}</div>
                <div class="text-zinc-600 dark:text-zinc-400">Pendientes</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import {
    Chart,
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { useDark } from '@vueuse/core'

const isDark = useDark()

// Registrar componentes de Chart.js
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps({
    estados_total: {
        type: Object,
        default: {
            totalCreditosActivos: 0,
            totalCreditosPagados: 0
        }
    }
})

const chartCanvas = ref(null)
let chartInstance = null

// Calcular el total para los porcentajes
const estadisticas = computed(() => {
    const total = props.estados_total.totalCreditosActivos + props.estados_total.totalCreditosPagados
    return {
        total
    }
})

// Preparar datos para el gráfico
const chartData = computed(() => {
    return {
        labels: ['Créditos Completados', 'Créditos Pendientes'],
        datasets: [{
            data: [props.estados_total.totalCreditosPagados, props.estados_total.totalCreditosActivos],
            backgroundColor: [
                '#10b981', // green-500
                '#f59e0b'  // amber-500
            ],
            borderColor: [
                '#059669', // green-600
                '#d97706'  // amber-600
            ],
            borderWidth: 2,
            hoverBackgroundColor: [
                '#059669',
                '#d97706'
            ]
        }]
    }
})

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                usePointStyle: true,
                color: isDark.value ? '#d1d5db' : '#374151'
            }
        },
        tooltip: {
            backgroundColor: isDark.value ? '#374151' : '#ffffff',
            titleColor: isDark.value ? '#f9fafb' : '#111827',
            bodyColor: isDark.value ? '#d1d5db' : '#374151',
            borderColor: isDark.value ? '#6b7280' : '#e5e7eb',
            borderWidth: 1,
            callbacks: {
                label: function (context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const total = estadisticas.value.total;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                }
            }
        }
    },
    cutout: '60%'
}))

const createChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
    }

    if (chartCanvas.value) {
        chartInstance = new Chart(chartCanvas.value, {
            type: 'doughnut',
            data: chartData.value,
            options: chartOptions.value
        })
    }
}

const updateChart = () => {
    if (chartInstance) {
        chartInstance.data = chartData.value
        chartInstance.options = chartOptions.value
        chartInstance.update()
    }
}

onMounted(() => {
    createChart()
})

watch(() => props.estados_total, () => {
    updateChart()
}, { deep: true })

watch(isDark, () => {
    updateChart()
})

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>