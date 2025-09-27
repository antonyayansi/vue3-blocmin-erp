import useAuth from "../modules/auth/hooks/useAuth";

const isAuth = async (to, from, next) => {
    
    const {
        checkJWToken,
    } = useAuth();
    
    const ok = await checkJWToken();

    if(ok) next();
    else next('/login');
}

export default isAuth;