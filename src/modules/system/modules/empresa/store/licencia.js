import { defineStore } from 'pinia'
import { baseApi } from '../../../../../services/baseApi'
import { toast } from 'vue-sonner'

export const licencia = defineStore('licencia', {
    state: () => ({
        status: null,
        pagos: []
    }),
    actions: {
        async getStatus() {
            try {
                const { data } = await baseApi.get('/licencia_status')
                if (data?.is_active) {
                    this.status = data
                }
            } catch (e) {
                toast.error(e.response.data.message)
            }
        }
    }
})