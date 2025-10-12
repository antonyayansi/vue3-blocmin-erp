import Decimal from "decimal.js-light";
import { baseURLImagen } from "../../../../../services/baseApi";
import { loadImage } from "../../../../../lib/loadImage";

const printDesembolso = async (empresa, desembolso) => {

    const { jsPDF } = await import('jspdf');

    const [logo] = await Promise.all([
        loadImage(`${baseURLImagen}${empresa.logo}`),
    ])

    // Crear un nuevo documento jsPDF
    const doc = new jsPDF({
        orientation: 'p', // Orientación vertical
        unit: 'mm',
        format: [80, 200], // Ancho: 80 mm, Altura aumentada para mejor distribución
        putOnlyUsedFonts: true,
    });

    let y = 5;

    //imagen centrada
    doc.addImage(logo, 'PNG', 30, y, 20, 25);
    y += 28;

    // Nombre de la sede con mejor formato
    doc.setFontSize(12);
    doc.setFont('Courier', 'bold');
    doc.text(empresa?.sede ?? '', 40, y, 'center');
    y += 6;

    // Encabezado del comprobante
    doc.setFontSize(11);
    doc.setFont('Courier', 'bold');
    doc.text('COMPROBANTE DE DESEMBOLSO', 40, y, 'center');
    y += 6;

    //----- detalle de desembolso -----
    doc.setFontSize(9);
    doc.setFont('Courier', 'bold');
    doc.text('FECHA/HORA:', 7, y + 2);
    doc.setFont('Courier', 'normal');
    doc.text(desembolso?.fecha_desembolso, 74, y + 2, {
        align: 'right'
    });

    y += 5;
    doc.setFont('Courier', 'bold');
    doc.text('CREDITO N°:', 7, y);
    doc.setFont('Courier', 'normal');
    doc.text(desembolso.id?.toString().padStart(8, '0'), 74, y, {
        align: 'right'
    });

    y += 5;
    doc.setFont('Courier', 'bold');
    doc.text('TIPO MOVIM.:', 7, y);
    doc.setFont('Courier', 'normal');
    doc.text('DESEMBOLSO', 74, y, {
        align: 'right'
    });

    y += 5;
    doc.setFont('Courier', 'normal');
    doc.text('....................................', 7, y);

    y += 6;
    //----- detalle de cliente -----
    doc.setFontSize(10);
    doc.setFont('Courier', 'bold');
    doc.text('DATOS DEL CLIENTE', 40, y, 'center');
    y += 6;

    doc.setFontSize(8);
    doc.setFont('Courier', 'bold');
    doc.text('DNI:', 7, y);
    doc.setFont('Courier', 'normal');
    doc.text(desembolso.documento, 25, y);

    y += 4;
    doc.setFont('Courier', 'bold');
    doc.text('CLIENTE:', 7, y);
    doc.setFont('Courier', 'normal');
    const nombreCliente = desembolso.nombre.length > 25 ?
        desembolso.nombre.substring(0, 25) + '...' : desembolso.nombre;
    doc.text(nombreCliente, 25, y);

    y += 8;

    //----- detalle de montos -----
    // aporte es 10% del importe
    let aporte = new Decimal(desembolso.aporte).toNumber();

    // Sección de montos con estilo bancario
    doc.setFontSize(10);
    doc.setFont('Courier', 'bold');
    doc.text('DETALLE DEL CREDITO', 40, y, 'center');
    y += 6;

    // Formato de tabla bancaria
    doc.setFontSize(8);
    doc.setFont('Courier', 'normal');

    // Importe
    doc.text('Importe prestado', 7, y);
    doc.text('S/', 55, y);
    doc.text(new Decimal(desembolso.importe).toNumber().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Interés
    doc.text('Interes total', 7, y);
    doc.text('S/', 55, y);
    doc.text(new Decimal(desembolso.interes).toNumber().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Aporte
    doc.text('Aporte', 7, y);
    doc.text('S/', 55, y);
    doc.text(aporte.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Número de cuotas
    let diccionario_modo_pago = {
        'diario': 'DIA(S)',
        'semanal': 'SEMANA(S)',
        'quincenal': 'QUINCENA(S)',
        'mensual': 'MES(ES)',
        'anual': 'ANO(S)',
    }

    doc.text('Nro de cuotas', 7, y);
    doc.text(`${desembolso.nro_cuotas.toString()} ${diccionario_modo_pago[desembolso.modo_pago]}`, 72, y, 'right');
    y += 4;

    // Tipo de crédito
    doc.text('Tipo de credito', 7, y);
    if (desembolso.tipo_credito) {
        doc.text(`${desembolso.tipo_credito?.toUpperCase() ?? ''}`, 72, y, 'right');
    }
    y += 6;

    doc.setFont('Courier', 'normal');
    doc.text('....................................', 7, y);
    y += 6;

    //----- Transaccion exitosa -----
    doc.setFontSize(8);
    doc.setFont('Courier', 'bold');
    doc.text('DESEMBOLSO EXITOSO', 40, y, 'center');

    //----- firma -----
    y += 20;
    doc.setFontSize(8);
    doc.setFont('Courier', 'normal');

    y += 4;
    doc.text('......................................\nFIRMA DEL CLIENTE / D.N.I.', 40, y, 'center');

    y += 8;
    // Pie de página con estilo bancario
    doc.setFontSize(7);
    doc.setFont('Courier', 'normal');
    doc.text('Verifique su dinero antes de\nretirarse de la ventanilla', 40, y, 'center');


    // EXPORTAR O DESCARGAR
    const isMobile = /Mobile|Android/.test(navigator.userAgent);

    const blob = await new Promise((resolve) => {
        resolve(doc.output('blob'));
    });
    const link = document.createElement('a');

    if (isMobile) {
        link.href = URL.createObjectURL(blob);
        link.download = 'desembolso.pdf';
        link.click();
    } else {
        window.open(URL.createObjectURL(blob));
    }
}

export default printDesembolso
