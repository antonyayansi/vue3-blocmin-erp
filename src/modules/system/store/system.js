import { defineStore } from "pinia";
import { baseApi } from "../../../services/baseApi";
import { toast } from "vue-sonner";
import { firmarJWT, secret } from "../../../lib/jwt";
import { jwtVerify } from "jose";

export const system = defineStore("system", {
  state: () => ({
    openModalSede: false,
    isLoading: false,
    menus: [],
    empresas: [],
    activeEmpresa: null,
    sedes: [],
    activeSede: null,
    //UI
    openSidebar: false,
  }),
  actions: {
    async getEmpresas() {
      this.isLoading = true;
      try {
        const { data } = await baseApi.get("/misempresas");
        this.empresas = data;
        if (data.length === 1) {
          this.activeEmpresa = data[0];
          const jwtEmpresa = await firmarJWT(this.activeEmpresa);
          localStorage.setItem("bloc-empresa", jwtEmpresa);
        }
      } catch (e) {
        toast.error(
          e?.response?.data?.message || "Error al cargar las empresas"
        );
      } finally {
        this.isLoading = false;
      }
    },
    async selectEmpresa(empresa) {
      const jwtEmpresa = await firmarJWT(JSON.parse(JSON.stringify(empresa)));
      localStorage.setItem("bloc-empresa", jwtEmpresa);
      location.reload();
    },
    async checkEmpresa() {
      const jwt = localStorage.getItem("bloc-empresa");
      if (!jwt) return;
      try {
        const payload = await jwtVerify(jwt, secret);
        this.activeEmpresa = payload.payload;
      } catch (e) {
        console.error("JWT verification failed:", e);
      }
    },
    async getSedes() {
      this.isLoading = true;
      try {
        const { data } = await baseApi.get("sedes", {
          page: 1,
          cant_reg: 999,
        });
        this.sedes = data.data;
      } catch (e) {
        toast.error(e.response.data.message);
      } finally {
        this.isLoading = false;
      }
    },
    async selectSede(sede) {
      const jwtSede = await firmarJWT(JSON.parse(JSON.stringify(sede)));
      localStorage.setItem("bloc-sede", jwtSede);
      location.reload();
    },
    async checkSede() {
      if (!localStorage.getItem("bloc-empresa")) return;
      const jwt = localStorage.getItem("bloc-sede");
      if (!jwt) {
        this.openModalSede = true;
        return;
      }
      try {
        const payload = await jwtVerify(jwt, secret);
        this.activeSede = payload.payload;
      } catch (e) {
        console.error("JWT verification failed:", e);
      }
    },
    checkStatusSidebar() {
      this.openSidebar = localStorage.getItem("bloc-sidebar") ? true : false;
    },
    toggleSidebar() {
      this.openSidebar = !this.openSidebar;
      if (this.openSidebar) {
        localStorage.setItem("bloc-sidebar", true);
      } else {
        localStorage.removeItem("bloc-sidebar");
      }
    },
    async getMenus() {
      this.isLoading = true;
      try {
        const { data } = await baseApi.get("/menu_users");
        this.menus = data;
        let jwtMenu = await firmarJWT({
          menus: JSON.parse(JSON.stringify(this.menus)),
        });
        localStorage.setItem("bloc-menu", jwtMenu);
      } catch (e) {
        toast.error(e?.response?.data?.message || "Error al cargar los menús");
      } finally {
        this.isLoading = false;
      }
    },
    async checkMenus() {
      if (!localStorage.getItem("bloc-empresa")) return;
      const jwt = localStorage.getItem("bloc-menu");
      if (!jwt) {
        await this.getMenus();
        return;
      }
      try {
        const payload = await jwtVerify(jwt, secret);
        this.menus = payload.payload.menus;
        return;
      } catch (e) {
        console.error("JWT verification failed:", e);
      }
    },
  },
});
