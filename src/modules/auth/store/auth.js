import { defineStore } from "pinia";
import { baseApi } from "../../../services/baseApi";
import { toast } from "vue-sonner";
import { jwtVerify } from 'jose';
import { firmarJWT } from "../../../lib/jwt";

const secret = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

export const auth = defineStore("auth", {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        errorMessage: '',
        isLoading: false
    }),
    actions: {
        async checkJWToken(){
            const jwt = localStorage.getItem('bloc-user')
            if(!jwt) return false;
            try{
                const { payload } = await jwtVerify(jwt, secret)
                this.user = payload;
                this.isAuthenticated = true;
                return true
            }catch(e){
                console.error("JWT verification failed:", e);
                return false;
            }
        },
        async login(user){
            this.isLoading = true;
            try{
                const { data } = await baseApi.post('/login', user);
                if(data.status === 'error'){
                    toast.error(data.message || 'Error al iniciar sesión');
                    this.errorMessage = data.message || 'Error al iniciar sesión';
                    return
                }

                const jwt =  await firmarJWT(data.user);

                localStorage.setItem('bloc-user', jwt)
                localStorage.setItem('bloc-token', data.token)

                location.href = '/';
            }catch(e){
                console.error(e);
                toast.error(e);
                this.errorMessage = 'Error al iniciar sesión';
            }finally{
                this.isLoading = false;
            }
        },
        async onLogout(){
            localStorage.removeItem('bloc-user');
            localStorage.removeItem('bloc-token');
            localStorage.removeItem('bloc-empresa');
            localStorage.removeItem('bloc-menu');
            localStorage.removeItem('bloc-sede');
            location.href = '/login';
        }
    }
});