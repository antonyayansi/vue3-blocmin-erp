import { storeToRefs } from "pinia";
import { system } from "../store/system";

const useSystem = () => {
    const storeSystem = storeToRefs(system());

    return {
        ...storeSystem,
        getEmpresas: system().getEmpresas,
        checkEmpresa: system().checkEmpresa,
        selectEmpresa: system().selectEmpresa,
        checkStatusSidebar: system().checkStatusSidebar,
        toggleSidebar: system().toggleSidebar,
        getMenus: system().getMenus,
        checkMenus: system().checkMenus,
        getSedes: system().getSedes,
        selectSede: system().selectSede,
        checkSede: system().checkSede
    }
}

export default useSystem;