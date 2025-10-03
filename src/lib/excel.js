export const exportToExcel = async (data, fileName) => {
    const { utils, writeFile } = await import('xlsx/xlsx.mjs');

    const workbook = utils.book_new();
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, 'Datos');
    writeFile(workbook, `${fileName}.xlsx`);
}