import { storeToRefs } from "pinia"
import { credito } from "../store/credito"

const useCredito = () => {
    const creditoStore = storeToRefs(credito())

    return {
        ...creditoStore,
        getClientes: credito().getClientes,
        generateCuotas: credito().generateCuotas,
        onSubmit: credito().onSubmit,
        getCreditos: credito().getCreditos,
        onDelete: credito().onDelete,
        resetForm: credito().resetForm,
        getCronogramaPDF: credito().getCronogramaPDF
    }
}

export default useCredito