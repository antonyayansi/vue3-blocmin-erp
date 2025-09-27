import Decimal from "decimal.js-light";

export const formatMoneda = (value, decimal = 2, millar = 3) => {
  const monto = new Decimal(value ?? 0).toFixed(decimal); // mantiene precisión
  const [entero, decimales] = monto.split(".");

  const enteroFormateado = entero.replace(
    new RegExp(`\\B(?=(\\d{${millar}})+(?!\\d))`, "g"),
    ","
  );

  return decimales !== undefined
    ? `${enteroFormateado}.${decimales}`
    : enteroFormateado;
};
