import { Badge } from "@/Components/ui/badge";
import { EstadoAsiento } from "@/types/Contabilidad/Asientos/EstadoAsientos";

function getVariant(state: EstadoAsiento): "default" | "success" | "warning" | "destructive" {
    switch (state) {
        case EstadoAsiento.PENDIENTE:
            return 'warning';
        case EstadoAsiento.CONTROLADO:
            return 'success';
        case EstadoAsiento.ANULADO:
            return 'destructive';
        default:
            return "default";
    }
}

export default function BadgeEstadoAsiento({ state }: { state: EstadoAsiento }) {
    return <Badge variant={getVariant(state)}>{state}</Badge>
}