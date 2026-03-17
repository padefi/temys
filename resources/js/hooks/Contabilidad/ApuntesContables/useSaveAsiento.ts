import { asientosService } from "@/services/Contabilidad";
import { router } from "@inertiajs/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSaveAsiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: asientosService.save,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asientos"] });
            queryClient.invalidateQueries({ queryKey: ["partidas"] });
            toast.success("Asiento guardado con éxito");
            router.visit(route("asientosContables"));
        },
        onError: (error: any) => {
            const serverErrors = error.response?.data?.errors;

            if (serverErrors) {
                Object.keys(serverErrors).forEach((key) => {
                    serverErrors[key].forEach((msg: string) => {
                        toast.error(msg);
                    });
                });
            } else {
                const message =
                    error.response?.data?.message ||
                    "Error al procesar la solicitud";
                toast.error(message);
            }
        },
    });
}
