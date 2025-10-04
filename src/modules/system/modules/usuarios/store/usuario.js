import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'
import { toast } from 'vue-sonner'

export const usuario = defineStore('usuario', {
    state: () => ({
        pag: {
            buscar: '',
            total: 0,
            nro_pagina: 1,
            cant_reg: 10,
        },
        users: [],
        open: false,
        openDelete: false,
        user_id: null,
        new_user: {
            name: '',
            email: '',
            password: '',
            rol: '',
        },
        isLoading: false,
    }),
    actions: {
        async resetForm() {
            this.user_id = null
            this.new_user = {
                name: '',
                email: '',
                password: '',
                rol: 'user',
            }
        },
        async getUsers() {
            this.isLoading = true
            try {
                const { data } = await baseApi.get('/users', { params: this.pag })
                this.users = data.data
                this.pag.total = data.total
            } catch (error) {
                toast.error(error.response.data.message)
            } finally {
                this.isLoading = false
            }
        },
        async postUsers() {
            this.isLoading = true
            try {
                const { data } = await baseApi.post('/users', this.new_user)
                this.open = false
                toast.success(data.message)
                this.getUsers()
                this.isLoading = false
            } catch (error) {
                toast.error(error.response.data.message)
                this.isLoading = false
            }
        },
        async putUsers() {
            this.isLoading = true
            try {
                const { data } = await baseApi.put(`/users/${this.user_id}`, this.new_user)
                this.open = false
                toast.success(data.message)
                this.getUsers()
                this.isLoading = false
            } catch (error) {
                toast.error(error.response.data.message)
                this.isLoading = false
            }
        },
        async deleteUsers() {
            this.isLoading = true
            try {
                const { data } = await baseApi.delete(`/users/${this.user_id}`)
                this.openDelete = false
                toast.success(data.message)
                this.getUsers()
                this.isLoading = false
            } catch (error) {
                toast.error(error.response.data.message)
                this.isLoading = false
            }
        }
    }
})