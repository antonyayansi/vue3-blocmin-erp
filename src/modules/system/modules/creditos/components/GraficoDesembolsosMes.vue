<template>
    <div class="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
        <h3 class="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">Desembolsos por Mes</h3>
        <div class="relative h-80">
            <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ estadisticas.totalDesembolsos }}</div>
                <div class="text-zinc-600 dark:text-zinc-400">Total Créditos</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-green-600">S/ {{ estadisticas.montoTotal }}</div>
                <div class="text-zinc-600 dark:text-zinc-400">Monto Total</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">S/ {{ estadisticas.promedioMensual }}</div>
                <div class="text-zinc-600 dark:text-zinc-400">Promedio Mensual</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Registrar componentes de Chart.js
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler
)

const props = defineProps({
    libroingresos: {
        type: Array,
        default: () => []
    }
})

const chartCanvas = ref(null)
let chartInstance = null

// Agrupar desembolsos por mes
const desembolsosPorMes = computed(() => {
    const grupos = {}

    props.libroingresos.forEach(credito => {
        try {
            const fecha = parseISO(credito.Fecha_Desembolso)
            const mesAno = format(fecha, 'yyyy-MM', { locale: es })
            const mesLabel = format(fecha, 'MMM yyyy', { locale: es })

            if (!grupos[mesAno]) {
                grupos[mesAno] = {
                    label: mesLabel,
                    cantidad: 0,
                    monto: 0
                }
            }

            grupos[mesAno].cantidad += 1
            grupos[mesAno].monto += parseFloat(credito.Monto || 0)
        } catch (error) {
            console.warn('Error al procesar fecha:', credito.Fecha_Desembolso)
        }
    })

    // Ordenar por fecha
    return Object.entries(grupos)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => ({ ...value, key }))
})

// Calcular estadísticas
const estadisticas = computed(() => {
    const totalDesembolsos = props.libroingresos.length
    const montoTotal = props.libroingresos.reduce((sum, credito) => sum + parseFloat(credito.Monto || 0), 0)
    const mesesConDatos = desembolsosPorMes.value.length
    const promedioMensual = mesesConDatos > 0 ? (montoTotal / mesesConDatos) : 0

    return {
        totalDesembolsos,
        montoTotal: montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 }),
        promedioMensual: promedioMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })
    }
})

// Preparar datos para el gráfico
const chartData = computed(() => {
    const labels = desembolsosPorMes.value.map(item => item.label)
    const dataCantidad = desembolsosPorMes.value.map(item => item.cantidad)
    const dataMonto = desembolsosPorMes.value.map(item => item.monto)

    return {
        labels,
        datasets: [
            {
                label: 'Cantidad de Créditos',
                data: dataCantidad,
                borderColor: '#3b82f6', // blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Monto Total (S/)',
                data: dataMonto,
                borderColor: '#10b981', // green-500
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                padding: 20,
                usePointStyle: true,
                color: '#374151'
            }
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    if (label.includes('Monto')) {
                        return `${label}: S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
                    }
                    return `${label}: ${value}`;
                }
            }
        }
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Periodo',
                color: '#374151'
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.1)'
            }
        },
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
                display: true,
                text: 'Cantidad de Créditos',
                color: '#3b82f6'
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.1)'
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'Monto (S/)',
                color: '#10b981'
            },
            grid: {
                drawOnChartArea: false,
            },
        }
    }
}

const createChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
    }

    if (chartCanvas.value && desembolsosPorMes.value.length > 0) {
        chartInstance = new Chart(chartCanvas.value, {
            type: 'line',
            data: chartData.value,
            options: chartOptions
        })
    }
}

const updateChart = () => {
    if (chartInstance) {
        chartInstance.data = chartData.value
        chartInstance.update()
    } else {
        createChart()
    }
}

onMounted(() => {
    createChart()
})

watch(() => props.libroingresos, () => {
    updateChart()
}, { deep: true })

onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy()
    }
})
</script>