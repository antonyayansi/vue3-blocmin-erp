import { defineStore } from "pinia";
import { baseApi } from "../../../../../services/baseApi";
import { toast } from "vue-sonner";
import { exportToExcel } from "../../../../../lib/excel";
import { format, differenceInDays } from "date-fns";

export const credireporte = defineStore("credireporte", {
    state: () => ({
        libroingresos: [],
        libroingresos_filtrado: [],
        estados_credito: [],
        isLoading: false,
        //para filtrar
        buscar: '',
        //movimientos credito
        pag: {
            buscar: '',
            total: 0,
            page: 1,
            cant_reg: 10,
            fecha_inicio: format(new Date(), 'yyyy-MM-dd'),
            fecha_fin: format(new Date(), 'yyyy-MM-dd'),
        },
        movimientos: []
    }),
    actions: {
        async getLibroIngreso(exportar = false) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("resumenCreditos")
                if (exportar) {
                    await exportToExcel(data, `libro_de_ingreso_${new Date().getTime()}`)
                } else {
                    this.libroingresos = data
                    this.libroingresos_filtrado = data
                }
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        },
        searchReporte() {
            if (!this.buscar.trim()) {
                // Si no hay texto de búsqueda, mostrar todos los datos
                this.libroingresos_filtrado = this.libroingresos;
                return;
            }

            const searchTerm = this.buscar.toLowerCase().trim();

            this.libroingresos_filtrado = this.libroingresos.filter(item => {
                const dni = item.DNI?.toLowerCase() || '';
                const nombre = item.Nombre?.toLowerCase() || '';

                // Buscar en DNI o nombre
                return dni.includes(searchTerm) || nombre.includes(searchTerm);
            });
        },
        async getEstadosCredito() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("reporteCreditos")
                this.estados_credito = data
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        },
        async getMovimientosCredito() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("movimientos_credito", {
                    params: this.pag
                })
                this.movimientos = data.data.map(item => {
                    const fechaPago = new Date(`${item.fecha_pago} 00:00:00`);
                    const fechaVencimiento = new Date(`${item.fecha_vencimiento} 00:00:00`);
                    const isAtrasado = fechaPago > fechaVencimiento;

                    // Calcular días de atraso solo si está atrasado
                    const diasAtraso = isAtrasado
                        ? differenceInDays(fechaPago, fechaVencimiento)
                        : 0;

                    return {
                        ...item,
                        isAtrasado,
                        diasAtraso
                    }

                })
                this.pag.total = data.total;
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        }
    }
})