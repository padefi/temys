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


export interface Cliente {
    id: number;
    id_padron: number;
    nombre: string;
    apellido: string;
    padron: Padron;
    saldo?: number;
}

// Tipo para el formulario que funciona con useForm
export type ClienteForm = Omit<Cliente, 'padron'> & {
    padron: {
        tipo_documento: TipoDocumento;
        documento: string;
        nacionalidad: string;
    };
};


export interface ClientesEditarProps {
     open: boolean;
     setOpen: (open: boolean) => void;
     cliente: Cliente;
     module: number;
}
