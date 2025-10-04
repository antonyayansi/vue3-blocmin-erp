import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'

export const menuuser = defineStore('menuuser', {
    state: () => ({
        menuuser: [],
        user_id: null,
        userscombo: [],
    }),
    actions: {
        async getMenuUser() {
            const { data } = await baseApi.get('/menuempresacombinado', {
                params: {
                    user_id: this.user_id
                }
            })
            this.menuuser = data
        },
        async getUsersCombo() {
            const { data } = await baseApi.get('/usercombo')
            this.userscombo = data.map(item => {
                return {
                    codigo: item.id,
                    descripcion: item.name
                }
            })
        },
        async activarMenuUser(menuempresa_id) {
            const { data } = await baseApi.post('/menu_users', {
                user_id: this.user_id,
                menuempresa_id: menuempresa_id
            })
            await this.getMenuUser()
        },
        async desactivarMenuUser(menuuser_id) {
            const { data } = await baseApi.delete(`/menu_users/${menuuser_id}`)
            await this.getMenuUser()
        }
    }
})
