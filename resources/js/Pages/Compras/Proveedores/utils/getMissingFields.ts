//Muestra los campos faltantes requeridos
export function getMissingFields(fields: Array<[label: string, valid: boolean]>) {
    return fields.filter(([, valid]) => !valid).map(([label]) => label);
}