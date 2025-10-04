import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'
import { toast } from 'vue-sonner'
import { baseURLImagen } from '../../../../../services/baseApi'
import { format } from 'date-fns'
import useSystem from '../../../hooks/useSystem'

const {
    activeEmpresa: empresa_global
} = useSystem()

export const empresa = defineStore('empresa', {
    state: () => ({
        isLoading: false,
        pag: {
            buscar: '',
            total: 0,
            nro_pagina: 1,
            cant_reg: 10,
        },
        empresas: [],
        empresa_id: null,
        new_empresa: {
            nuevo: 'SI',
            ruc: '',
            razon_social: '',
            direccion: '',
            telefono: '',
        },
        //mi empresa
        new_empresa_edit: {
            ruc: '',
            razon_social: '',
            direccion: '',
            departamento: '',
            provincia: '',
            distrito: '',
            ubigueo: '',
            telefono: '',
            email: '',
            logo: '',
            logo_url: '',
            fondo: '',
            fondo_url: '',
            certificado: '',
            certificado_url: '',
            igv: 18,
            usuario_sol: '',
            pass_sol: '',
            pass_cdt: '',
            envio_sunat: 0,
            control_stock: 0
        },
        feriados: [],
        new_feriado: {
            fecha: format(new Date(), 'yyyy-MM-dd'),
            nombre: '',
        },
        step: 1,
    }),
    actions: {
        async getFeriados() {
            try {
                const { data } = await baseApi.get('/feriados')
                this.feriados = data
            } catch (e) {
                toast.error(e)
            }
        },
        async onSubmitFeriado() {
            this.isLoading = true
            try {
                const { data } = await baseApi.post('/feriados', this.new_feriado)
                toast.success(data.message)
                this.isLoading = false
                this.new_feriado = { fecha: format(new Date(), 'yyyy-MM-dd'), nombre: '' }
                await this.getFeriados()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
        async deleteFeriado(id) {
            this.isLoading = true
            try {
                const { data } = await baseApi.delete(`/feriados/${id}`)
                toast.success(data.message)
                this.isLoading = false
                await this.getFeriados()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
        async getEmpresas() {
            const { data } = await baseApi.get('/empresas', {
                params: this.pag
            })
            this.empresas = data.data
            data.data.length > 0 ? this.pag.total = data.total : this.pag.total = 0
        },
        async getEmpresaById() {
            this.isLoading = true
            try {
                const { data } = await baseApi.get(`/empresabytoken`)
                this.new_empresa_edit = data
                if (data.logo) this.new_empresa_edit.logo_url = `${baseURLImagen}${data.logo}`
                if (data.fondo) this.new_empresa_edit.fondo_url = `${baseURLImagen}${data.fondo}`
                if (data.certificado) this.new_empresa_edit.certificado_url = `${baseURLImagen}${data.certificado}`
            } catch (e) {
                toast.error(e.response.data.message)
            } finally {
                this.isLoading = false
            }
        },
        resetForm() {
            this.empresa_id = null
            this.new_empresa = {
                nuevo: 'SI',
                ruc: '',
                razon_social: '',
                direccion: '',
                telefono: '',
            }
        },
        async postEmpresa() {
            this.isLoading = true
            try {
                const { data } = await baseApi.post('/empresas', this.new_empresa)
                toast.success(data.message)
                this.isLoading = false
                this.getEmpresas()
                this.resetForm()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
        async putEmpresa() {
            this.isLoading = true
            if (this.new_empresa_edit.id) {
                this.empresa_id = this.new_empresa_edit.id
                this.new_empresa = this.new_empresa_edit
            }
            try {
                const { data } = await baseApi.put(`/empresas/${this.empresa_id}`, this.new_empresa)
                toast.success(data.message)
                this.isLoading = false
                if (this.new_empresa_edit.id) {
                    empresa_global.value = this.new_empresa
                    localStorage.setItem('_e_', btoa(JSON.stringify(this.new_empresa)))
                    return
                }
                this.getEmpresas()
                this.resetForm()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
        async deleteEmpresa() {
            this.isLoading = true
            try {
                const { data } = await baseApi.delete(`/empresas/${this.empresa_id}`)
                toast.success(data.message)
                this.isLoading = false
                this.getEmpresas()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
    },
})
