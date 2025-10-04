import { storeToRefs } from "pinia";
import { usuario } from "../store/usuario";

const useUsuario = () => {
    const storeRef = storeToRefs(usuario());

    return {
        ...storeRef,
        getUsers: usuario().getUsers,
        postUsers: usuario().postUsers,
        resetForm: usuario().resetForm,
        putUsers: usuario().putUsers,
        deleteUsers: usuario().deleteUsers,
    }
}

export default useUsuario