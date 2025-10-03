import { defineStore } from "pinia";
import { baseApi } from "../../../../../services/baseApi";
import { toast } from "vue-sonner";
import { exportToExcel } from "../../../../../lib/excel";

export const credireporte = defineStore("credireporte", {
    state: () => ({
        libroingresos: [],
        libroingresos_filtrado: [],
        isLoading: false,
        //para filtrar
        buscar: ''
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
        }
    }
})