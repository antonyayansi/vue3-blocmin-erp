import { storeToRefs } from "pinia";
import { auth } from "../store/auth";

const useAuth = () => {
    const storeLogin = storeToRefs(auth());

    return {
        ...storeLogin,
        login: auth().login,
        checkJWToken: auth().checkJWToken,
        onLogout: auth().onLogout,
    }
}

export default useAuth;