import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'

export const menuuser = defineStore('menuuser', {
    state: () => ({
        isLoading: false,
        menuuser: [],
        user_id: null,
        userscombo: [],
    }),
    actions: {
        async getMenuUser() {
            this.isLoading = true
            try{
                const { data } = await baseApi.get('/menuempresacombinado', {
                    params: {
                        user_id: this.user_id
                    }
                })
                this.menuuser = data
            }catch(e){
                console.error(e)
            }finally{
                this.isLoading = false
            }
        },
        async getUsersCombo() {
            this.isLoading = true
            try{
                const { data } = await baseApi.get('/usercombo')
                this.userscombo = data.map(item => {
                    return {
                        codigo: item.id,
                        descripcion: item.name
                    }
                })
            }catch(e){
                console.error(e)
            }finally{
                this.isLoading = false
            }
        },
        async activarMenuUser(menuempresa_id) {
            this.isLoading = true
            try{
                const { data } = await baseApi.post('/menu_users', {
                    user_id: this.user_id,
                    menuempresa_id: menuempresa_id
                })
                await this.getMenuUser()
            }catch(e){
                console.error(e)
            }finally{
                this.isLoading = false
            }
        },
        async desactivarMenuUser(menuuser_id) {
            this.isLoading = true
            try{
                const { data } = await baseApi.delete(`/menu_users/${menuuser_id}`)
                await this.getMenuUser()
            }catch(e){
                console.error(e)
            }finally{
                this.isLoading = false
            }
        }
    }
})
