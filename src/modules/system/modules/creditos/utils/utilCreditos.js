import { addDays, addMonths, format } from "date-fns";
import Decimal from "decimal.js-light";

export const generarCuotas = (fechaInicio, modoPago, importePrestamo, nroCuotas, TEM, pagoMensualTotal, comision, feriados, ahorro = 0) => {

    //feriados: [{'dd/MM', 'dd/MM', ...}]

    // Validación de entradas
    if (!fechaInicio || !modoPago || !importePrestamo || !nroCuotas || !pagoMensualTotal) return [];

    // Clona la fecha inicial para no modificar el objeto original
    let fechaBase = new Date(fechaInicio);
    let fechaDiaria = new Date(fechaInicio);
    const importeNum = new Decimal(importePrestamo);
    let saldoCapital = new Decimal(importeNum);
    // TEM ya viene como tasa efectiva mensual en porcentaje
    const tasaEfectivaMensual = new Decimal(TEM / 100);
    const cuotas = [];


    for (let i = 0; i < nroCuotas; i++) {
        let fecha;
        if (modoPago === 'diario') {
            // Para diario, avanzar siempre al siguiente día hábil
            if (i !== 0) {
                fechaDiaria = addDays(fechaDiaria, 1);
            }
            let intentos = 0;
            while (
                (feriados && feriados.includes(format(fechaDiaria, 'dd/MM')))
                || fechaDiaria.getDay() === 0
                || fechaDiaria.getDay() === 6
            ) {
                fechaDiaria = addDays(fechaDiaria, 1);
                intentos++;
                if (intentos > 31) break;
            }
            fecha = new Date(fechaDiaria);
        } else {
            // Para mensual, quincenal, semanal
            if (i !== 0) {
                if (modoPago === 'mensual') {
                    fechaBase = addMonths(fechaBase, 1);
                } else if (modoPago === 'quincenal') {
                    fechaBase = addDays(fechaBase, 15);
                } else if (modoPago === 'semanal') {
                    fechaBase = addDays(fechaBase, 7);
                }
            }
            let fechaTemp = new Date(fechaBase);
            let intentos = 0;
            while (
                (feriados && feriados.includes(format(fechaTemp, 'dd/MM')))
                || fechaTemp.getDay() === 0
                || fechaTemp.getDay() === 6
            ) {
                fechaTemp = addDays(fechaTemp, 1);
                intentos++;
                if (intentos > 31) break;
            }
            fecha = new Date(fechaTemp);
        }

        // Comision por periodo
        let comision_periodo = new Decimal(0);
        if (comision) {
            comision_periodo = new Decimal(comision ?? 0);
        }
        let ahorro_periodo = new Decimal(0);
        if (ahorro) {
            ahorro_periodo = new Decimal(ahorro ?? 0);
        }

        //para generar la cuota_gastos
        let cuota_gastos = 0;

        // NUEVOS RANGOS CORREGIDOS SEGÚN TABLAS
        const rangosDiario = [
            { min: 100, max: 300, cuota24: 0.20, cuota48: 0.50, cuota72: 0.10 },
            { min: 400, max: 800, cuota24: 0.50, cuota48: 0.30, cuota72: 0.10 },
            { min: 900, max: 1500, cuota24: 1.00, cuota48: 0.50, cuota72: 0.30 },
            { min: 1600, max: 2000, cuota24: 1.50, cuota48: 0.80, cuota72: 0.40 },
            { min: 2100, max: 2800, cuota24: 2.00, cuota48: 1.00, cuota72: 0.50 },
            { min: 2900, max: 3600, cuota24: 2.50, cuota48: 1.30, cuota72: 0.08 },
            { min: 3700, max: 4500, cuota24: 4.00, cuota48: 2.00, cuota72: 1.00 },
            { min: 4600, max: 5000, cuota24: 5.00, cuota48: 2.50, cuota72: 1.30 }
        ];

        const rangosSemanal = [
            { min: 500, max: 999, cuota4: 5, cuota8: 2.5, cuota12: 1 },
            { min: 1000, max: 1499, cuota4: 10, cuota8: 5, cuota12: 2.5 },
            { min: 1500, max: 1999, cuota4: 15, cuota8: 7.5, cuota12: 3.5 },
            { min: 2000, max: 2499, cuota4: 20, cuota8: 10, cuota12: 5 },
            { min: 2500, max: 2999, cuota4: 25, cuota8: 12, cuota12: 6 },
            { min: 3000, max: 3499, cuota4: 30, cuota8: 15, cuota12: 8 },
            { min: 3500, max: 3999, cuota4: 35, cuota8: 15, cuota12: 8 },
            { min: 4000, max: 4999, cuota4: 40, cuota8: 20, cuota12: 10 },
            { min: 5000, max: 9999, cuota4: 50, cuota8: 20, cuota12: 10 }
        ];

        // FUNCIÓN PARA OBTENER CUOTA GASTOS
        function obtenerCuotaGasto(modoPago, importe, nroCuotas) {
            console.log("Calculando cuota gastos para:", { modoPago, importe, nroCuotas });
            if (modoPago === "diario") {
                const rango = rangosDiario.find(r =>
                    importe >= r.min && importe <= r.max
                );
                if (!rango) return 0;

                if (nroCuotas === 24) return rango.cuota24;
                if (nroCuotas === 48) return rango.cuota48;
                if (nroCuotas === 72) return rango.cuota72;
                
                return 0;
            }

            if (modoPago === "semanal") {
                const rango = rangosSemanal.find(r =>
                    importe >= r.min && importe <= r.max
                );

                if (!rango) return 0;

                if (nroCuotas === 4) return rango.cuota4;
                if (nroCuotas === 8) return rango.cuota8;
                if (nroCuotas === 12) return rango.cuota12;

                return 0;
            }

            return 0;
        }

        cuota_gastos = obtenerCuotaGasto(modoPago, importeNum.toNumber(), parseInt(nroCuotas));

        // Cálculo de interés y capital
        const pagoMensualTotalDec = new Decimal(pagoMensualTotal);
        const interes = saldoCapital.mul(tasaEfectivaMensual);
        let capital = pagoMensualTotalDec.minus(interes);

        // Si es la última cuota o si el capital calculado es mayor al saldo restante,
        // ajustar el capital para liquidar completamente el saldo
        if (i === nroCuotas - 1 || capital.greaterThan(saldoCapital)) {
            capital = saldoCapital;
        }

        // Guardar el saldo antes de actualizar (para mostrar en la tabla)
        const saldoAnterior = saldoCapital;
        saldoCapital = saldoCapital.minus(capital);

        // Calcular el total de la cuota (siempre igual para todas las cuotas)
        const cuotaTotal = pagoMensualTotalDec.plus(comision_periodo).plus(ahorro_periodo);

        const cuota = {
            cuota_nro: cuotas.length + 1,
            cuota_dia: nombreDia(fecha),
            cuota_fecha: format(fecha, 'dd/MM/yyyy'),
            cuota_saldo: saldoAnterior.toFixed(2),
            cuota_capital: capital.toFixed(2),
            cuota_interes: interes.toFixed(2),
            cuota_comision: comision_periodo.toFixed(2),
            cuota_gastos: cuota_gastos.toFixed(2),
            cuota_ahorros: ahorro_periodo.toFixed(2),
            cuota_total: cuotaTotal.toFixed(2)
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