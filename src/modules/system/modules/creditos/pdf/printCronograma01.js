import { format, addDays } from "date-fns";
import Decimal from 'decimal.js-light'
import { loadImage } from "../../../../../lib/loadImage";
import { baseURLImagen } from "../../../../../services/baseApi";
import { formatMoneda } from "../../../../../lib/formatMoneda";

const printCronograma01 = async (empresa, credito, cliente, cronograma) => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

    // Colores corporativos profesionales
    const colors = {
        primary: [0, 51, 102],        // Azul oscuro profesional
        secondary: [41, 128, 185],    // Azul medio
        accent: [52, 152, 219],       // Azul claro
        text: [44, 62, 80],           // Gris oscuro
        lightGray: [236, 240, 241],   // Gris muy claro
        mediumGray: [189, 195, 199],  // Gris medio
        success: [39, 174, 96],       // Verde
        warning: [243, 156, 18],      // Naranja
        danger: [231, 76, 60]         // Rojo
    };

    let logo = null;
    if (empresa.logo) {
        try {
            logo = await loadImage(`${baseURLImagen}${empresa.logo}`);
        } catch (e) {
            logo = null;
        }
    } else {
        logo = null;
    }

    let headers = [
        { content: 'N° Cuota', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Día', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Fecha Venc.', styles: { halign: 'center', fontStyle: 'bold' } },
        { content: 'Saldo Capital', styles: { halign: 'right', fontStyle: 'bold' } },
        { content: 'Amortización', styles: { halign: 'right', fontStyle: 'bold' } },
        { content: 'Interés', styles: { halign: 'right', fontStyle: 'bold' } },
        { content: 'Ahorros', styles: { halign: 'right', fontStyle: 'bold' } },
        { content: 'Cuota Total', styles: { halign: 'right', fontStyle: 'bold' } }
    ]

    let options = {
        startY: 0,
        margin: { right: 12, left: 12 },
        columnStyles: {
            0: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
            1: { halign: 'center', cellWidth: 15 },
            2: { halign: 'center', cellWidth: 24 },
            3: { halign: 'right', cellWidth: 26 },
            4: { halign: 'right', cellWidth: 26 },
            5: { halign: 'right', cellWidth: 24 },
            6: { halign: 'right', cellWidth: 22 },
            7: { halign: 'right', cellWidth: 26, fontStyle: 'bold' },
        },
        styles: {
            fontSize: 9,
            cellWidth: 'auto',
            halign: 'left',
            valign: 'middle',
            cellPadding: 2,
            lineWidth: 0.1,
            lineColor: colors.mediumGray,
            minCellHeight: 6,
            textColor: colors.text,
        },
        headStyles: {
            fillColor: colors.primary,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: colors.lightGray
        },
        tableWidth: 'auto',
        tableLineWidth: 0.1,
        tableLineColor: colors.mediumGray,
        theme: 'grid'
    }

    // Calcular totales
    const totalCapital = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.capital)).toNumber(), 0);
    const totalInteres = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.interes)).toNumber(), 0);
    const totalComision = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.comision)).toNumber(), 0);
    const totalCuota = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.cuota)).toNumber(), 0);

    options.startY = 108;
    autoTable(doc, {
        head: [headers],
        body: cronograma.map(item => {
            item.fecha_vencimiento = addDays(new Date(item.fecha_vencimiento), 1)
            return [
                item.numero_cuota,
                item.dia,
                format(new Date(item.fecha_vencimiento), 'dd/MM/yyyy'),
                formatMoneda(item.saldo),
                formatMoneda(item.capital),
                formatMoneda(item.interes),
                formatMoneda(item.ahorros),
                formatMoneda(item.cuota)
            ]
        }),
        foot: [[
            { content: 'TOTALES', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } },
            { content: formatMoneda(totalCapital), styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } },
            { content: formatMoneda(totalInteres), styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } },
            { content: formatMoneda(totalComision), styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } },
            { content: formatMoneda(totalCuota), styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } }
        ]],
        ...options,
        margin: { top: 89, right: 12, left: 12, bottom: 35 },
        footStyles: {
            fillColor: colors.primary,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            lineWidth: 0.3,
            lineColor: colors.primary
        },
        didParseCell: function (data) {
            // Estilo para filas alternas
            if (data.cell.section === 'body' && data.row.index % 2 === 0) {
                data.cell.styles.fillColor = colors.lightGray;
            }
        },
    });

    //resumen despues de la tabla
    let y = doc.lastAutoTable.finalY + 8

    let aporte = new Decimal(credito.aporte).toNumber()
    let importe_total = new Decimal(credito.importe ?? 0).add(new Decimal(credito.interes)).add(new Decimal(credito.aporte)).toNumber()
    let total_comision = new Decimal(credito.comision ?? 0).times(new Decimal(credito.nro_cuotas)).toNumber()
    let total_ahorros = new Decimal(credito.ahorros ?? 0).times(new Decimal(credito.nro_cuotas)).toNumber()

    // Caja de resumen con fondo
    doc.setDrawColor(...colors.primary)
    doc.setFillColor(...colors.lightGray)
    doc.roundedRect(12, y, 186, 38, 2, 2, 'FD')

    // Título del resumen
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(...colors.primary)
    doc.text('RESUMEN FINANCIERO', 105, y + 6, { align: 'center' })

    // Línea divisoria
    doc.setDrawColor(...colors.primary)
    doc.setLineWidth(0.5)
    doc.line(15, y + 9, 195, y + 9)

    // Datos del resumen en dos columnas
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(...colors.text)

    // Columna izquierda
    doc.text('Total de Capital:', 18, y + 15)
    doc.text('Total de Intereses:', 18, y + 21)
    doc.text('Aporte Inicial:', 18, y + 27)

    doc.setFont(undefined, 'bold')
    doc.text(formatMoneda(credito.importe), 75, y + 15, { align: 'right' })
    doc.text(formatMoneda(credito.interes), 75, y + 21, { align: 'right' })
    doc.text(formatMoneda(aporte), 75, y + 27, { align: 'right' })

    // Columna derecha
    doc.setFont(undefined, 'normal')
    doc.text('Total a Pagar:', 108, y + 15)
    doc.text('Total Ahorros:', 108, y + 21)

    doc.setFont(undefined, 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...colors.primary)
    doc.text(formatMoneda(importe_total), 192, y + 15, { align: 'right' })
    doc.setFont(undefined, 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...colors.text)
    doc.text(formatMoneda(total_ahorros), 192, y + 21, { align: 'right' })

    // Línea divisoria inferior
    doc.setDrawColor(...colors.mediumGray)
    doc.setLineWidth(0.3)
    doc.line(15, y + 32, 195, y + 32)

    // Nota importante
    doc.setFontSize(7)
    doc.setFont(undefined, 'italic')
    doc.setTextColor(...colors.text)
    doc.text('* Los montos están expresados en ' + credito.moneda + '. Sujeto a las condiciones del contrato.', 18, y + 36)

    var pageCount = doc.internal.getNumberOfPages();

    //HEADER AND FOOTER - repeat on All pages
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)

        // Fondo del header
        doc.setFillColor(...colors.primary)
        doc.rect(0, 0, 210, 28, 'F')

        // Marca de agua si está rechazado
        if (credito.estado === 'rechazado') {
            doc.setFontSize(60)
            doc.setTextColor(...colors.danger)
            doc.setFont(undefined, 'bold')
            doc.text('RECHAZADO', 105, 150, { align: 'center', angle: 45 })
        }

        // Logo
        if (logo) {
            doc.addImage(logo, 'png', 14, 6, 16, 16);
        }

        // Información de la empresa
        doc.setFontSize(12)
        doc.setTextColor(255, 255, 255)
        doc.setFont(undefined, 'bold')
        doc.text(empresa.nombre_comercial, 34, 12)

        doc.setFont(undefined, 'normal')
        doc.setFontSize(7)
        doc.text(`${empresa.departamento ?? ''} - ${empresa.provincia ?? ''} - ${empresa.distrito ?? ''}`, 34, 16)
        doc.text(empresa?.sede ?? '', 34, 19)
        doc.text(`RUC: ${empresa.ruc}`, 34, 22)

        // Info de página e impresión (derecha)
        doc.setFontSize(7)
        doc.text(`Página ${i} de ${pageCount}`, 196, 16, { align: 'right' })
        doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 196, 20, { align: 'right' })

        // Título del documento
        doc.setFillColor(...colors.accent)
        doc.rect(0, 28, 210, 12, 'F')
        doc.setFontSize(14)
        doc.setTextColor(255, 255, 255)
        doc.setFont(undefined, 'bold')
        doc.text('CRONOGRAMA DE PAGOS', 105, 36, { align: 'center' })

        // Título del documento
        doc.setFillColor(...colors.accent)
        doc.rect(0, 28, 210, 12, 'F')
        doc.setFontSize(14)
        doc.setTextColor(255, 255, 255)
        doc.setFont(undefined, 'bold')
        doc.text('CRONOGRAMA DE PAGOS', 105, 36, { align: 'center' })

        // Información del crédito y cliente
        let headers = [
            [
                { content: `INFORMACIÓN DEL CRÉDITO`, colSpan: 2, styles: { fillColor: colors.primary, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' } },
                { content: 'INFORMACIÓN DEL CLIENTE', colSpan: 2, styles: { fillColor: colors.primary, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' } }
            ],
        ];

        let options = {
            startY: 0,
            margin: { right: 12, left: 12 },
            columnStyles: {
                0: {
                    halign: 'left',
                    cellWidth: 48,
                    fontStyle: 'bold',
                    textColor: colors.primary
                },
                1: {
                    halign: 'left',
                    textColor: colors.text
                },
                2: {
                    halign: 'left',
                    cellWidth: 38,
                    fontStyle: 'bold',
                    textColor: colors.primary
                },
                3: {
                    halign: 'left',
                    textColor: colors.text
                },
            },
            styles: {
                fontSize: 8.5,
                cellWidth: 'auto',
                halign: 'left',
                valign: 'middle',
                cellPadding: 2.5,
                lineWidth: 0.1,
                lineColor: colors.mediumGray,
                minCellHeight: 6,
            },
            theme: 'grid',
            tableWidth: 'auto',
            tableLineWidth: 0.1,
            tableLineColor: colors.mediumGray,
            alternateRowStyles: {
                fillColor: colors.lightGray
            }
        }

        let body = [
            ['Nro. de Crédito', credito.id?.toString().padStart(6, '0'), 'Documento', cliente.documento],
            ['Fecha Desembolso', credito.fecha_desembolso ? format(new Date(addDays(new Date(credito.fecha_desembolso), 1)), 'dd/MM/yyyy') : 'PENDIENTE', 'Nombre Completo', cliente.nombre],
            ['Tasa Interés (TEM)', `${credito.tem}%`, 'Teléfono', cliente.telefono ?? 'No registrado'],
            ['Modo de Pago', credito.modo_pago.toUpperCase() ?? '', 'Correo Electrónico', cliente.correo ?? 'No registrado'],
            ['Importe Otorgado', formatMoneda(credito.importe), 'Dir. Laboral', cliente.direccion_laboral ?? 'No registrado'],
            ['Nro. de Cuotas', `${credito.nro_cuotas} cuotas`, 'Dirección', cliente.direccion ?? 'No registrado'],
            ['Moneda', credito.moneda.toUpperCase(), 'Tipo de Crédito', credito.tipo_credito?.toUpperCase() ?? 'No especificado'],
        ]

        options.startY = 43;
        autoTable(doc, {
            head: headers,
            body: body,
            ...options,
        })

        // Footer profesional
        let footerY = 280
        doc.setDrawColor(...colors.mediumGray)
        doc.setLineWidth(0.3)
        doc.line(12, footerY, 198, footerY)

        doc.setFontSize(7)
        doc.setFont(undefined, 'italic')
        doc.setTextColor(...colors.text)
        doc.text('Este documento es una representación del cronograma de pagos acordado.', 105, footerY + 4, { align: 'center' })
        doc.text('Para consultas o aclaraciones comuníquese con nuestra institución.', 105, footerY + 8, { align: 'center' })
    }

    const isMobile = /Mobile|Android/.test(navigator.userAgent);

    const blob = await new Promise((resolve) => {
        resolve(doc.output('blob'));
    });
    const link = document.createElement('a');

    if (isMobile) {
        link.href = URL.createObjectURL(blob);
        link.download = 'cronogramadepago.pdf';
        link.click();
    } else {
        window.open(URL.createObjectURL(blob));
    }
};

export default printCronograma01;
