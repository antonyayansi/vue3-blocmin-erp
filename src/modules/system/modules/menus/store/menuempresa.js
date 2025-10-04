import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'

export const menuempresa = defineStore('menuempresa', {
    state: () => ({
        empresa_id: '',
        empresas_combo: [],
        menus_empresa: []
    }),
    actions: {
        async getEmpresasCombo() {
            const { data } = await baseApi.get('/empresacombo')
            this.empresas_combo = data.map(item => {
                return {
                    codigo: item.id,
                    descripcion: item.razon_social
                }
            })
        },
        async getMenusEmpresa() {
            const { data } = await baseApi.get('/menuempresa', {
                params: {
                    empresa_id: this.empresa_id
                }
            })
            this.menus_empresa = data
        },
        async activarMenuEmpresa(menu_id) {
            const { data } = await baseApi.post('/menuempresa', {
                empresa_id: this.empresa_id,
                menu_id: menu_id
            })
            await this.getMenusEmpresa()
            // toast.success(data.message)
        },
        async desactivarMenuEmpresa(menu_id) {
            const { data } = await baseApi.delete(`/menuempresa/${menu_id}`)
            await this.getMenusEmpresa()
            // toast.success(data.message)
        }
    }
})