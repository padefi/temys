// types/proveedor.ts
export type TipoDocumento = 'CUIT';
export type TipoProveedor = 'Humana' | 'Jurídica';

export interface Padron {
    id: number;
    tipo_documento: TipoDocumento;
    documento: string;
    nacionalidad: number;
}

export interface Proveedor {
    id: number;
    id_padron: number;
    tipo: TipoProveedor;
    nombre_fantasia: string;
    razon_social: string;
    padron: Padron;
    saldo?: number;
}

//Tipo para el formulario que funciona con useForm
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
