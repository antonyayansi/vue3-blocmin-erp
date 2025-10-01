import { storeToRefs } from "pinia"
import { autorizacion } from "../store/autorizacion"

const useAutorizacion = () => {
    const autorizacionStore = storeToRefs(autorizacion())

    return {
        ...autorizacionStore,
        getCreditos: autorizacion().getCreditos,
        onAutorizacion: autorizacion().onAutorizacion,
        onPrintDjAndPagare: autorizacion().onPrintDjAndPagare
    }
}

export default useAutorizacion