import { storeToRefs } from "pinia";
import { menuuser } from "../store/menuuser";


const useMenuUser = () => {
    const storeRef = storeToRefs(menuuser());

    return {
        ...storeRef,
        getMenuUser: menuuser().getMenuUser,
        getUsersCombo: menuuser().getUsersCombo,
        activarMenuUser: menuuser().activarMenuUser,
        desactivarMenuUser: menuuser().desactivarMenuUser,
    }
}

export default useMenuUser