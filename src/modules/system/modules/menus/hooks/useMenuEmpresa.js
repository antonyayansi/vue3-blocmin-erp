import { storeToRefs } from "pinia";
import { menuempresa } from "../store/menuempresa";


const useMenuEmpresa = () => {
    const storeRef = storeToRefs(menuempresa());

    return {
        ...storeRef,
        getEmpresasCombo: menuempresa().getEmpresasCombo,
        getMenusEmpresa: menuempresa().getMenusEmpresa,
        activarMenuEmpresa: menuempresa().activarMenuEmpresa,
        desactivarMenuEmpresa: menuempresa().desactivarMenuEmpresa
    }
}

export default useMenuEmpresa