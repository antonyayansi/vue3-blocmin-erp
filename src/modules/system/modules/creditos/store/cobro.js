import { defineStore } from "pinia";
import { baseApi } from "../../../../../services/baseApi";
import { toast } from "vue-sonner";
import { differenceInCalendarDays, format, isBefore, parseISO } from "date-fns";
import useSystem from "../../../hooks/useSystem";

const {
    activeEmpresa,
    activeSede
} = useSystem()

export const cobro = defineStore("cobro", {
    state: () => ({
        isLoading: false,
        cliente: null,
        creditos: [],
        score: null,
        openModalPagar: false,
        buscar: '',
        new_pago: {
            creditos_id: null,
            fecha: format(new Date(), 'yyyy-MM-dd'),
            gastos: 0,
            ahorros: 0,
            monto_adicional: 0,
            observacion: '',
            tipo_pago: 'efectivo',
            total: 0,
            cuotas: [],
            dias_vencidos: 0,
            monto_x_dias: 0
        }
    }),
    actions: {
        async getCreditosByCliente() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("creditosbydni", {
                    params: {
                        documento: this.buscar
                    }
                })
                if (!data.res) {
                    toast.warning(data.cliente);
                    return;
                }
                this.cliente = data.cliente;
                this.creditos = data.creditos;
                this.score = data.score.length ? {
                    score: parseInt(data.score[0]?.score_credito_general)
                    ,
                    color: data.score[0]?.score_color_general,
                } : null;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async getCuotasByCredito(creditoId) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get(`getcuotasbycredito`, {
                    params: {
                        creditos_id: creditoId
                    }
                });
                const cuotas = data.map(cuota => {

                    let observacion = '';
                    // cuota.fecha_vencimiento : yyyy-MM-dd
                    const hoy = new Date();
                    const fechaVencimiento = parseISO(cuota.fecha_vencimiento);
                    const fechaPago = cuota.fecha_pago ? parseISO(cuota.fecha_pago) : null;

                    // Para cuotas pagadas, usar fecha_pago; para pendientes, usar fecha actual
                    const fechaReferencia = cuota.estado === 'pagado' && fechaPago ? fechaPago : hoy;

                    if (isBefore(fechaVencimiento, fechaReferencia)) {
                        const diasVencidos = differenceInCalendarDays(fechaReferencia, fechaVencimiento);
                        if (cuota.estado === 'pagado') {
                            observacion = `Pagado con ${diasVencidos} días de retraso`;
                        } else {
                            observacion = diasVencidos == 0 ? 'Vence hoy' : `Vencido hace ${diasVencidos} días`;
                        }
                    } else {
                        const diasRestantes = differenceInCalendarDays(fechaVencimiento, fechaReferencia);
                        if (cuota.estado === 'pagado') {
                            observacion = `Pagado a tiempo`;
                        } else {
                            observacion = `Faltan ${diasRestantes} días para el vencimiento`;
                        }
                    }
                    return {
                        ...cuota,
                        isSelected: false,
                        dias_vencidos: isBefore(fechaVencimiento, fechaReferencia) ? differenceInCalendarDays(fechaReferencia, fechaVencimiento) : 0,
                        observacion
                    }
                })

                let credito = this.creditos.find(c => c.id === creditoId);
                if (credito) {
                    credito.cuotas = cuotas;
                }

            } catch (e) {
                console.log(e);
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onPagarCuotas() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.post('pagarcuotas', this.new_pago);
                toast.success(data.message)
                if (data.isCompleted) {
                    await this.getCreditosByCliente();
                    await this.getCuotasByCredito(this.new_pago.creditos_id);
                } else {
                    await this.getCuotasByCredito(this.new_pago.creditos_id);
                }
                this.openModalPagar = false;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onPrintCobro(cuotaId, nro_recibo) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("imprimir", {
                    params: {
                        id: cuotaId,
                        nro_recibo
                    }
                })
                const { default: printRecibo } = await import('../pdf/printRecibo')
                await printRecibo(activeEmpresa.value, activeSede.value, data)
            } catch (e) {
                console.log(e);
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onDelete(cuotaId, nro_recibo) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.post(`rollbackcuota`, {
                    cuotaId,
                    nro_recibo
                })
                toast.success(data.message);
                await this.getCuotasByCredito(this.new_pago.creditos_id);
            } catch (e) {
                console.log(e);
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        }
    }
});