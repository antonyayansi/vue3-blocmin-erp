import { format, addDays } from "date-fns";
import Decimal from 'decimal.js-light'
import { loadImage } from "../../../../../lib/loadImage";
import { baseURLImagen } from "../../../../../services/baseApi";
import { formatMoneda } from "../../../../../lib/formatMoneda";

const printCronograma02 = async (empresa, credito, cliente, cronograma) => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
    });

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
        { content: 'N° Cuota', styles: { halign: 'center' } },
        { content: 'Día', styles: { halign: 'center' } },
        { content: 'Fecha', styles: { halign: 'center' } },
        { content: 'Saldo', styles: { halign: 'right' } },
        { content: 'Capital', styles: { halign: 'right' } },
        { content: 'Interés', styles: { halign: 'right' } },
        { content: 'Ahorros', styles: { halign: 'right' } },
        { content: 'Cuota', styles: { halign: 'right' } },
        { content: 'Estado', styles: { halign: 'center' } }
    ]

    let options = {
        startY: 0,
        //margin solo a la derecha
        margin: { right: 10, left: 10 },
        //estilo de columas independiente
        columnStyles: {
            0: { halign: 'center', cellWidth: 18 },
            1: { halign: 'center', cellWidth: 12 },
            2: { halign: 'center', cellWidth: 22 },
            3: { halign: 'right', cellWidth: 20 },
            4: { halign: 'right', cellWidth: 20 },
            5: { halign: 'right', cellWidth: 20 },
            6: { halign: 'right', cellWidth: 20 },
            7: { halign: 'right', cellWidth: 20 },
            8: { halign: 'center', cellWidth: 22 },
        },
        styles: {
            fontSize: 9,
            cellWidth: 'auto',
            halign: 'left',
            valign: 'middle',
            cellPadding: 0.6,
            lineWidth: 0,
            lineColor: [0, 0, 0],
            minCellHeight: 4.1,
            minCellWidth: 5,
        },
        tableWidth: 'auto',
        tableLineWidth: 0.1,
        tableLineColor: [0, 0, 0],
        theme: 'plain'
    }

    // Calcular totales
    const totalCapital = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.capital)).toNumber(), 0);
    const totalInteres = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.interes)).toNumber(), 0);
    const totalComision = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.comision ?? item.ahorros ?? 0)).toNumber(), 0);
    const totalCuota = cronograma.reduce((sum, item) => new Decimal(sum).add(new Decimal(item.cuota)).toNumber(), 0);

    options.startY = 80;
    autoTable(doc, {
        head: [headers],
        body: cronograma.map(item => {
            item.fecha_vencimiento = addDays(new Date(item.fecha_vencimiento), 1)
            return [
                item.numero_cuota,
                item.dia,
                format(new Date(item.fecha_vencimiento), 'dd/MM/yyyy'),
                item.saldo,
                item.capital,
                item.interes,
                item.ahorros,
                item.cuota,
                item.estado?.toUpperCase() || 'PENDIENTE'
            ]
        }),
        foot: [[
            { content: 'TOTAL', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: formatMoneda(totalCapital), styles: { halign: 'right', fontStyle: 'bold' } },
            { content: formatMoneda(totalInteres), styles: { halign: 'right', fontStyle: 'bold' } },
            { content: formatMoneda(totalComision), styles: { halign: 'right', fontStyle: 'bold' } },
            { content: formatMoneda(totalCuota), styles: { halign: 'right', fontStyle: 'bold' } },
            { content: '', styles: { halign: 'center' } }
        ]],
        ...options,
        margin: { top: 74, right: 10, left: 10, bottom: 30 },
        didParseCell: function (data) {
            if (data.row.index === 0 && data.cell.section === 'head') {
                data.cell.styles.fillColor = '#000000';
                data.cell.styles.textColor = '#fff'
            }
            if (data.cell.section === 'foot') {
                data.cell.styles.fillColor = '#f0f0f0';
                data.cell.styles.textColor = '#000000';
            }
            // Colorear el estado
            if (data.cell.section === 'body' && data.column.index === 8) {
                const estado = data.cell.raw?.toLowerCase();
                if (estado === 'pagado') {
                    data.cell.styles.fillColor = '#d4edda';
                    data.cell.styles.textColor = '#155724';
                    data.cell.styles.fontStyle = 'bold';
                } else if (estado === 'pendiente') {
                    data.cell.styles.fillColor = '#fff3cd';
                    data.cell.styles.textColor = '#856404';
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },

    });

    //resumen depues de la tabla
    // let y = doc.lastAutoTable.finalY + 5

    // let aporte = new Decimal(credito.aporte ?? 0).toNumber()
    // let importe_total = new Decimal(credito.importe ?? 0).add(new Decimal(credito.interes ?? 0)).add(new Decimal(credito.aporte ?? 0)).toNumber()
    // let total_comision = new Decimal(credito.comision ?? 0).times(new Decimal(credito.nro_cuotas ?? 0)).toNumber()
    // let total_ahorros = new Decimal(credito.ahorros ?? 0).times(new Decimal(credito.nro_cuotas ?? 0)).toNumber()

    // doc.setFontSize(10)
    // doc.text(`Total de intereses: ${formatMoneda(credito.interes)}`, 10, y + 5)
    // doc.text(`Total de capital: ${formatMoneda(credito.importe)}`, 10, y + 10)
    // doc.text(`Aporte: ${formatMoneda(aporte)}`, 10, y + 15)
    // doc.text(`Importe a pagar: ${formatMoneda(importe_total)}`, 10, y + 20)
    // doc.text(`Total de ahorros ${formatMoneda(total_ahorros)}`, 10, y + 25)

    var pageCount = doc.internal.getNumberOfPages();

    //HEADER AND FOOTER - repeat on All pages 🦏
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        if (credito.estado === 'rechazado') {
            doc.setFontSize(50)
            doc.setTextColor(255, 0, 0)
            doc.setFont(undefined, 'bold')
            doc.text('RECHAZADO', 105, 100, { align: 'center', angle: 45 })
        }
        if (logo) doc.addImage(logo, 'png', 10, 5, 18, 18);
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text(empresa.nombre_comercial, 32, 10)
        doc.setFont(undefined, 'normal')
        doc.setFontSize(8)
        doc.text(`Prov. ${empresa.departamento ?? ''} - ${empresa.provincia ?? ''} - ${empresa.distrito ?? ''}`, 32, 14)
        doc.text(empresa?.sede ?? '', 32, 18)
        // doc.text(`RUC: ${empresa.ruc}`,32,18)
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
        doc.text('CRONOGRAMA DE PAGO', 105, 25, { align: 'center' })

        //texto izquierda
        let headers = [
            [{ content: `Crédito: Nro. ${credito.id?.toString().padStart(4, '0')}`, colSpan: 2 }, { content: 'Cliente', colSpan: 2 }],
        ];
        let options = {
            startY: 0,
            //margin solo a la derecha
            margin: { right: 10, left: 10 },
            //estilo de columas independiente
            columnStyles: {
                0: {
                    halign: 'left',
                    cellWidth: 60,
                },
                1: { halign: 'left' },
                2: {
                    halign: 'left',
                    cellWidth: 40,
                },
                3: { halign: 'left' },
            },
            styles: {
                fontSize: 8,
                cellWidth: 'auto',
                halign: 'left',
                valign: 'middle',
                cellPadding: 0.6,
                lineWidth: 0,
                lineColor: [0, 0, 0],
                minCellHeight: 4.1,
                minCellWidth: 5,
            },
            theme: 'plain',
            tableWidth: 'auto',
            tableLineWidth: 0.1,
            tableLineColor: [0, 0, 0],
        }
        let body = [
            ['Fecha de desembolso', credito.fecha_desembolso ? format(new Date(addDays(new Date(credito.fecha_desembolso), 1)), 'dd/MM/yyyy') : 'SIN DESEMBOLSAR', 'DNI', cliente.documento],
            ['Tasa de interés mensual', `${credito.tem}%`, 'Nombres', cliente.nombre],
            ['Modo de pago', credito.modo_pago?.toUpperCase() ?? '', 'Teléfono', cliente.telefono ?? ''],
            ['Importe', formatMoneda(credito.importe), 'Correo', cliente.correo ?? ''],
            ['Nro. de cuotas', credito.nro_cuotas, 'Dirección laboral', cliente.direccion_laboral ?? ''],
            ['Moneda', credito.moneda, 'Dirección', cliente.direccion ?? ''],
        ]
        options.startY = 30;
        autoTable(doc, {
            head: headers,
            body: body,
            ...options,
            didParseCell: function (data) {
                if (data.row.index === 0 && data.cell.section === 'head') {
                    data.cell.styles.fillColor = '#000000';
                    data.cell.styles.textColor = '#fff'
                }
            },
        })

        let y = doc.lastAutoTable.finalY + 4
        if (credito.tipo_credito) {
            doc.setFont(undefined, 'normal')
            doc.setFontSize(8)
            doc.text(`Tipo de crédito: ${credito.tipo_credito?.toUpperCase()}`, 10, y)
        }
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

export default printCronograma02;
