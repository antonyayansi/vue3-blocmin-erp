import { storeToRefs } from "pinia";
import { empresa } from "../store/empresa";

const useEmpresa = () => {
    const storeRef = storeToRefs(empresa());

    return {
        ...storeRef,
        getEmpresas: empresa().getEmpresas,
        resetForm: empresa().resetForm,
        postEmpresa: empresa().postEmpresa,
        deleteEmpresa: empresa().deleteEmpresa,
        putEmpresa: empresa().putEmpresa,
        getEmpresaById: empresa().getEmpresaById,
        getFeriados: empresa().getFeriados,
        onSubmitFeriado: empresa().onSubmitFeriado,
        deleteFeriado: empresa().deleteFeriado,
    }
}

export default useEmpresa