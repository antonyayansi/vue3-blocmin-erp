import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { baseApi, dniApi } from "../../../../../services/baseApi";

export const cliente = defineStore("cliente", {
    state: () => ({
        openModal: false,
        pag: {
            page: 1,
            total: 0,
            cant_reg: 10,
            buscar: ""
        },
        isLoading: false,
        clientes: [],
        new_cliente: {
            tipo_documento: "1",
            documento: "",
            nombre: "",
            razon_social: "",
            direccion: "",
            direccion_laboral: "",
            telefono: "",
            telefono_ref1: "",
            telefono_ref2: "",
            email: ""
        }
    }),
    actions: {
        resetForm() {
            this.new_cliente = {
                tipo_documento: "1",
                documento: "",
                nombre: "",
                razon_social: "",
                direccion: "",
                direccion_laboral: "",
                telefono: "",
                email: ""
            }
        },
        async getDataByDNI() {
            if(this.new_cliente.documento.length !== 8) {
                return;
            }
            this.isLoading = true;
            try {
                const { data } = await dniApi.post(`/consulta-dni`, {
                    dni: this.new_cliente.documento
                });
                this.new_cliente.nombre = data.nombre + " " + data.apellidoPaterno + " " + data.apellidoMaterno;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async getClientes() {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get("clientes", { params: this.pag });
                this.clientes = data.data;
                this.pag.total = data.total;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async getClienteById(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.get(`clientes/${id}`);
                this.new_cliente = data;
                this.openModal = true;
            } catch (e) {
                toast.error(e.response.data.message);
            } finally {
                this.isLoading = false;
            }
        },
        async onSubmit() {
            this.isLoading = true;
            if (this.new_cliente.id) {
                try {
                    const { data } = await baseApi.put(`clientes/${this.new_cliente.id}`, this.new_cliente);
                    toast.success(data.message);
                    this.openModal = false;
                    await this.getClientes();
                } catch (e) {
                    toast.error(e.response.data.message)
                } finally {
                    this.isLoading = false;
                }
            } else {
                try {
                    const { data } = await baseApi.post("clientes", this.new_cliente);
                    toast.success(data.message);
                    this.openModal = false;
                    await this.getClientes();
                } catch (e) {
                    toast.error(e.response.data.message)
                } finally {
                    this.isLoading = false;
                }
            }
        },
        async onDelete(id) {
            this.isLoading = true;
            try {
                const { data } = await baseApi.delete(`clientes/${id}`);
                toast.success(data.message);
                await this.getClientes();
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false;
            }
        }
    }
})