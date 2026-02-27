import { format, isEqual, isBefore, isAfter } from "@formkit/tempo";
import { addDate } from "@/utils/formatterFunctions";
import { ValidationRule } from "@/Components/Table";

export const isEmpty = (value: string) => value.trim() === "";
export const isUndefined = (value?: string) => value === undefined;
export const validateEmail = (value: string) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
// export const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const required =
    (message = "Campo obligatorio") =>
    (value: unknown): true | string => {
        if (typeof value === "string") {
            return value.trim().length > 0 || message;
        }

        if (typeof value === "number") {
            return Number.isFinite(value) || message;
        }

        return message;
    };

/* CBU validation */
export const validateCBU = (value: string): boolean => {
    if (!/^[0-9]{22}$/.test(value)) {
        return false;
    }

    const cod_bcra = value.substring(0, 3);
    const sucursalNumber = value.substring(3, 7);
    const accountNumber = value.substring(8, 21);
    const validate1 = firstPart(cod_bcra, sucursalNumber);
    const validate2 = secondPart(accountNumber);

    const finalNumber =
        cod_bcra + sucursalNumber + validate1 + accountNumber + validate2;

    return finalNumber === value;
};

const firstPart = (a: string, b: string): number => {
    const value =
        Number(a[0]) * 7 +
        Number(a[1]) * 1 +
        Number(a[2]) * 3 +
        Number(b[0]) * 9 +
        Number(b[1]) * 7 +
        Number(b[2]) * 1 +
        Number(b[3]) * 3;

    return (10 - (value % 10)) % 10;
};

const secondPart = (c: string): number => {
    const value =
        Number(c[0]) * 3 +
        Number(c[1]) * 9 +
        Number(c[2]) * 7 +
        Number(c[3]) * 1 +
        Number(c[4]) * 3 +
        Number(c[5]) * 9 +
        Number(c[6]) * 7 +
        Number(c[7]) * 1 +
        Number(c[8]) * 3 +
        Number(c[9]) * 9 +
        Number(c[10]) * 7 +
        Number(c[11]) * 1 +
        Number(c[12]) * 3;

    return (10 - (value % 10)) % 10;
};
/* CBU validation */

export const cuitValidator = (data: string): boolean => {
    const value = data.replace(/[-_]/g, "");

    if (value.length !== 11) return false;

    const prefix = value.substring(0, 2);
    const validPrefixes = ["20", "23", "24", "27", "30", "33", "34"];

    if (!validPrefixes.includes(prefix)) return false;

    const count =
        Number(value[0]) * 5 +
        Number(value[1]) * 4 +
        Number(value[2]) * 3 +
        Number(value[3]) * 2 +
        Number(value[4]) * 7 +
        Number(value[5]) * 6 +
        Number(value[6]) * 5 +
        Number(value[7]) * 4 +
        Number(value[8]) * 3 +
        Number(value[9]) * 2 +
        Number(value[10]) * 1;

    return count % 11 === 0;
};

export type DateComparison = "before" | "after" | "equal";

export const compareDates = (
    date1: Date | string,
    date2: Date | string,
    comparison: DateComparison,
): boolean => {
    const d1 = date1 && date1 !== "" ? addDate(date1, 1) : new Date();

    const d2 = date2 && date2 !== "" ? addDate(date2, 1) : new Date();

    const formattedDate1 = format(d1, "YYYY-MM-DD");
    const formattedDate2 = format(d2, "YYYY-MM-DD");

    switch (comparison) {
        case "before":
            return isBefore(formattedDate1, formattedDate2);
        case "after":
            return isAfter(formattedDate1, formattedDate2);
        case "equal":
            return isEqual(formattedDate1, formattedDate2);
        default:
            return false;
    }
};

export const runValidation = <T>(
    value: T,
    rules?: ValidationRule<T>[],
): string | null => {
    if (!rules || rules.length === 0) return null;

    for (const rule of rules) {
        const result = rule(value);
        if (result !== true) return result;
    }

    return null;
};
