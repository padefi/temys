export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export interface DataTableParams {
    page: string;
    per_page: string;
    sort?: string;
    filters: { [key: string]: string }; // Objeto para filtros por columna
    [key: string]: string | undefined | { [key: string]: string }; // Para otros parámetros dinámicos
}
