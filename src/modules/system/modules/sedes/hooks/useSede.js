import { storeToRefs } from "pinia";
import { sede } from "../store/sede";


const useSede = () => {
    const storeRef = storeToRefs(sede());

    return {
        ...storeRef,
        get: sede().get,
        store: sede().store,
        resetForm: sede().resetForm,
        destroy: sede().destroy,
        getSeries: sede().getSeries,
        storeSerie: sede().storeSerie,
        destroySerie: sede().destroySerie,
        getsedesCombo: sede().getsedesCombo,
    }
}

export default useSede