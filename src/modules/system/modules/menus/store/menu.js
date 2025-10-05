import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'
import { toast } from 'vue-sonner'

export const menu = defineStore('menu', {
    state: () => ({
        menu_id: null,
        submenu_id: null,
        isLoading: false,
        openmodal: false,
        menus: [],
        menus_all: [],
        new_menu: {
            name: '',
            icon: '',
            url: '*',
            menu_id: null
        }
    }),
    actions: {
        async getMenu() {
            const { data } = await baseApi.get('/menus')
            this.menus_all = data
        },
        async postMenu() {
            this.isLoading = true
            try {
                const { data } = await baseApi.post('/menus', this.new_menu)
                toast.success(data.message)
                this.openmodal = false
                this.isLoading = false
                this.getMenu()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
        async putMenu() {
            this.isLoading = true
            try {
                const { data } = await baseApi.put(`/menus/${this.menu_id}`, this.new_menu)
                toast.success(data.message)
                this.openmodal = false
                this.isLoading = false
                this.getMenu()
            } catch (e) {
                toast.error(e.response.data.message)
                this.isLoading = false
            }
        },
        async postSubMenu(menu_id) {
            this.new_menu.menu_id = menu_id
            try {
                const { data } = await baseApi.post('/menus', this.new_menu)
                toast.success(data.message)
                this.getMenu()
                return true
            } catch (e) {
                toast.error(e.response.data.message)
                return false
            }
        },
        async putSubMenu() {
            try {
                const { data } = await baseApi.put(`/menus/${this.submenu_id}`, this.new_menu)
                toast.success(data.message)
                this.getMenu()
                return true
            } catch (e) {
                toast.error(e.response.data.message)
                return false
            }
        },
        async deleteSubMenu(id) {
            try {
                const { data } = await baseApi.delete(`/menus/${id}`)
                toast.success(data.message)
                this.getMenu()
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    },
})