import { cuentasService } from "@/services/Contabilidad";
import { useQuery } from "@tanstack/react-query";

export function useCuentasData() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["plan-cuentas"],
        queryFn: cuentasService.getAll,
        staleTime: 1000 * 60 * 30,
    });

    return {
        cuentas: data ?? [],
        isLoading,
        error,
    };
}
