import { addDays, addMonths, format } from "date-fns";
import Decimal from "decimal.js-light";

export const generarCuotas = (fechaInicio, modoPago, importePrestamo, nroCuotas, TEM, pagoMensualTotal, comision) => {
    // Validación de entradas
    if (!fechaInicio || !modoPago || !importePrestamo || !nroCuotas || !pagoMensualTotal) return [];

    // Clona la fecha inicial para no modificar el objeto original
    let fecha = new Date(fechaInicio);
    const dividendo = getDividendo(nroCuotas);
    const importeNum = new Decimal(importePrestamo);
    let saldoCapital = new Decimal(importeNum);
    const tasaEfectivaMensual = new Decimal(Math.pow(1 + (TEM / 100), 1 / dividendo) - 1);
    const cuotas = [];

    // Simulación de feriados (debe integrarse con API real si se requiere)
    const feriados = []; // Ejemplo: ['28/09', '01/01']

    for (let i = 0; i < nroCuotas; i++) {
        // Avanza la fecha según el modo de pago
        if (i !== 0) {
            if (modoPago === 'mensual') {
                fecha = addMonths(fecha, 1);
            } else if (modoPago === 'diario') {
                fecha = addDays(fecha, 1);
            } else if (modoPago === 'quincenal') {
                fecha = addDays(fecha, 15);
            } else if (modoPago === 'semanal') {
                fecha = addDays(fecha, 7);
            }
        }
        // Evita sábados, domingos y feriados
        while (fecha.getDay() === 0 || fecha.getDay() === 6 || feriados.includes(format(fecha, 'dd/MM'))) {
            fecha = addDays(fecha, 1);
        }

        // Comision por periodo
        let comision_periodo = new Decimal(0);
        if (comision) {
            comision_periodo = new Decimal(comision ?? 0);
        }

        //para generar la cuota_gastos
        let cuota_gastos = 0;

        const rangosDiario = [
            { min: 100, max: 399, cuota: 0.20 },
            { min: 400, max: 899, cuota: 0.50 },
            { min: 900, max: 1599, cuota: 1.00 },
            { min: 1600, max: 2099, cuota: 1.50 },
            { min: 2100, max: 2899, cuota: 2.00 },
            { min: 2900, max: 3699, cuota: 2.50 },
            { min: 3700, max: 4599, cuota: 4.00 },
            { min: 4600, cuota: 5.00 }
        ];

        const rangosSemanal = [
            { min: 500, max: 999, cuota: 5.00 },
            { min: 1000, max: 1499, cuota: 10.00 },
            { min: 1500, max: 1999, cuota: 15.00 },
            { min: 2000, max: 2499, cuota: 20.00 },
            { min: 2500, max: 2999, cuota: 25.00 },
            { min: 3000, max: 3499, cuota: 30.00 },
            { min: 3500, max: 3999, cuota: 35.00 },
            { min: 4000, max: 4999, cuota: 40.00 },
            { min: 5000, cuota: 50.00 }
        ];

        function calcularCuotaGasto(rangos) {
            for (const rango of rangos) {
                if ((rango.max ? (importeNum.greaterThanOrEqualTo(rango.min) && importeNum.lessThanOrEqualTo(rango.max)) : importeNum.greaterThanOrEqualTo(rango.min))) {
                    return new Decimal(rango.cuota);
                }
            }
            return new Decimal(0);
        }

        if (modoPago === 'diario') {
            cuota_gastos = calcularCuotaGasto(rangosDiario);
        } else if (modoPago === 'semanal') {
            cuota_gastos = calcularCuotaGasto(rangosSemanal);
        }

        // Cálculo de interés y capital
        const pagoMensualTotalDec = new Decimal(pagoMensualTotal);
        const interes = saldoCapital.mul(tasaEfectivaMensual);
        let capital = pagoMensualTotalDec.minus(interes);
        if (capital.greaterThan(saldoCapital)) {
            capital = saldoCapital;
        }
        saldoCapital = saldoCapital.minus(capital);

        const cuota = {
            cuota_nro: cuotas.length + 1,
            cuota_dia: nombreDia(fecha),
            cuota_fecha: format(fecha, 'dd/MM/yyyy'),
            cuota_saldo: saldoCapital.greaterThan(0) ? saldoCapital.plus(capital).toFixed(2) : '0.00',
            cuota_capital: capital.toFixed(2),
            cuota_interes: interes.toFixed(2),
            cuota_comision: comision_periodo.toFixed(2),
            cuota_gastos: cuota_gastos.toFixed(2),
            cuota_total: pagoMensualTotalDec.plus(comision_periodo).toFixed(2),
        };
        cuotas.push(cuota);
        // Si el saldo de capital es cero, termina el ciclo
        if (saldoCapital.lessThanOrEqualTo(0)) {
            break;
        }
    }

    return cuotas;
}

export const getDividendo = (nro_cuotas) => {
    let dividendo = 1;
    if (nro_cuotas > 42) {
        dividendo = 24;
    } else if (nro_cuotas > 36 && nro_cuotas <= 42) {
        dividendo = 18;
    } else if (nro_cuotas > 12 && nro_cuotas <= 36) {
        dividendo = 12;
    } else if (nro_cuotas > 0 && nro_cuotas <= 12) {
        dividendo = 7;
    }

    return dividendo;
}

const nombreDia = (fecha) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    return dias[fecha.getDay()];
}