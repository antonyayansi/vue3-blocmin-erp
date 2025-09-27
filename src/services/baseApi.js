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

export const version = import.meta.env.VITE_APP_VERSION || "1.0.0";
