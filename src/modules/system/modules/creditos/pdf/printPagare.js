import { format, addDays, addMonths } from "date-fns";
import { meses } from "../helpers/formats";
import { loadImage } from "../../../../../lib/loadImage";
import { baseURLImagen } from "../../../../../services/baseApi";

const printPagare = async (empresa, credito, cliente) => {

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
    doc.text('Importe:', 15, 35)
    doc.setFont(undefined, 'bold')
    doc.text(`${credito.importe}`, 30, 35)
    doc.setFont(undefined, 'normal')
    doc.text('Moneda:', 15, 40)
    doc.setFont(undefined, 'bold')
    doc.text(`${credito.moneda}`, 30, 40)
    doc.setFont(undefined, 'normal')

    let fecha_vencimiento = format(new Date(credito.fecha_desembolso), 'dd/MM/yyyy')

    if (credito.modo_pago === 'mensual') {
        fecha_vencimiento = format(addMonths(new Date(credito.fecha_desembolso), credito.nro_cuotas), 'dd/MM/yyyy')
    } else if (credito.modo_pago === 'diario') {
        fecha_vencimiento = format(addDays(new Date(credito.fecha_desembolso), credito.nro_cuotas), 'dd/MM/yyyy')
    } else if (credito.modo_pago === 'quincenal') {
        fecha_vencimiento = format(addDays(new Date(credito.fecha_desembolso), credito.nro_cuotas * 15), 'dd/MM/yyyy')
    } else if (credito.modo_pago === 'semanal') {
        fecha_vencimiento = format(addDays(new Date(credito.fecha_desembolso), credito.nro_cuotas * 7), 'dd/MM/yyyy')
    }

    let dia = fecha_vencimiento.split('/')[0]
    let mes = fecha_vencimiento.split('/')[1]
    let anio = fecha_vencimiento.split('/')[2]

    mes = meses[parseInt(mes) - 1]

    doc.text(`Vence el ${dia} de ${mes.toUpperCase()} del ${anio}`, 15, 45)
    doc.text('N°:', 15, 50)
    doc.setFont(undefined, 'bold')
    doc.text(`${credito.id?.toString().padStart(4, '0')}`, 30, 50)

    doc.setFont(undefined, 'normal')
    doc.text(`PAGARE/PAGAREMOS el presente título valor a la orden de ${empresa.razon_social}, en adelante ${empresa.razon_social} o a su legítimo tenedor al momento de su vencimiento, en las oficinas del tenedor o donde sea presentado el titulo para su cobro por la suma ${credito.cuota} que hemos recibido de la EMPRESA ${empresa.razon_social}. a mi /nuestra entera satisfacción, este importe generara desde la fecha su emisión hasta la fecha de su vencimiento un interés compensatorio a la tasa de ${credito.tem} % MENSUAL, la cual es capitalizable en términos efectivos, reconociendo también se genera a partir del vencimiento el pago de interese moratorios a la tasa de  0,1 % mensual, los cuales se sumaran hasta la total cancelación de la obligación contenida en el presente título; así como comisiones, penalidades, seguros y gastos, que se pudieran devengar des la fecha de emisión hasta la cancelación total de la presente obligación, sin que sea necesario requerimiento de pago para constituirme/constituirnos en mora, la que se producirá de modo automático.`,
        15, 60,
        { maxWidth: 180, align: 'justify' }
    )

    let parrafo2 = `Expresamente acepto/aceptamos toda variación de las tasas de interés, comisiones y gastos de acuerdo a ley, las cuales se aplican sobre el saldo pendiente de este Pagaré a la fecha de la variación bastando que las mismas sean exhibidas en el tarifario de ${empresa.razon_social} o menos sean comunicadas por cualquier medio.`
    doc.text(parrafo2,
        15, 105,
        { maxWidth: 180, align: 'justify' }
    )

    let parrafo3 = `Asimismo, convengo/convenimos en establecer que el pago de este título valor, se realizara en el domicilio de ${empresa.razon_social} o agencia de esta (dependiendo del lugar de emisión) o mediante “cargo en mi/nuestra cuenta de ahorros abierta en ${empresa.razon_social}”, por lo que a su vencimiento y en caso que la cuenta de cargo no tuviera fondos autosuficientes de ${empresa.razon_social} podrá dejar constancia de ello en el propio título valor, la cual surtirá efectos del protesto bajo modalidad sustitutoria contemplada en la ley de títulos Valores vigente, autorizo, autorizamos al tenedor la compensación y a la realizar retiros de mi/nuestras cuenta(s) de ahorro o plazo fijo para amortizar o cancelar la presente obligación y sus renovaciones y/o refinanciamiento, facultándola a la conversión de monedas de acuerdo al tipo de cambio de fijado por ella misma.`
    doc.text(parrafo3,
        15, 120,
        { maxWidth: 180, align: 'justify' }
    )

    let parrafo4 = `El presente título valor no estará sujeto a protesto notarial, procediendo su ejecución con el solo vencimiento de la obligación y la falta de prórroga. En todo caso, el protesto será facultativo para el tenedor de acuerdo a ley.`
    doc.text(parrafo4,
        15, 160,
        { maxWidth: 180, align: 'justify' }
    )

    let parrafo5 = `Acepto/aceptamos las prórrogas totales o parciales, las renovaciones y/o refinanciamientos que el tenedor decida concedernos en el futuro para la cancelación total de la deuda contenida en el presente; autorizamos se complete el presente título valor por el saldo deudor que adeudo/adeudemos.`
    doc.text(parrafo5,
        15, 170,
        { maxWidth: 180, align: 'justify' }
    )

    let parrafo6 = `Renuncio/renunciamos expresamente a la posibilidad de incluir clausula alguna que limite la circulación del presente título valor.`
    doc.text(parrafo6,
        15, 185,
        { maxWidth: 180, align: 'justify' }
    )
    let parrafo7 = `Autorizo/autorizamos a ${empresa.razon_social} la compensación de mi/nuestra (s) cuenta (s) en sus diferentes modalidades o plazo fijo que en cualquier moneda mantenga/mantengamos para amortizar o cancelar la presente obligación y sus prorrogas, renovación es y (o refinanciamiento) facultamos al tenedor a completar el presente con el saldo deudor que adeudo (amos).`
    doc.text(parrafo7,
        15, 195,
        { maxWidth: 180, align: 'justify' }
    )
    let parrafo8 = `Asimismo, declaro/declaramos que a la cancelación de la obligación que representa el presente pagare, me/nos obligó/obligamos al recoger este documento de forma inmediata, pactando la destrucción del presente título valor en dicho momento.`
    doc.text(parrafo8,
        15, 215,
        { maxWidth: 180, align: 'justify' }
    )
    let parrafo9 = `Dejo/dejamos constancia que nuestro domicilio es el declarado en el presente título valor. En el caso de incumplimiento de las obligaciones derivada de este Pagare nos sometemos a la competencia de los jueces, juzgados y/o Órganos Competentes del distrito de ${empresa.distrito ?? '__________________'} provincia de ${empresa.provincia ?? '__________________'} y departamento de ${empresa.departamento ?? '__________________'}`
    doc.text(parrafo9,
        15, 230,
        { maxWidth: 180, align: 'justify' }
    )
    let parrafo10 = `Declaro/declaramos está plenamente facultados para suscribir el presente Pagaré, asumiendo en caso contrario la responsabilidad civil y/o penal que hubiera lugar.`
    doc.text(parrafo10,
        15, 245,
        { maxWidth: 180, align: 'justify' }
    )

    // fecha_desembolso : "2023-11-08 12:00:00"
    let dia_desembolso = credito.fecha_desembolso.split('-')[2].split(' ')[0]
    let mes_desembolso = credito.fecha_desembolso.split('-')[1]
    let anio_desembolso = credito.fecha_desembolso.split('-')[0]

    doc.text(`${dia_desembolso} de ${meses[parseInt(mes_desembolso) - 1].toUpperCase()} del ${anio_desembolso}`, 15, 260)

    //agregar pagina
    doc.addPage()

    doc.setLineWidth(0.2)
    doc.line(15, 55, 62, 55)
    doc.text('(1) Firma y/o sello del emitente', 15, 60)

    doc.line(100, 55, 150, 55)
    doc.text('(2) Firma y/o sello del emitente', 100, 60)

    doc.setLineWidth(0.2)
    doc.rect(72, 30, 20, 25)

    doc.setLineWidth(0.2)
    doc.rect(160, 30, 20, 25)

    let y = 75

    doc.text('(1) NOMBRE/DENOMINACIÓN', 15, y)
    y += 5
    doc.text('RAZÓN SOCIAL:', 15, y)
    doc.setFont(undefined, 'bold')
    doc.text(`${cliente.nombre}`, 50, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text('DNI/RUC:', 15, y)
    doc.setFont(undefined, 'bold')
    doc.text(`${cliente.documento ?? ''}`, 50, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text('DOMICILIO:', 15, y)
    doc.setFont(undefined, 'bold')
    doc.text(`${cliente.direccion ?? ''}`, 50, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text('DIRECCIÓN LABORAL:', 15, y)
    doc.setFont(undefined, 'bold')
    doc.text(`${cliente.direccion_laboral ?? ''}`, 55, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text(`DISTRITO: _______________ PROVINCIA: __________________ DEPARTAMENTO: _______________`, 15, y)

    y += 10

    doc.text('(2) NOMBRE/DENOMINACIÓN', 15, y)
    y += 5
    doc.text('RAZÓN SOCIAL:', 15, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text('DNI/RUC:', 15, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text('DOMICILIO:', 15, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text('DIRECCIÓN LABORAL:', 15, y)
    doc.setFont(undefined, 'normal')
    y += 5
    doc.text(`DISTRITO: _______________ PROVINCIA: __________________ DEPARTAMENTO: _______________`, 15, y)

    var pageCount = doc.internal.getNumberOfPages();
    //HEADER AND FOOTER - repeat on All pages 🦏
    for (let i = 1; i <= pageCount; i++) {

        //si credito.estado es 'rechazado' mostrar texto grande inclinado
        if (credito.estado === 'rechazado') {
            doc.setFontSize(50)
            doc.setTextColor(255, 0, 0)
            doc.setFont(undefined, 'bold')
            doc.text('RECHAZADO', 105, 100, { align: 'center', angle: 45 })
        }

        doc.setPage(i)
        doc.addImage(img, 'jpg', 10, 5, 18, 15)
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 139)
        doc.setFont(undefined, 'bold')
        doc.text(empresa.nombre_comercial, 32, 10)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(8)
        doc.text(`Prov. ${empresa.departamento ?? ''} - ${empresa.provincia ?? ''} - ${empresa.distrito ?? ''}`, 32, 14)
        doc.text(`SEDE: ${empresa.sede ?? 'Principal'}`, 32, 18)
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
        doc.text('PAGARÉ', 105, 25, { align: 'center' })
    }

    const isMobile = /Mobile|Android/.test(navigator.userAgent);

    const blob = await new Promise((resolve) => {
        resolve(doc.output('blob'));
    });
    const link = document.createElement('a');

    if (isMobile) {
        link.href = URL.createObjectURL(blob);
        link.download = 'pagare.pdf';
        link.click();
    } else {
        window.open(URL.createObjectURL(blob));
    }
}

export default printPagare