// Imagen en Base64 (1px transparente, evita errores de imágenes no cargadas)
const blankImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/Upa8OIAAAAASUVORK5CYII=";

// Función para cargar imágenes con fallback en Base64
// Descarga una URL y la convierte a dataURL (base64). Si falla devuelve `blankImage`.
export async function loadImage(url) {
    if (!url) return blankImage;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`No se pudo obtener la imagen (${res.status}): ${url}`);
            return blankImage;
        }
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(new Error('Failed to read blob as dataURL'));
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (err) {
        console.warn(`Error al descargar la imagen: ${url}`, err);
        return blankImage;
    }
}