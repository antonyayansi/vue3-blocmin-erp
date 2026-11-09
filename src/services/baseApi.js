import axios from "axios";
import { jwtVerify } from "jose";
import { secret } from "../lib/jwt";

let empresaId = "";
const token = localStorage.getItem("bloc-token") || "";

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
    "X-Empresa": empresaId,
    "X-Sede": sedeId,
    "X-Access-Token" : token
  },
});

// Apache/cPanel strips Authorization. Also send token as query param
// (works even with cached CORS preflights that block custom headers).
baseApi.interceptors.request.use((config) => {
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["X-Access-Token"] = token;
    config.headers.Application = `Bearer ${token}`;
    config.params = { ...(config.params || {}), token };
  }
  return config;
});

baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("bloc-user");
      localStorage.removeItem("bloc-token");
      localStorage.removeItem("bloc-empresa");
      localStorage.removeItem("bloc-menu");
      localStorage.removeItem("bloc-sede");
      location.href = "/login";
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
  withCredentials: false,
});
