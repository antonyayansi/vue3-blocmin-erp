import { format } from "date-fns";
import { defineStore } from "pinia";
import { baseApi } from "../../../../../services/baseApi";
import { toast } from "vue-sonner";
import Decimal from "decimal.js-light";
import { generarCuotas, getDividendo } from "../utils/utilCreditos";

export const credito = defineStore("credito", {
    state: () => ({
        isLoading: false,
        creditos: [],
        pag: {
            page: 1,
            total: 0,
            cant_reg: 10,
            buscar: "",
        },
        openPanel: true,
        new_credito: {
            aporte: 0,
            ahorro: 0,
            clientes_id: null,
            comision: 0,
            cuota_definida: 0,
            cuotas: [],
            fecha_primer_pago: format(new Date(), 'yyyy-MM-dd'),
            importe: 1,
            isInteresVariable: true,
            modo_pago: "mensual",
            moneda: 'PEN',
            nro_cuotas: 0,
            tea: 0,
            ted: 0,
            tem: 0,
            tipo_cambio: 3.8
        },
        comboClientes: []
    }),
    actions: {
        async getClientes() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("clientes_combo");
                this.comboClientes = data;
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        },
        async generateCuotas() {
            this.isLoading = true;
            try {
                // Validar el primer dia de pago no debe ser sabado, domingo o feriado
                const primeraFecha = new Date(`${this.new_credito.fecha_primer_pago} 00:00:00`);
                const isFeriado = await this.getFeriados(format(primeraFecha, 'dd/MM'));
                const isDomingo = primeraFecha.getDay() === 0;
                const isSabado = primeraFecha.getDay() === 6;

                if (isFeriado || isDomingo || isSabado) {
                    toast.error('La fecha del primer pago no debe ser sabado, domingo o feriado');
                    this.isLoading = false;
                    return;
                }

                const cuotas = generarCuotas(
                    `${this.new_credito.fecha_primer_pago} 00:00:00`,
                    this.new_credito.modo_pago,
                    this.new_credito.importe,
                    this.new_credito.nro_cuotas,
                    this.new_credito.tem,
                    this.new_credito.cuota_definida,
                    this.new_credito.comision
                )

                console.log(cuotas);

            } catch (e) {
                toast.error(e)
            } finally {
                this.isLoading = false;
            }
        },
        async getFeriados(fecha = null) {
            try {
                const { data } = await baseApi.get("feriados");

                const filtrado = fecha ? data.filter(item => `${item.dia.toString().padStart(2, '0')}/${item.mes.toString().padStart(2, '0')}` === fecha) : data;

                if (filtrado.length === 0) {
                    return false
                }

                return true
            } catch (e) {
                toast.error(e.response.data.message)
                return false;
            }
        }
    }
})