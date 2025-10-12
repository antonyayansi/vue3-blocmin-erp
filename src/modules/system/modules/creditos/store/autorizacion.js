import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { baseApi } from "../../../../../services/baseApi";
import useSystem from "../../../hooks/useSystem";

const {
    activeEmpresa
} = useSystem()

export const autorizacion = defineStore("autorizacion", {
    state: () => ({
        pag: {
            page: 1,
            total: 0,
            cant_reg: 10,
            buscar: "",
            estado: "pendiente"
        },
        creditos: [],
        isLoading: false,
        openModal: false,
        new_autorizacion: null,
        tipo_credito: [
            { codigo: '1 CRÉDITO DE CONSUMO', descripcion: '1 CRÉDITO DE CONSUMO' },
            { codigo: '1.1 CRÉDITO DE CONSUMO', descripcion: '1.1 CRÉDITO DE CONSUMO' },
            { codigo: '1.2 CRÉDITO RECURRENTE', descripcion: '1.2 CRÉDITO RECURRENTE' },
            { codigo: '2 CRÉDITO MICROCRÉDITO Y PYMES', descripcion: '2 CRÉDITO MICROCRÉDITO Y PYMES' },
            { codigo: '2.1 MICROCRÉDITO', descripcion: '2.1 MICROCRÉDITO' },
            { codigo: '2.2 CRÉDITO AL TOQUE', descripcion: '2.2 CRÉDITO AL TOQUE' },
            { codigo: '2.3 CRÉDITO CAMPAÑA', descripcion: '2.3 CRÉDITO CAMPAÑA' },
            { codigo: '2.4 CRÉDITO CONTIGO MYPE', descripcion: '2.4 CRÉDITO CONTIGO MYPE' },
            { codigo: '3 CRÉDITO PERSONAL', descripcion: '3 CRÉDITO PERSONAL' },
            { codigo: '3.1 CRÉDITO PRENDARIO', descripcion: '3.1 CRÉDITO PRENDARIO' },
            { codigo: '3.2 DESCUENTO POR PLANILLA', descripcion: '3.2 DESCUENTO POR PLANILLA' },
            { codigo: '3.3 GARANTÍA A PLAZO FIJO', descripcion: '3.3 GARANTÍA A PLAZO FIJO' },
            { codigo: '3.4 CRÉDITO FAMILIAR', descripcion: '3.4 CRÉDITO FAMILIAR' },
            { codigo: '4 CRÉDITO GARANTIZADO', descripcion: '4 CRÉDITO GARANTIZADO' },
            { codigo: '5 CRÉDITO REPROGRAMADO', descripcion: '5 CRÉDITO REPROGRAMADO' },
            { codigo: '6 CRÉDITO REFINANCIADO', descripcion: '6 CRÉDITO REFINANCIADO' },
        ]
    }),
    actions: {
        async getCreditos() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("creditos", { params: this.pag });
                this.creditos = data.data;
                this.pag.total = data.total;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onAutorizacion() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.post(this.new_autorizacion?.tipo == 'Aprobacion'
                    ? "autorizaciones"
                    : "anulaciones", this.new_autorizacion);
                toast.success(data.message);
                await this.getCreditos();
                if (this.new_autorizacion?.tipo == 'Aprobacion') {
                    await this.onPrintDjAndPagare(this.new_autorizacion.id, true);
                }
                this.openModal = false;
                this.new_autorizacion = null;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onPrintDjAndPagare(creditos_id, isnew) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("pagare", {
                    params: {
                        creditos_id,
                        isnew
                    }
                })
                const { default: printDJ } = await import('../pdf/printDJ');
                const { default: printPagare } = await import('../pdf/printPagare');
                await printDJ(activeEmpresa.value, data.credito, data.cliente);
                await printPagare(activeEmpresa.value, data.credito, data.cliente);
            } catch (e) {

            } finally {
                this.isLoading = false;
            }
        },
        async onPrintDesembolso(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("reportDesembolso", {
                    params: {
                        creditos_id: id
                    }
                })
                const { default: printDesembolso } = await import('../pdf/printDesembolso');
                await printDesembolso(activeEmpresa.value, data);
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        }
    }
})