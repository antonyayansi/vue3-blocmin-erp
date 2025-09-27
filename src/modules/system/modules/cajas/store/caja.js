import { defineStore } from "pinia";
import { baseApi } from "../../../../../services/baseApi";
import { toast } from "vue-sonner";

export const caja = defineStore("caja", {
    state: () => ({
        isLoading: false,
        openModal: false,
        openModalCerrar: false,
        cajas: [],
        pag: {
            page: 1,
            total: 0,
            cant_reg: 10,
            buscar: "",
        },
        new_caja: {
            monto_final: 0,
            monto_inicial: 0,
            name: "",
        },
    }),
    actions: {
        resetForm() {
            this.new_caja = {
                monto_final: 0,
                monto_inicial: 0,
                name: "",
            };
        },
        async getCajas() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("cajas", {
                    params: this.pag,
                });
                this.cajas = data.data;
                this.pag.total = data.total;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async getCajaById(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get(`cajas/${id}`);
                this.new_caja = data;
                this.new_caja.id = id;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onSubmit() {
            this.isLoading = true;
            if (this.new_caja.id) {
                try {
                    const { data } = await baseApi.put(`cajas/${this.new_caja.id}`, {
                        estado: 0
                    });
                    toast.success(data.message);
                    this.openModal = false;
                    this.openModalCerrar = false;
                    await this.getCajas();
                    this.resetForm();
                } catch (e) {
                    toast.error(e.response.data.message);
                } finally {
                    this.isLoading = false;
                }
            } else {
                try {
                    const { data } = await baseApi.post("cajas", this.new_caja);
                    toast.success(data.message);
                    this.openModal = false;
                    await this.getCajas();
                    this.resetForm();
                } catch (e) {
                    toast.error(e.response.data.message);
                } finally {
                    this.isLoading = false;
                }
            }
        },
        async onDelete(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.delete(`cajas/${id}`);
                toast.success(data.message);
                await this.getCajas();
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        }
    },
});
