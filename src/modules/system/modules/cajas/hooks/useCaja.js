import { storeToRefs } from "pinia"
import { caja } from "../store/caja"


const useCaja = () => {
    const cajaStore = storeToRefs(caja())

    return {
        ...cajaStore,
        getCajas: caja().getCajas,
        onSubmit: caja().onSubmit,
        onDelete: caja().onDelete,
        getCajaById: caja().getCajaById,
    }
}

export default useCaja