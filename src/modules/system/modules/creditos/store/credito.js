import { format } from "date-fns";
import { defineStore } from "pinia";
import { baseApi } from "../../../../../services/baseApi";
import { toast } from "vue-sonner";
import { generarCuotas } from "../utils/utilCreditos";
import useSystem from "../../../hooks/useSystem";

const {
    activeEmpresa
} = useSystem()

export const credito = defineStore("credito", {
    state: () => ({
        isLoading: false,
        creditos: [],
        pag: {
            page: 1,
            total: 0,
            cant_reg: 10,
            buscar: "",
            estado: "pendiente"
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
        resetForm() {
            this.new_credito = {
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
            }
        },
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

                const isValid = this.onValidations(this.new_credito)
                if (!isValid) return;

                // Validar el primer dia de pago no debe ser sabado, domingo o feriado
                const primeraFecha = new Date(`${this.new_credito.fecha_primer_pago} 00:00:00`);
                const isFeriado = await this.getFeriados(format(primeraFecha, 'dd/MM'));
                const isDomingo = primeraFecha.getDay() === 0;
                const isSabado = primeraFecha.getDay() === 6;

                if (isFeriado.resp || isDomingo || isSabado) {
                    toast.warning('La fecha del primer pago no debe ser sabado, domingo o feriado');
                    this.isLoading = false;
                    return;
                }

                this.new_credito.cuotas = generarCuotas(
                    `${this.new_credito.fecha_primer_pago} 00:00:00`,
                    this.new_credito.modo_pago,
                    this.new_credito.importe,
                    this.new_credito.nro_cuotas,
                    this.new_credito.tem,
                    this.new_credito.cuota_definida,
                    this.new_credito.comision,
                    isFeriado.data,
                    this.new_credito.ahorro
                )
            } catch (e) {
                toast.error(e)
            } finally {
                this.isLoading = false;
            }
        },
        onValidations(new_credito) {
            // Cuotas mayor a 0
            if (new_credito.nro_cuotas <= 0) {
                toast.error('El numero de cuotas debe ser mayor a 0');
                this.isLoading = false;
                return false;
            }
            //tea mayor a 0
            if (new_credito.tea <= 0) {
                toast.error('La T.E.A. debe ser mayor a 0');
                this.isLoading = false;
                return false;
            }
            //tem mayor a 0
            if (new_credito.tem <= 0) {
                toast.error('La T.E.M. debe ser mayor a 0');
                this.isLoading = false;
                return false;
            }
            //importe mayor a 0
            if (new_credito.importe <= 0) {
                toast.error('El importe del credito debe ser mayor a 0');
                this.isLoading = false;
                return false;
            }
            //comision no negativa
            if (new_credito.comision < 0) {
                toast.error('La comision no puede ser negativa');
                this.isLoading = false;
                return false;
            }
            //cuota definida no negativa
            if (new_credito.cuota_definida < 0) {
                toast.error('La cuota definida no puede ser negativa');
                this.isLoading = false;
                return false;
            }
            //cliente seleccionado
            if (!new_credito.clientes_id) {
                toast.error('Debe seleccionar un cliente');
                this.isLoading = false;
                return false;
            }
            return true;
        },
        async getFeriados(fecha = null) {
            try {
                const { data } = await baseApi.get("feriados");

                const filtrado = fecha ? data.filter(item => `${item.dia.toString().padStart(2, '0')}/${item.mes.toString().padStart(2, '0')}` === fecha) : data;
                const formated = data.map(item => `${item.dia.toString().padStart(2, '0')}/${item.mes.toString().padStart(2, '0')}`);

                if (filtrado.length === 0) {
                    return {
                        resp: false,
                        data: formated
                    }
                }

                return {
                    resp: true,
                    data: formated
                }
            } catch (e) {
                toast.error(e.response.data.message)
                return {
                    resp: false,
                    data: []
                }
            }
        },
        async getCreditos() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("creditos", {
                    params: this.pag
                });
                this.creditos = data.data;
                this.pag.total = data.total;
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        },
        async onSubmit() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.post("creditos", this.new_credito)
                toast.success(data.message);
                this.new_credito.id = data.creditos_id;
                await this.getCronogramaPDF(data.creditos_id);
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        },
        async onDelete(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.delete(`creditos/${id}`);
                toast.success(data.message);
                await this.getCreditos();
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        },
        async getCronogramaPDF(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("cronograma", {
                    params: { creditos_id: id }
                })
                const { default: printCronograma01 } = await import('../pdf/printCronograma01')
                await printCronograma01(activeEmpresa.value, data.credito, data.cliente, data.cronograma);
            } catch (e) {
                console.log(e)
                toast.error(e)
            } finally {
                this.isLoading = false;
            }
        }
    }
})