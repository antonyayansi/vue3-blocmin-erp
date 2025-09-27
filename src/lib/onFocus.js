export const onFocus = async (id, query = false) => {
    if(!query){
        const input = document.getElementById(id);
        if (input) input.focus();
    }else{
        const input = document.getElementById(id)?.querySelector('input')
        if (input) input.focus();
    }
}