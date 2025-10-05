import { storeToRefs } from "pinia";
import { menu } from "../store/menu";


const useMenus = () => {
    const storeRef = storeToRefs(menu());

    return {
        ...storeRef,
        getMenu: menu().getMenu,
        postMenu: menu().postMenu,
        putMenu: menu().putMenu,
        postSubMenu: menu().postSubMenu,
        putSubMenu: menu().putSubMenu,
        deleteSubMenu: menu().deleteSubMenu,
    }
}

export default useMenus