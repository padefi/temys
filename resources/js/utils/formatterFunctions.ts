import { format } from "@formkit/tempo";

export const dateFormat = (data: Date | string): string =>
    format(data, "DD/MM/YYYY", "es");
export const dateTimeFormat = (data: Date | string): string =>
    format(data, "DD/MM/YYYY HH:mm:ss", "es");
export const invoiceNumberFormat = (data: number, length: number): string =>
    String(data).padStart(length, "0");
export const cuitDisplay = (data: number): string =>
    String(data).replace(/(\d{2})(\d{8})(\d{1})/, "$1-$2-$3");

export const currencyNumber = (data: number): string => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(data);
};

export const percentNumber = (data: number): string => {
    return new Intl.NumberFormat("es-ES", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(data / 100);
};

export const roundedNumber = (data: number): number => {
    const rounded = Math.round(data * 100) / 100;
    return Math.abs(rounded) < 0.001 ? 0 : rounded;
};

export const addDate = (date: Date | string, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const numberFormatter = (data: number): string => {
    return data.toLocaleString("es-AR");
};

export const formatString = (data: string): string => {
    if (!data) return "";

    let formattedString = data.replace(/([A-Z])/g, " $1").toLowerCase();
    formattedString = formattedString.replace(/[-_]/g, " ");
    formattedString = formattedString.replace(/\s+/g, " ").trim();
    formattedString = formattedString
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    return formattedString;
};

export const formatFechaAR = (fecha: Date | string | null): string => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-AR", {
        timeZone: "UTC",
    });
};
