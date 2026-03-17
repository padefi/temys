export type TipoEntidad = 'Banco' | 'Billetera Virtual' | 'Financiera';

export interface EntidadFinanciera {
    id: number;
    descripcion: string;
    tipo: TipoEntidad;
    clave_unica: string;
    habilitado: boolean | number;
};