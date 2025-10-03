import { storeToRefs } from "pinia"
import { credireporte } from "../store/credireporte"

export const useCrediReporte = () => {
    const storeCreditoReporte = storeToRefs(credireporte())

    return {
        ...storeCreditoReporte,
        getLibroIngreso: credireporte().getLibroIngreso,
        searchReporte: credireporte().searchReporte
    }
}