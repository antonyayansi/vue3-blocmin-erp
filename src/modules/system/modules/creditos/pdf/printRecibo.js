import { format } from "date-fns";
import { baseURLImagen } from '../../../../../services/baseApi'
import Decimal from "decimal.js-light";
import { loadImage } from "../../../../../lib/loadImage";

const reportRecibo = async (empresa, sede, data) => {

    const credito = data.credito;
    const recibo = data.recibo;
    const detalle = data.detalles;
    const cliente = data.cliente;
    const saldo = data.saldo;
    const user = data.user;

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

    // Configurar fuente monoespaciada para apariencia profesional
    // doc.addFont('data:font/truetype;base64,', 'Courier', 'normal');
    // doc.setFont('Courier');

    let y = 5;

    //imagen centrada
    doc.addImage(logo, 'PNG', 30, y, 20, 25);
    y += 28;

    // Nombre de la sede con mejor formato
    doc.setFontSize(12);
    doc.setFont('Courier', 'bold');
    doc.text(sede.name ?? '', 40, y, 'center');
    y += 6;

    // Encabezado del recibo con estilo bancario
    doc.setFontSize(11);
    doc.setFont('Courier', 'bold');
    doc.text('COMPROBANTE DE PAGO', 40, y, 'center');
    y += 6;

    //----- detalle de recibo -----
    doc.setFontSize(9);
    doc.setFont('Courier', 'bold');
    doc.text('FECHA/HORA:', 7, y + 2);
    doc.setFont('Courier', 'normal');
    const fecha = new Date(recibo?.created_at);
    const fechaFormateada = format(fecha, 'dd/MM/yyyy HH:mm');
    doc.text(fechaFormateada, 74, y + 2, {
        align: 'right'
    });

    y += 5;
    doc.setFont('Courier', 'bold');
    doc.text('RECIBO N°:', 7, y);
    doc.setFont('Courier', 'normal');
    doc.text(recibo.id?.toString().padStart(8, '0'), 74, y, {
        align: 'right'
    });

    y += 5;
    doc.setFont('Courier', 'bold');
    doc.text('CAJERO(A):', 7, y);
    doc.setFont('Courier', 'normal');
    const responsable = `${user?.id?.toString().padStart(3, '0')}-${user.name?.substring(0, 12) ?? ''}`;
    doc.text(responsable, 74, y, {
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
    doc.text(cliente.documento, 25, y);

    y += 4;
    doc.setFont('Courier', 'bold');
    doc.text('CLIENTE:', 7, y);
    doc.setFont('Courier', 'normal');
    const nombreCliente = cliente.nombre.length > 25 ?
        cliente.nombre.substring(0, 25) + '...' : cliente.nombre;
    doc.text(nombreCliente, 25, y);

    y += 4;
    doc.setFont('Courier', 'bold');
    doc.text('PRESTAMO:', 7, y);
    doc.setFont('Courier', 'normal');
    doc.text(credito.modo_pago.toUpperCase(), 25, y);

    y += 4;
    doc.setFont('Courier', 'bold');
    doc.text('CTA N°:', 7, y);
    doc.setFont('Courier', 'normal');
    doc.text(credito.id?.toString().padStart(8, '0'), 25, y);

    y += 8;

    //----- detalle de cuotas -----
    //suma de todos los detalles o cuotas pagadas
    let interes = 0;
    let capital = 0;
    let saldo_primero = detalle[0]?.saldo;
    let gastos = new Decimal(detalle[0]?.gastos ?? 0).mul(detalle.length ?? 1).toNumber();

    for (let i = 0; i < detalle.length; i++) {
        interes += new Decimal(detalle[i]?.interes).toNumber();
        capital += new Decimal(detalle[i]?.capital).toNumber();
    }

    interes = new Decimal(interes).minus(gastos).toNumber();

    // Sección de montos con estilo bancario
    doc.setFontSize(10);
    doc.setFont('Courier', 'bold');
    doc.text('DETALLE DE PAGO', 40, y, 'center');
    y += 6;

    // Formato de tabla bancaria
    doc.setFontSize(8);
    doc.setFont('Courier', 'normal');

    // Capital
    doc.text('Capital pagado', 7, y);
    doc.text('S/', 55, y);
    doc.text(capital.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Saldo restante
    doc.text('Saldo restante', 7, y);
    doc.text('S/', 55, y);
    const saldoRestante = (saldo_primero - capital) > 0 ? (saldo_primero - capital) : 0;
    doc.text(saldoRestante.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Interés
    doc.text('Interes compensat.', 7, y);
    doc.text('S/', 55, y);
    doc.text(interes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Gastos
    doc.text('Gastos administ.', 7, y);
    doc.text('S/', 55, y);
    doc.text(gastos.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 4;

    // Monto adicional (penalidad o descuento)
    const montoAdicional = new Decimal(recibo.monto_adicional ?? 0).toNumber();
    const esPenalidad = montoAdicional >= 0;
    doc.text(esPenalidad ? 'Penalidad mora' : 'Descuento', 7, y);
    doc.text('S/', 55, y);
    doc.text(Math.abs(montoAdicional).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');
    y += 6;

    // Total destacado
    doc.setFont('Courier', 'bold');
    doc.setFontSize(9);
    doc.text('TOTAL PAGADO', 7, y);
    doc.text('S/', 55, y);
    let total = new Decimal(recibo.monto).add(recibo.monto_adicional).toNumber();
    doc.text(total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'), 72, y, 'right');

    y += 6;
    doc.setFont('Courier', 'normal');
    doc.text('....................................', 7, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('Courier', 'bold');
    doc.text('RESUMEN DE CUOTAS', 40, y, 'center');
    y += 6;

    doc.setFontSize(8);
    doc.setFont('Courier', 'normal');
    doc.text('Cuotas pagadas:', 7, y);
    doc.text(`${detalle.length} cuota(s)`, 60, y, 'right');

    y += 4;
    doc.text('Cuotas pendientes:', 7, y);
    let result = credito.nro_cuotas - detalle[detalle.length - 1]?.numero_cuota;
    doc.text(`${result} cuota(s)`, 60, y, 'right');

    y += 4;
    doc.text('Total pagadas:', 7, y);
    doc.text(`${detalle.length ? detalle[detalle.length - 1].numero_cuota : '0'} cuota(s)`, 60, y, 'right');

    y += 4;
    doc.text('Total del credito:', 7, y);
    doc.text(`${credito.nro_cuotas} cuota(s)`, 60, y, 'right');

    //----- Transaccion exitosa -----
    y += 6;

    doc.setFontSize(8);
    doc.setFont('Courier', 'bold');
    doc.text('TRANSACCION EXITOSA', 40, y, 'center');

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
    doc.text('Gracias por su preferencia', 40, y, 'center');

    // EXPORTAR O DESCARGAR
    const isMobile = /Mobile|Android/.test(navigator.userAgent);

    const blob = await new Promise((resolve) => {
        resolve(doc.output('blob'));
    });
    const link = document.createElement('a');

    if (isMobile) {
        link.href = URL.createObjectURL(blob);
        link.download = 'recibo.pdf';
        link.click();
    } else {
        window.open(URL.createObjectURL(blob));
    }
}

export default reportRecibo;
