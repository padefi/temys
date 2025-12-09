// types/proveedor.ts
export type TipoDocumento = 'DNI' | 'Pasaporte' | 'CUIT' | 'CUIL' | 'LE' | 'LC';

export interface Padron {
    id: number;
    tipo_documento: TipoDocumento;
    documento: string;
    nacionalidad: string;
    created_at?: string;
    updated_at?: string;
}


export interface Proveedor {
    id: number;
    id_padron: number;
    nombre_fantasia: string;
    razon_social: string;
    padron: Padron;
    saldo?: number;
}

// Tipo para el formulario que funciona con useForm
export type ProveedorForm = Omit<Proveedor, 'padron'> & {
    padron: {
        tipo_documento: TipoDocumento;
        documento: string;
        nacionalidad: string;
    };
};


export interface ProveedoresEditarProps {
     open: boolean;
     setOpen: (open: boolean) => void;
     proveedor: Proveedor;
     module: number;
}
