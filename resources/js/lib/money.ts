// Convierte cualquier valor a número seguro
export const toNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;

    // Reemplaza coma por punto
    if (typeof value === "string") {
        value = value.replace(",", ".");
    }

    const n = Number(value);
    return isNaN(n) ? 0 : n;
};

// Devuelve el importe correcto: aplicado → importe → 0
export const getImporteOrdenPago = (op: any): number => {
    const aplicado = op?.pivot?.importe_aplicado;

    if (aplicado !== null && aplicado !== undefined && aplicado !== "") {
        return toNumber(aplicado);
    }

    return toNumber(op?.importe);
};

// Formato consistente de moneda
export const formatCurrency = (
    value: any,
    code: string = "ARS"
): string => {
    const n = toNumber(value);

    return n.toLocaleString("es-AR", {
        style: "currency",
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
