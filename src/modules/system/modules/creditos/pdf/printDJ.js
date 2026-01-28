
import { format } from "date-fns";
import { meses } from "../helpers/formats";
import { loadImage } from "../../../../../lib/loadImage";
import { baseURLImagen } from "../../../../../services/baseApi";

const reportDJ = async (empresa, credito, cliente) => {

    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const [img] = await Promise.all([
        loadImage(`${baseURLImagen}${empresa.logo}`),
    ])

    // horizontal line
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.setFont(undefined, 'normal')
    doc.text(`Al amparo del art. 179º de la Ley General del Sistema Financiero y del Sistema de Seguros y Orgánica de la Superintendencia de Banca y Seguros, realizo (sanos) la presente Declaración Jurada cuya información a continuación se describe:`,
        15, 35, { align: 'justify', maxWidth: 180 })

    doc.text('Yo (nosotros):', 15, 50)
    doc.setFont(undefined, 'bold')
    doc.text(`${cliente.nombre}`, 40, 50)
    doc.setFont(undefined, 'normal')
    doc.text('con DNI N°', 15, 55)
    doc.setFont(undefined, 'bold')
    doc.text(`${cliente.documento}`, 40, 55)
    doc.setFont(undefined, 'normal')
    doc.text('estado civil ____________________', 60, 55)
    doc.text(`de ocupación: ${cliente.razon_social ?? '_________________________'}`, 120, 55)
    doc.text(`Y (nombre de cónyuge o conviviente) _____________________________ Con DNI Nº __________________ de ocupación _________________________________ señalando por mi (nuestro) domicilio _____________________________ distrito __________________ departamento __________________`,
        15, 60, { align: '', maxWidth: 180 })
    doc.setFont(undefined, 'bold')
    doc.text('Declaro(amos) poseer y son de mí (nuestra) propiedad los siguientes bienes:', 15, 80)
    doc.text('1. ARTEFACTOS', 20, 85)
    //TABLA DE 4 COLUMNAS Y 6 FILAS
    autoTable(doc, {
        startY: 88,
        margin: { top: 0, right: 10, bottom: 0, left: 20 },
        head: [['Clase y descripción del Bien', 'N° Factura/Boleta', 'N° Serie', 'Valor']],
        body: [
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
            ['', '', '', ''],
        ],
        theme: 'plain',
        styles: {
            fontSize: 8,
            cellPadding: 1,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            columnWidth: 'auto',
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: { columnWidth: 85 },
            1: { columnWidth: 30 },
            2: { columnWidth: 30 },
            3: { columnWidth: 30 },
        },
        didDrawCell: (data) => {
        }
    })

    doc.setFont(undefined, 'normal')
    doc.text(`Los bienes antes descritos, los ofrezco como garantía por el préstamo (s) otorgado (s), esta Garantía Mobiliaria cumple con los alcances del art. 03 de la Ley Nº 28677, constituyéndome en Depositario de los mismos no pudiendo efectuar actos de disposición (venta, permuta, donación), sobre estos bienes, mientras existan obligaciones contraídas de manera directa ó indirecta. PARA TAL EFECTO AUTORIZO EL SECUESTRO DE LOS MISMOS. en el caso del inicio de un proceso judicial o en su defecto VOLUNTARIAMENTE entregare los bienes para evitar el Embargo Judicial.`,
        15, 125, { align: 'justify', maxWidth: 180 })
    doc.setFont(undefined, 'bold')
    doc.text('2. BIENES INMUEBLES', 20, 155)
    //tabla con ubicacion, tipo de uso(*), valor declarado
    autoTable(doc, {
        startY: 158,
        margin: { top: 0, right: 10, bottom: 0, left: 20 },
        head: [['Ubicación', 'Tipo de Uso(*)', 'Valor Declarado']],
        body: [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ],
        theme: 'plain',
        styles: {
            fontSize: 8,
            cellPadding: 1,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            columnWidth: 'auto',
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: { columnWidth: 100 },
            1: { columnWidth: 45 },
            2: { columnWidth: 30 },
        },
        didDrawCell: (data) => {
        }
    })
    doc.setFont(undefined, 'normal')
    doc.text(`(*)a/Vivienda b/ Comercial c/ Industrial d/ Agrícola e/otros`, 15, 185)
    doc.setFont(undefined, 'bold')
    doc.text('3. AUTOMOVILES Y/O MAAUMANAS', 20, 190)
    //tabla con marca y tipo, modelo, año fabric., Placa Rodaje, Valor Estimado
    autoTable(doc, {
        startY: 193,
        margin: { top: 0, right: 10, bottom: 0, left: 20 },
        head: [['Marca y Tipo', 'Modelo', 'Año Fabric.', 'Placa Rodaje', 'Valor Estimado']],
        body: [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
        ],
        theme: 'plain',
        styles: {
            fontSize: 8,
            cellPadding: 1,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            columnWidth: 'auto',
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
        columnStyles: {
            0: { columnWidth: 55 },
            1: { columnWidth: 30 },
            2: { columnWidth: 30 },
            3: { columnWidth: 30 },
            4: { columnWidth: 30 },
        },
        didDrawCell: (data) => {
        }
    })

    doc.setFont(undefined, 'normal')
    doc.text(`Así mismo declaro que tengo conocimiento del contenido y alcances de lo prescrito por el art. 179º de la Ley Nº 26702 Ley General del Sistema Financiero y las sanciones de carácter penal (art. 247° del Código Penal), que establece la norma en caso de falsedad en la información brindada e incumplimiento de todo lo declarado.`,
        15, 220, { align: 'justify', maxWidth: 180 })
    doc.text(`Al amparo del art. 729° del C.P.C. YO (NOSOTROS) y ${empresa.razon_social} CONVENIMOS que en el caso que nuestros bienes sean embargados ${empresa.razon_social} alcanzara una Tasación del (los) bien (es) de mi (nuestra) propiedad al Juzgado para dar mi (nuestra) aprobación, al ser notificados de acuerdo a ley y en los plazos establecidos.`,
        15, 235, { align: 'justify', maxWidth: 180 })

    //fecha a la izquierda
    doc.setTextColor(0, 0, 0)
    doc.setFont(undefined, 'normal')
    //estraer el dia, mes y año de 2023-11-18
    let dia = format(new Date(credito.fecha_desembolso), 'dd')
    let mes = format(new Date(credito.fecha_desembolso), 'MM')
    let anio = format(new Date(credito.fecha_desembolso), 'yyyy')

    doc.text(`${dia} de ${meses[mes - 1]} del ${anio}`, 195, 255, { align: 'right' })

    doc.setLineWidth(0.1)
    doc.line(25, 275, 80, 275)
    doc.line(120, 275, 170, 275)

    doc.text('Firma Solicitante (aval y/o fiador)', 25, 280)
    doc.text('Firma Cónyuge y/o Cotitular', 120, 280)

    //dni debajo de la firma
    doc.setFont(undefined, 'bold')
    doc.text(`DNI N°:`, 25, 285)
    doc.text(`DNI N°:`, 120, 285)

    var pageCount = doc.internal.getNumberOfPages();
    //HEADER AND FOOTER - repeat on All pages 🦏
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.addImage(img, 'jpg', 10, 5, 18, 15)
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 139)
        doc.setFont(undefined, 'bold')
        doc.text(empresa.nombre_comercial, 32, 10)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(8)
        doc.text(`Prov. ${empresa.departamento ?? ''} - ${empresa.provincia ?? ''} - ${empresa.distrito ?? ''}`, 32, 14)
        doc.text(`SEDE: ${empresa.sede}`, 32, 18)
        doc.setTextColor(112, 2, 2)
        doc.setFontSize(4)

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(8)
        doc.text(`Página ${i} de ${pageCount}`, 200, 10, { align: 'right' })
        doc.text(`Impreso el ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`, 200, 15, { align: 'right' })

        //texto centrado
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('DECLARACIÓN JURADA', 105, 25, { align: 'center' })
    }

    const isMobile = /Mobile|Android/.test(navigator.userAgent);

    const blob = await new Promise((resolve) => {
        resolve(doc.output('blob'));
    });
    const link = document.createElement('a');

    if (isMobile) {
        link.href = URL.createObjectURL(blob);
        link.download = 'dj.pdf';
        link.click();
    } else {
        window.open(URL.createObjectURL(blob));
    }
}


export default reportDJ