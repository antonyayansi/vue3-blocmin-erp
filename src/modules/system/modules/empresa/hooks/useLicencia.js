import { storeToRefs } from "pinia";
import { licencia } from "../store/licencia";


const useLicencia = () => {
    const storeRef = storeToRefs(licencia());

    return {
        ...storeRef,
        getStatus: licencia().getStatus
    }
}

export default useLicencia