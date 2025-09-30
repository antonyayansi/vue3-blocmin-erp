import { storeToRefs } from "pinia"
import { cliente } from "../store/cliente"


const useCliente = () => {
    const storeCliente = storeToRefs(cliente())

    return {
        ...storeCliente,
        getClientes: cliente().getClientes,
        onSubmit: cliente().onSubmit,
        resetForm: cliente().resetForm,
        getClienteById: cliente().getClienteById,
        onDelete: cliente().onDelete
    }
}

export default useCliente