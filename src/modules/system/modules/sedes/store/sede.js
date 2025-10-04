import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'
import { toast } from 'vue-sonner'

export const sede = defineStore('sede', {
    state: () => ({
        pag: {
            buscar: '',
            total: 0,
            nro_pagina: 1,
            cant_reg: 10,
        },
        sedes: [],
        isLoading: false,
        openModal: false,
        new_sede: {
            name: '',
            direccion: '',
            telefono: '',
            email: '',
        },
        sede_id: null,
        step: 1,
        series: [],
        //series de la sede
        new_serie: {
            tipo_documento: '01',
            serie: '',
            sedes_id: null,
        },
        series: [],
        sedes_combo: [],
    }),
    actions: {
        resetForm() {
            this.new_sede = {
                name: '',
                direccion: '',
                telefono: '',
                email: '',
            }
            this.step = 1
        },
        async get() {
            this.isLoading = true
            try {
                const { data } = await baseApi.get('/sedes', {
                    params: this.pag
                })
                this.sedes = data.data
                this.pag.total = data.total
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },
        async store() {
            this.isLoading = true
            if (this.new_sede?.id) {
                try {
                    const { data } = await baseApi.put(`/sedes/${this.new_sede?.id}`, this.new_sede)
                    this.step = 2
                    this.get()
                    toast.success(data.message)
                    this.isLoading = false
                } catch (error) {
                    toast.error(error.response.data.message)
                    this.isLoading = false
                }
            } else {
                try {
                    const { data } = await baseApi.post('/sedes', this.new_sede)
                    this.step = 2
                    this.new_sede.id = data.id
                    this.get()
                    toast.success(data.message)
                    this.isLoading = false
                } catch (error) {
                    toast.error(error.response.data.message)
                    this.isLoading = false
                }
            }
        },
        async destroy() {
            this.isLoading = true
            try {
                const { data } = await baseApi.delete(`/sedes/${this.new_sede?.id}`)
                this.get()
                toast.success(data.message)
                this.isLoading = false
                this.openModal = false
            } catch (error) {
                toast.error(error.response.data.message)
                this.isLoading = false
            }
        },
        async getSeries() {
            try {
                const { data } = await baseApi.get(`/series`, {
                    params: {
                        sedes_id: this.new_sede?.id
                    }
                })
                this.series = data
            } catch (error) {
                console.log(error)
            }
        },
        async storeSerie() {
            this.isLoading = true
            this.new_serie.sedes_id = this.new_sede?.id
            try {
                const { data } = await baseApi.post('/series', this.new_serie)
                this.getSeries()
                toast.success(data.message)
                this.new_serie.serie = ''
                this.isLoading = false
            } catch (error) {
                toast.error(error.response.data.message)
                this.isLoading = false
            }
        },
        async destroySerie(id) {
            try {
                const { data } = await baseApi.delete(`/series/${id}`)
                this.getSeries()
                toast.success(data.message)
            } catch (error) {
                toast.error(error.response.data.message)
            }
        },
        async getsedesCombo() {
            try {
                const { data } = await baseApi.get(`/getSedesCombo`)
                this.sedes_combo = data
            } catch (error) {
                console.log(error)
            }
        }
    }
})
