
import useAuth from "../modules/auth/hooks/useAuth";

const isRedirect = async (to, from, next) => {

    const {
        checkJWToken,
    } = useAuth();
    
    const ok = await checkJWToken();

    if(!ok) next();
    else next('/');
}

export default isRedirect;