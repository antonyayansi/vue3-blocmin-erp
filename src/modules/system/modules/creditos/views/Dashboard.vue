<!--
╔══════════════════════════════════════════════════════════════════════════════════╗
║                         DASHBOARD DE CRÉDITOS - BLOCMIN ERP                      ║
╚══════════════════════════════════════════════════════════════════════════════════╝

📊 CARACTERÍSTICAS PRINCIPALES:

1. KPIs EN TIEMPO REAL:
   - Total de créditos
   - Monto total desembolsado
   - Créditos aprobados (cantidad y monto)
   - Créditos pendientes (cantidad y monto)

2. GRÁFICOS INTERACTIVOS (Chart.js):
   - 🍩 Dona: Estados de créditos (aprobado/pendiente/rechazado)
   - 📊 Barras Horizontales: Tipos de crédito
   - 📊 Barras: Modo de pago (diario/semanal/mensual)
   - 📈 Línea: Desembolsos por mes

   ✨ INTERACTIVIDAD: ¡Haz click en cualquier gráfico para filtrar y abrir la tabla automáticamente!

3. FILTROS MÚLTIPLES:
   - 📅 Rango de fechas (inicio - fin)
   - 🔍 Búsqueda por cliente, documento o ID
   - 🎯 Filtros rápidos por estado (con contadores)
   - 🖱️ Filtros desde los gráficos (click en las secciones - abre tabla automáticamente)
   - 🧹 Botón "Limpiar" para resetear todos los filtros

4. TABLA COMPLETA EN DIALOG:
   - ✅ Se abre en un Dialog modal (no al final de la página)
   - ✅ Se abre automáticamente al hacer click en gráficos
   - 📄 Paginación (10/25/50/100 registros por página)
   - ⬆️⬇️ Ordenamiento por cualquier columna
   - 🏷️ Tags con colores para estados y modos de pago
   - 💰 Formato automático de moneda
   - 🔍 Dialog maximizable
   - 📥 Botón de exportar Excel en el header del dialog

5. EXPORTACIÓN:
   - 📥 Exporta a Excel los datos filtrados
   - Nombre con fecha y hora automática
   - Todos los campos formateados

6. UX/UI:
   - ✨ Animaciones suaves con @vueuse/motion
   - 📱 Diseño 100% responsive
   - 🎨 Colores semánticos por estado
   - ⏳ Loading states
   - 💡 Indicador de filtros activos
   - 📭 Mensaje cuando no hay resultados
   - 🌙 Soporte completo para Dark Mode (gráficos y cards)
   - 👆 Cursor pointer en gráficos clickeables
   - ℹ️ Texto informativo "Click para filtrar" en gráficos

🚀 RENDIMIENTO:
   - Usa Bun.js para instalación rápida
   - Reactive con Vue 3 Composition API
   - Gráficos optimizados con Chart.js 4
   - Actualización automática de gráficos al cambiar tema

📚 TECNOLOGÍAS:
   - Vue 3 + Composition API
   - PrimeVue 4 (UI Components + Dialog)
   - Chart.js 4 (Gráficos)
   - xlsx (Exportación Excel)
   - date-fns (Formateo de fechas)
   - Tailwind CSS (Estilos)
   - @vueuse/motion (Animaciones)
   - @vueuse/core (Dark Mode)
-->

<template>
    <div class="dashboard-container">
        <!-- Header con filtros -->
        <Panel header="Dashboard de Créditos" v-motion :initial="{ opacity: 0, y: -30 }" :enter="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.3 }">
            <div class="flex flex-col md:flex-row gap-3 mb-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">Fecha Inicio</label>
                    <InputText v-model="filtro.fecha_inicio" type="date" size="small" @change="cargarDatos"
                        class="w-full" :class="{ 'border-red-500': filtro.fecha_inicio && filtro.fecha_fin && !fechasValidas }" />
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">Fecha Fin</label>
                    <InputText v-model="filtro.fecha_fin" type="date" size="small" @change="cargarDatos"
                        class="w-full" :class="{ 'border-red-500': filtro.fecha_inicio && filtro.fecha_fin && !fechasValidas }" />
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium mb-1">Buscar</label>
                    <InputText v-model="busqueda" placeholder="Cliente, documento..." size="small" class="w-full" />
                </div>
                <div class="flex items-end gap-2">
                    <Button @click="mostrarTabla = true" icon="pi pi-table" label="Ver Tabla" severity="primary"
                        size="small" />
                    <Button @click="limpiarFiltros" icon="pi pi-filter-slash" label="Limpiar" severity="secondary"
                        size="small" outlined />
                    <Button @click="exportarExcel" icon="pi pi-file-excel" label="Exportar" severity="success"
                        size="small" :loading="isLoading" />
                </div>
            </div>

            <!-- Mensaje de error de fechas -->
            <div v-if="filtro.fecha_inicio && filtro.fecha_fin && !fechasValidas" 
                class="mb-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                <i class="pi pi-exclamation-triangle"></i>
                <span>La fecha de inicio no puede ser mayor que la fecha fin</span>
            </div>

            <!-- Filtros rápidos -->
            <div class="flex flex-wrap gap-2">
                <Button :label="`Todos (${datosFiltrados.length})`" size="small"
                    :severity="filtroEstado === null ? 'primary' : 'secondary'" @click="aplicarFiltroEstado(null)" />
                <Button v-for="estado in estadosUnicos" :key="estado"
                    :label="`${estado} (${contarPorEstado(estado)})`" size="small"
                    :severity="filtroEstado === estado ? 'info' : 'secondary'" @click="aplicarFiltroEstado(estado)" />
                
                <!-- Indicador de filtros activos -->
                <div v-if="filtrosActivos > 0" class="flex items-center ml-auto">
                    <Tag :value="`${filtrosActivos} filtro(s) activo(s)`" severity="info" icon="pi pi-filter" />
                </div>
            </div>
        </Panel>

        <!-- KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
            <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Créditos</div>
                        <div class="text-2xl font-bold dark:text-white">{{ datosFiltrados.length }}</div>
                    </div>
                    <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <i class="pi pi-wallet text-blue-600 dark:text-blue-300 text-2xl"></i>
                    </div>
                </div>
            </div>

            <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Monto Total</div>
                        <div class="text-2xl font-bold dark:text-white">S/ {{ formatMonto(kpis.montoTotal) }}</div>
                    </div>
                    <div class="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                        <i class="pi pi-money-bill text-green-600 dark:text-green-300 text-2xl"></i>
                    </div>
                </div>
            </div>

            <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Aprobados</div>
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ kpis.aprobados }}</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">S/ {{ formatMonto(kpis.montoAprobados) }}</div>
                    </div>
                    <div class="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                        <i class="pi pi-check-circle text-green-600 dark:text-green-300 text-2xl"></i>
                    </div>
                </div>
            </div>

            <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Pendientes</div>
                        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ kpis.pendientes }}</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">S/ {{ formatMonto(kpis.montoPendientes) }}</div>
                    </div>
                    <div class="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                        <i class="pi pi-clock text-orange-600 dark:text-orange-300 text-2xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gráficos -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
            <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0, transition: { delay: 500 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div class="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div class="font-semibold dark:text-white">Estados de Créditos</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <i class="pi pi-info-circle mr-1"></i>Click para filtrar
                    </div>
                </div>
                <div class="p-4">
                    <canvas ref="chartEstados" class="max-h-80 cursor-pointer"></canvas>
                </div>
            </div>

            <div v-motion :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0, transition: { delay: 500 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div class="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div class="font-semibold dark:text-white">Tipos de Crédito</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <i class="pi pi-info-circle mr-1"></i>Click para filtrar
                    </div>
                </div>
                <div class="p-4">
                    <canvas ref="chartTipos" class="max-h-80 cursor-pointer"></canvas>
                </div>
            </div>

            <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0, transition: { delay: 600 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div class="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div class="font-semibold dark:text-white">Modo de Pago</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <i class="pi pi-info-circle mr-1"></i>Click para filtrar
                    </div>
                </div>
                <div class="p-4">
                    <canvas ref="chartModoPago" class="max-h-80 cursor-pointer"></canvas>
                </div>
            </div>

            <div v-motion :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0, transition: { delay: 600 } }"
                class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div class="p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div class="font-semibold dark:text-white">Desembolsos por Mes</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <i class="pi pi-chart-line mr-1"></i>Evolución temporal
                    </div>
                </div>
                <div class="p-4">
                    <canvas ref="chartDesembolsos" class="max-h-80"></canvas>
                </div>
            </div>
        </div>

        <!-- Dialog con tabla de datos -->
        <Dialog v-model:visible="mostrarTabla" header="Detalle de Créditos" :modal="true" 
            :style="{ width: '95vw' }" :maximizable="true">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span class="font-semibold">Detalle de Créditos</span>
                    <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-500">{{ datosFiltrados.length }} registros</span>
                        <Button @click="exportarExcel" icon="pi pi-file-excel" label="Exportar" severity="success"
                            size="small" :loading="isLoading" />
                    </div>
                </div>
            </template>
            
            <div v-if="datosFiltrados.length === 0 && !isLoading" class="text-center py-8">
                <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-500">No se encontraron créditos con los filtros aplicados</p>
                <Button label="Limpiar filtros" icon="pi pi-filter-slash" @click="limpiarFiltros" 
                    class="mt-3" size="small" outlined />
            </div>
            <DataTable v-else :value="datosFiltrados" :paginator="true" :rows="10" :loading="isLoading"
                stripedRows responsiveLayout="scroll" :rowsPerPageOptions="[10, 25, 50, 100]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} créditos"
                sortField="id" :sortOrder="-1">
                
                <Column field="id" header="ID" sortable style="min-width: 80px"></Column>
                <Column field="documento" header="Documento" sortable style="min-width: 120px"></Column>
                <Column field="nombre" header="Cliente" sortable style="min-width: 200px"></Column>
                <Column field="estado" header="Estado" sortable style="min-width: 120px">
                    <template #body="{ data }">
                        <Tag :value="data.estado" :severity="getSeverityEstado(data.estado)" />
                    </template>
                </Column>
                <Column field="importe" header="Importe" sortable style="min-width: 120px">
                    <template #body="{ data }">
                        S/ {{ formatMonto(data.importe) }}
                    </template>
                </Column>
                <Column field="interes" header="Interés" sortable style="min-width: 100px">
                    <template #body="{ data }">
                        S/ {{ formatMonto(data.interes) }}
                    </template>
                </Column>
                <Column field="cuota" header="Cuota" sortable style="min-width: 100px">
                    <template #body="{ data }">
                        S/ {{ formatMonto(data.cuota) }}
                    </template>
                </Column>
                <Column field="nro_cuotas" header="N° Cuotas" sortable style="min-width: 100px"></Column>
                <Column field="modo_pago" header="Modo Pago" sortable style="min-width: 120px">
                    <template #body="{ data }">
                        <Tag :value="data.modo_pago" :severity="getSeverityModoPago(data.modo_pago)" />
                    </template>
                </Column>
                <Column field="tipo_credito" header="Tipo Crédito" sortable style="min-width: 200px"></Column>
                <Column field="tea" header="TEA %" sortable style="min-width: 100px">
                    <template #body="{ data }">
                        {{ data.tea }}%
                    </template>
                </Column>
                <Column field="tem" header="TEM %" sortable style="min-width: 100px">
                    <template #body="{ data }">
                        {{ data.tem }}%
                    </template>
                </Column>
                <Column field="fecha_desembolso" header="Fecha Desembolso" sortable style="min-width: 150px">
                    <template #body="{ data }">
                        {{ formatFecha(data.fecha_desembolso) }}
                    </template>
                </Column>
            </DataTable>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
    Panel,
    InputText,
    Button,
    DataTable,
    Column,
    Tag,
    Dialog
} from 'primevue'
import { useCrediReporte } from '../hooks/useCrediReporte'
import { formatMoneda } from '../../../../../lib/formatMoneda'
import { exportToExcel } from '../../../../../lib/excel'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useDark } from '@vueuse/core'
import { toast } from 'vue-sonner'
import {
    Chart,
    DoughnutController,
    BarController,
    LineController,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

// Registrar componentes de Chart.js
Chart.register(
    DoughnutController,
    BarController,
    LineController,
    ArcElement,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
)

const {
    filtro,
    getCreditosDashboard,
    creditos_all,
    isLoading
} = useCrediReporte()

const isDark = useDark()

// Referencias a los canvas de los gráficos
const chartEstados = ref(null)
const chartTipos = ref(null)
const chartModoPago = ref(null)
const chartDesembolsos = ref(null)

// Instancias de los gráficos
let chartEstadosInstance = null
let chartTiposInstance = null
let chartModoPagoInstance = null
let chartDesembolsosInstance = null

// Estado local
const busqueda = ref('')
const filtroEstado = ref(null)
const filtroTipo = ref(null)
const filtroModoPago = ref(null)
const mostrarTabla = ref(false)

// Cargar datos iniciales
const cargarDatos = async () => {
    // Validar que las fechas estén presentes y sean correctas
    if (!filtro.value.fecha_inicio || !filtro.value.fecha_fin) {
        toast.warning('Por favor, selecciona ambas fechas')
        return
    }

    // Validar que fecha_inicio no sea mayor que fecha_fin
    const fechaInicio = new Date(filtro.value.fecha_inicio)
    const fechaFin = new Date(filtro.value.fecha_fin)

    if (fechaInicio > fechaFin) {
        toast.error('La fecha de inicio no puede ser mayor que la fecha fin')
        return
    }

    await getCreditosDashboard()
    actualizarGraficos()
}

// Datos filtrados
const datosFiltrados = computed(() => {
    let datos = creditos_all.value

    // Filtro por búsqueda
    if (busqueda.value.trim()) {
        const termino = busqueda.value.toLowerCase()
        datos = datos.filter(c =>
            c.nombre?.toLowerCase().includes(termino) ||
            c.documento?.toLowerCase().includes(termino) ||
            c.id?.toString().includes(termino)
        )
    }

    // Filtro por estado
    if (filtroEstado.value) {
        datos = datos.filter(c => c.estado === filtroEstado.value)
    }

    // Filtro por tipo
    if (filtroTipo.value) {
        datos = datos.filter(c => c.tipo_credito === filtroTipo.value)
    }

    // Filtro por modo de pago
    if (filtroModoPago.value) {
        datos = datos.filter(c => c.modo_pago === filtroModoPago.value)
    }

    return datos
})

// Estados únicos
const estadosUnicos = computed(() => {
    const estados = new Set(creditos_all.value.map(c => c.estado))
    return Array.from(estados).filter(Boolean)
})

// Contar por estado
const contarPorEstado = (estado) => {
    return creditos_all.value.filter(c => c.estado === estado).length
}

// Contar filtros activos
const filtrosActivos = computed(() => {
    let count = 0
    if (busqueda.value.trim()) count++
    if (filtroEstado.value) count++
    if (filtroTipo.value) count++
    if (filtroModoPago.value) count++
    return count
})

// Validar fechas
const fechasValidas = computed(() => {
    if (!filtro.value.fecha_inicio || !filtro.value.fecha_fin) {
        return false
    }
    const fechaInicio = new Date(filtro.value.fecha_inicio)
    const fechaFin = new Date(filtro.value.fecha_fin)
    return fechaInicio <= fechaFin
})

// Aplicar filtro de estado
const aplicarFiltroEstado = (estado) => {
    filtroEstado.value = estado
    if (estado !== null) {
        mostrarTabla.value = true
    }
}

// Limpiar todos los filtros
const limpiarFiltros = () => {
    busqueda.value = ''
    filtroEstado.value = null
    filtroTipo.value = null
    filtroModoPago.value = null
}

// KPIs calculados
const kpis = computed(() => {
    const datos = datosFiltrados.value
    
    return {
        montoTotal: datos.reduce((sum, c) => sum + parseFloat(c.importe || 0), 0),
        aprobados: datos.filter(c => c.estado === 'aprobado').length,
        pendientes: datos.filter(c => c.estado === 'pendiente').length,
        rechazados: datos.filter(c => c.estado === 'rechazado').length,
        montoAprobados: datos.filter(c => c.estado === 'aprobado')
            .reduce((sum, c) => sum + parseFloat(c.importe || 0), 0),
        montoPendientes: datos.filter(c => c.estado === 'pendiente')
            .reduce((sum, c) => sum + parseFloat(c.importe || 0), 0),
        montoRechazados: datos.filter(c => c.estado === 'rechazado')
            .reduce((sum, c) => sum + parseFloat(c.importe || 0), 0),
    }
})

// Formatear monto
const formatMonto = (value) => {
    return formatMoneda(value, 2)
}

// Formatear fecha
const formatFecha = (fecha) => {
    if (!fecha) return '-'
    try {
        return format(new Date(fecha), 'dd/MM/yyyy HH:mm')
    } catch (e) {
        return fecha
    }
}

// Severity para estados
const getSeverityEstado = (estado) => {
    switch (estado) {
        case 'aprobado': return 'success'
        case 'pendiente': return 'warn'
        case 'rechazado': return 'danger'
        default: return 'secondary'
    }
}

// Severity para modo de pago
const getSeverityModoPago = (modo) => {
    switch (modo) {
        case 'diario': return 'info'
        case 'semanal': return 'warn'
        case 'mensual': return 'success'
        default: return 'secondary'
    }
}

// Exportar a Excel
const exportarExcel = async () => {
    const datosExportar = datosFiltrados.value.map(c => ({
        'ID': c.id,
        'Documento': c.documento,
        'Cliente': c.nombre,
        'Estado': c.estado,
        'Importe': parseFloat(c.importe),
        'Interés': parseFloat(c.interes),
        'Cuota': parseFloat(c.cuota),
        'N° Cuotas': c.nro_cuotas,
        'Modo Pago': c.modo_pago,
        'Tipo Crédito': c.tipo_credito || '-',
        'TEA %': c.tea,
        'TEM %': c.tem,
        'Ahorro': parseFloat(c.ahorro),
        'Comisión': parseFloat(c.comision),
        'Aporte': parseFloat(c.aporte),
        'Moneda': c.moneda,
        'Fecha Desembolso': formatFecha(c.fecha_desembolso),
        'Fecha Creación': formatFecha(c.created_at),
    }))

    await exportToExcel(datosExportar, `dashboard_creditos_${format(new Date(), 'yyyyMMdd_HHmmss')}`)
}

// Actualizar gráficos
const actualizarGraficos = () => {
    actualizarGraficoEstados()
    actualizarGraficoTipos()
    actualizarGraficoModoPago()
    actualizarGraficoDesembolsos()
}

// Colores para modo oscuro
const getChartColors = () => {
    return {
        text: isDark.value ? '#e5e7eb' : '#374151',
        grid: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
    }
}

// Gráfico de estados
const actualizarGraficoEstados = () => {
    if (!chartEstados.value) return

    const datos = creditos_all.value
    const estados = {}
    
    datos.forEach(c => {
        estados[c.estado] = (estados[c.estado] || 0) + 1
    })

    const colores = {
        'aprobado': '#10b981',
        'pendiente': '#f59e0b',
        'rechazado': '#ef4444'
    }

    if (chartEstadosInstance) {
        chartEstadosInstance.destroy()
    }

    const chartColors = getChartColors()

    chartEstadosInstance = new Chart(chartEstados.value, {
        type: 'doughnut',
        data: {
            labels: Object.keys(estados).map(e => e.charAt(0).toUpperCase() + e.slice(1)),
            datasets: [{
                data: Object.values(estados),
                backgroundColor: Object.keys(estados).map(e => colores[e] || '#6b7280'),
                borderWidth: 2,
                borderColor: isDark.value ? '#1f2937' : '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: chartColors.text
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || ''
                            const value = context.parsed || 0
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = ((value / total) * 100).toFixed(1)
                            return `${label}: ${value} (${percentage}%)`
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index
                    const estado = Object.keys(estados)[index]
                    aplicarFiltroEstado(estado)
                    mostrarTabla.value = true
                }
            }
        }
    })
}

// Gráfico de tipos de crédito
const actualizarGraficoTipos = () => {
    if (!chartTipos.value) return

    const datos = creditos_all.value
    const tipos = {}
    
    datos.forEach(c => {
        const tipo = c.tipo_credito || 'Sin tipo'
        tipos[tipo] = (tipos[tipo] || 0) + 1
    })

    if (chartTiposInstance) {
        chartTiposInstance.destroy()
    }

    const chartColors = getChartColors()

    chartTiposInstance = new Chart(chartTipos.value, {
        type: 'bar',
        data: {
            labels: Object.keys(tipos),
            datasets: [{
                label: 'Cantidad',
                data: Object.values(tipos),
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Barras horizontales
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.grid
                    }
                },
                y: {
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.grid
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Cantidad: ${context.parsed.x}`
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index
                    const tipo = Object.keys(tipos)[index]
                    filtroTipo.value = tipo
                    mostrarTabla.value = true
                }
            }
        }
    })
}

// Gráfico de modo de pago
const actualizarGraficoModoPago = () => {
    if (!chartModoPago.value) return

    const datos = creditos_all.value
    const modos = {}
    
    datos.forEach(c => {
        modos[c.modo_pago] = (modos[c.modo_pago] || 0) + 1
    })

    const colores = {
        'diario': '#06b6d4',
        'semanal': '#f59e0b',
        'mensual': '#10b981'
    }

    if (chartModoPagoInstance) {
        chartModoPagoInstance.destroy()
    }

    const chartColors = getChartColors()

    chartModoPagoInstance = new Chart(chartModoPago.value, {
        type: 'bar',
        data: {
            labels: Object.keys(modos).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
            datasets: [{
                label: 'Cantidad',
                data: Object.values(modos),
                backgroundColor: Object.keys(modos).map(m => colores[m] || '#6b7280'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.grid
                    }
                },
                x: {
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.grid
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Cantidad: ${context.parsed.y}`
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index
                    const modo = Object.keys(modos)[index]
                    filtroModoPago.value = modo
                    mostrarTabla.value = true
                }
            }
        }
    })
}

// Gráfico de desembolsos por mes
const actualizarGraficoDesembolsos = () => {
    if (!chartDesembolsos.value) return

    const datos = creditos_all.value.filter(c => c.fecha_desembolso)
    const desembolsos = {}
    
    datos.forEach(c => {
        try {
            const fecha = new Date(c.fecha_desembolso)
            const mes = format(fecha, 'MMMM yyyy', { locale: es })
            desembolsos[mes] = (desembolsos[mes] || 0) + parseFloat(c.importe || 0)
        } catch (e) {
            // Ignorar fechas inválidas
        }
    })

    if (chartDesembolsosInstance) {
        chartDesembolsosInstance.destroy()
    }

    const chartColors = getChartColors()

    chartDesembolsosInstance = new Chart(chartDesembolsos.value, {
        type: 'line',
        data: {
            labels: Object.keys(desembolsos),
            datasets: [{
                label: 'Monto Desembolsado (S/)',
                data: Object.values(desembolsos),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => 'S/ ' + formatMonto(value),
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.grid
                    }
                },
                x: {
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.grid
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Monto: S/ ${formatMonto(context.parsed.y)}`
                    }
                }
            }
        }
    })
}

// Watch para actualizar gráficos cuando cambien los datos
watch(() => creditos_all.value, () => {
    actualizarGraficos()
}, { deep: true })

// Watch para actualizar gráficos cuando cambie el modo oscuro
watch(isDark, () => {
    actualizarGraficos()
})

// Watch para búsqueda
watch(busqueda, () => {
    // La tabla se actualiza automáticamente con el computed
})

// Lifecycle hooks
onMounted(() => {
    cargarDatos()
})

onBeforeUnmount(() => {
    if (chartEstadosInstance) chartEstadosInstance.destroy()
    if (chartTiposInstance) chartTiposInstance.destroy()
    if (chartModoPagoInstance) chartModoPagoInstance.destroy()
    if (chartDesembolsosInstance) chartDesembolsosInstance.destroy()
})
</script>

<style scoped>
.dashboard-container {
    padding: 1rem;
}

:deep(.p-datatable) {
    font-size: 0.875rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f3f4f6;
    color: #374151;
    font-weight: 600;
}

:deep(.dark .p-datatable .p-datatable-thead > tr > th) {
    background-color: #18181b;
    color: #e5e7eb;
}

:deep(.p-tag) {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
}

:deep(.border-red-500) {
    border-color: #ef4444 !important;
    border-width: 2px !important;
}
</style>