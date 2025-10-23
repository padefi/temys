import { useState } from "react";
import { Check, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { RecepcionesItem } from "../RecepcionesManagement";

interface StockApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RecepcionesItem | null;
    onAprobado: (
        requestId: string,
        cantidadAprobada: number,
        motivo: string
    ) => void;
    onRechazado: (requestId: string, motivo: string) => void;
}

export default function RecepcionProductos({
    isOpen,
    onClose,
    request,
    onAprobado,
    onRechazado,
}: StockApprovalModalProps) {

    const [motivo, setMotivo] = useState("");
    const [action, setAction] = useState<"aprobado" | "rechazado" | null>(null);
    const [cantidadesAprobadas, setCantidadesAprobadas] = useState<Record<number, string>>({});
    const [erroresPorProducto, setErroresPorProducto] = useState<Record<number, string>>({});

    console.log(request)

    if (!request) return null;

    const handleSubmit = async () => {
        const estado = action === "aprobado" ? "Aceptada" : "Cancelada";

        try {
            const payload = {
                solicitud_id: request.id,
                estado,
                motivo,
                productos:
                    action === "aprobado"
                        ? request.detalles?.map((detalle) => ({
                            producto_id: detalle.producto_id,
                            cantidad_aprobada:
                                parseInt(cantidadesAprobadas[detalle.producto_id]) || 0,
                        }))
                        : [],
            };

            const url =
                action === "aprobado"
                    ? "/solicitudes-stock-aceptar"
                    : "/solicitudes-stock-cancelar";

            await axios.post(url, payload);
            action === "aprobado"
                ? onAprobado(request.id, 0, motivo)
                : onRechazado(request.id, motivo);

            onClose();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleClose = () => {
        setMotivo("");
        setAction(null);
        setCantidadesAprobadas({});
        setErroresPorProducto({});
        onClose();
    };



    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Conteo físico de productos</DialogTitle>
                    <DialogDescription>
                        Control de recepción que permite validar si las cantidades de productos que llegaron físicamente coinciden con lo solicitado en la orden,
                        identificando faltantes, excesos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {request.detalles?.map((detalle) => {
                        const cantidadAprobada = cantidadesAprobadas[detalle.producto_id] || "";
                        return (
                            <div
                                key={detalle.producto_id}
                                className={`p-4 rounded-lg border bg-green-50 border-green-200 `}
                            >
                                <div className="text-sm mb-4">
                                    <div className="font-medium">
                                        {detalle.nombreProducto || "Producto desconocido"}
                                    </div>
                                    <div>
                                        Cantidad esperada: <b>{detalle.cantidadEsperada}</b>
                                    </div>

                                </div>

                                {action === "aprobado" && (
                                    <div className="space-y-2">
                                        <Label>Cantidad Contada</Label>
                                        <Input
                                            type="number"
                                            placeholder="Cantidad Contada"
                                            value={cantidadAprobada}
                                            onChange={(e) => {
                                                const errores: Record<number, string> = {};

                                                setErroresPorProducto((prev) => ({
                                                    ...prev,
                                                    ...errores,
                                                    ...(errores[detalle.producto_id]
                                                        ? {}
                                                        : { [detalle.producto_id]: "" }),
                                                }));

                                                setCantidadesAprobadas((prev) => ({
                                                    ...prev,
                                                    [detalle.producto_id]: e.target.value,
                                                }));
                                            }}
                                            max={detalle.cantidadEsperada}
                                            min="0"

                                        />
                                        {erroresPorProducto[detalle.producto_id] && (
                                            <p className="text-sm text-red-500">
                                                {erroresPorProducto[detalle.producto_id]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="space-y-2">
                        <Label>Justificación</Label>
                        <Textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="min-h-[80px] resize-none"
                            required
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>

                    {!action && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={() => setAction("rechazado")}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Rechazar
                            </Button>
                            <Button
                                onClick={() => setAction("aprobado")}
                                className="gap-2"
                            >
                                <Check className="h-4 w-4" />
                                Aprobar
                            </Button>
                        </>
                    )}

                    {action === "aprobado" && (
                        <Button
                            /*  onClick={handleSubmit} */
                            disabled={
                                Object.values(cantidadesAprobadas).some(
                                    (val) => parseInt(val) <= 0
                                ) ||
                                !motivo.trim() ||
                                Object.values(erroresPorProducto).some((e) => !!e)
                            }
                            className="gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Confirmar Aprobación
                        </Button>
                    )}

                    {action === "rechazado" && (
                        <Button
                            variant="destructive"
                            /*    onClick={handleSubmit} */
                            disabled={!motivo.trim()}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Confirmar Rechazo
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
