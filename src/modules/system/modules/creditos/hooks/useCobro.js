import { storeToRefs } from "pinia"
import { cobro } from "../store/cobro"

const useCobro = () => {
    const storeCobro = storeToRefs(cobro())

    return {
        ...storeCobro,
        getCreditosByCliente: cobro().getCreditosByCliente,
        getCuotasByCredito: cobro().getCuotasByCredito,
        onPagarCuotas: cobro().onPagarCuotas,
        onPrintCobro: cobro().onPrintCobro
    }
}

export default useCobro