import { Cuenta } from "@/types/Contabilidad/PlanCuentas";

export const cuentasService = {
    getAll: async (): Promise<Cuenta[]> => {
        const response = await fetch("/cuentas-contables");
        if (!response.ok) throw new Error("Error al cargar cuentas");
        return response.json();
    },
    search: async (term: string): Promise<Cuenta[]> => {
        const response = await fetch(`/cuentas-contables?search=${term}`);
        return response.json();
    },    
};
