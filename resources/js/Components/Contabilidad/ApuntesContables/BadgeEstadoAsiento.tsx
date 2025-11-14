import { Badge } from "@/Components/ui/badge";
import { EstadoAsiento as Estado } from "@/types/Contabilidad/Asientos/Asiento";

function getVariant(state: Estado): "default" | "success" | "warning" | "destructive" {
    switch (state) {
        case Estado.PENDIENTE:
            return 'warning';
        case Estado.CONTROLADO:
            return 'success';
        case Estado.ANULADO:
            return 'destructive';
        default:
            return "default";
    }
}

export default function BadgeEstadoAsiento({ state }: { state: Estado }) {
    return <Badge variant={getVariant(state)}>{state}</Badge>
}