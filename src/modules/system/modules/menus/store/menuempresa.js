import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'

export const menuempresa = defineStore('menuempresa', {
    state: () => ({
        isLoading: false,
        empresa_id: '',
        empresas_combo: [],
        menus_empresa: []
    }),
    actions: {
        async getEmpresasCombo() {
            this.isLoading = true
            try{
                const { data } = await baseApi.get('/empresacombo')
                this.empresas_combo = data.map(item => {
                    return {
                        codigo: item.id,
                        descripcion: item.razon_social
                    }
                })
            }catch(e){
                toast.error(e.response.data.message)
            }finally{
                this.isLoading = false
            }
        },
        async getMenusEmpresa() {
            this.isLoading = true
            try{
                const { data } = await baseApi.get('/menuempresa', {
                    params: {
                        empresa_id: this.empresa_id
                    }
                })
                this.menus_empresa = data
            }catch(e){
                toast.error(e.response.data.message)
            }finally{
                this.isLoading = false
            }
        },
        async activarMenuEmpresa(menu_id) {
            this.isLoading = true
            try{
                const { data } = await baseApi.post('/menuempresa', {
                    empresa_id: this.empresa_id,
                    menu_id: menu_id
                })
                await this.getMenusEmpresa()
                // toast.success(data.message)
            }catch(e){
                toast.error(e.response.data.message)
            }finally{
                this.isLoading = false
            }
        },
        async desactivarMenuEmpresa(menu_id) {
            this.isLoading = true
            try{
                const { data } = await baseApi.delete(`/menuempresa/${menu_id}`)
                await this.getMenusEmpresa()
                // toast.success(data.message)
            }catch(e){
                toast.error(e.response.data.message)
            }finally{
                this.isLoading = false
            }
        }
    }
})