import { storeToRefs } from "pinia"
import { credito } from "../store/credito"

const useCredito = () => {
    const creditoStore = storeToRefs(credito())

    return {
        ...creditoStore,
        getClientes: credito().getClientes,
        generateCuotas: credito().generateCuotas
    }
}

export default useCredito