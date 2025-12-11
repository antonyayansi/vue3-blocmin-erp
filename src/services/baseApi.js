import axios from "axios";
import { jwtVerify } from "jose";
import { secret } from "../lib/jwt";

let empresaId = "";

const storedEmpresa = localStorage.getItem("bloc-empresa");
if (storedEmpresa) {
  try {
    const data = await jwtVerify(storedEmpresa, secret);
    empresaId = data.payload?.id || "";
  } catch (err) {
    console.error("Token de empresa inválido:", err);
    empresaId = "";
  }
}

let sedeId = "";
const storedSede = localStorage.getItem("bloc-sede");
if (storedSede) {
  try {
    const data = await jwtVerify(storedSede, secret);
    sedeId = data.payload?.id || "";
  } catch (err) {
    console.error("Token de sede inválido:", err);
    sedeId = "";
  }
}

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("bloc-token") || ""}`,
    "X-Empresa": empresaId,
    "X-Sede": sedeId,
  },
});

//interceptors
baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bloc-user');
      localStorage.removeItem('bloc-token');
      localStorage.removeItem('bloc-empresa');
      localStorage.removeItem('bloc-menu');
      localStorage.removeItem('bloc-sede');
      location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const version = import.meta.env.VITE_APP_VERSION || "1.0.0";
export const baseURLImagen = import.meta.env.VITE_IMAGEN_URL || "";

export const dniApi = axios.create({
  baseURL: import.meta.env.VITE_DNI_API_URL || "",
  params: {
    token: import.meta.env.VITE_DNI_API_TOKEN || "",
  },
});