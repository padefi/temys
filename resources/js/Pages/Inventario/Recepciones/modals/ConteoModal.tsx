import { useState } from "react";
import { Check, X } from "lucide-react";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { RecepcionesItem } from "@/types/Inventario/Operaciones/Recepciones/Recepciones"; 
import { router } from "@inertiajs/react";

interface StockApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RecepcionesItem | null;
    onAprobado: (requestId: string, cantidadAprobada: number) => void;
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
    const [estadoRecepcion, setEstadoRecepcion] = useState("completo");

    if (!request) return null;

    const handleSubmit = async () => {
        const payload = {
            recepcion_id: request.id,
            productos: request.detalles?.map((detalle) => ({
                producto_id: detalle.producto_id,
                cantidad_contada: parseInt(cantidadesAprobadas[detalle.producto_id]) || 0,
                estado: estadoRecepcion,
            })),
        };

        try {
            await axios.post("/inventario/recepcion/control-recepcion", payload);
            onAprobado(request.id, 0);
            onClose();
            router.reload({ only: ["recepcionProductos"] });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitRechazado = async () => {
        const payload = {
            recepcion_id: request.id,
            motivo,
        };

        try {
            await axios.post("/inventario/recepcion/rechazar", payload);
            onRechazado(request.id, motivo);
            onClose();
            router.reload({ only: ["recepcionProductos"] });
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        setMotivo("");
        setAction(null);
        setCantidadesAprobadas({});
        setErroresPorProducto({});
        setEstadoRecepcion("completo");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Conteo físico de productos</DialogTitle>
                    <DialogDescription>
                        Control de recepción que permite validar si las cantidades de productos que llegaron físicamente
                        coinciden con lo solicitado en la orden, identificando faltantes o excesos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {request.detalles?.map((detalle) => {
                        const cantidadAprobada = cantidadesAprobadas[detalle.producto_id] || "";
                        return (
                            <div
                                key={detalle.producto_id}
                                className={`p-4 rounded-lg border transition-colors ${
                                    action === "rechazado"
                                        ? "bg-red-50 border-red-200"
                                        : "bg-green-50 border-green-200"
                                }`}
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

                    {action === "aprobado" && (
                        <div className="space-y-2 p-4 rounded-lg border bg-green-50 border-green-200">
                            <Label>Estado de la recepción</Label>
                            <select
                                value={estadoRecepcion}
                                onChange={(e) => setEstadoRecepcion(e.target.value)}
                                className="w-full border border-green-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                            >
                                <option value="parcial">Parcial</option>
                                <option value="faltante">Faltante</option>
                                <option value="completo">Completo</option>
                            </select>
                        </div>
                    )}

                    {action === "rechazado" && (
                        <div className="space-y-2">
                            <Label>Justificación</Label>
                            <Textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                className="min-h-[80px] resize-none"
                                required
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    {!action && (
                        <>
                            <Button variant="destructive" onClick={() => setAction("rechazado")} className="gap-2">
                                <X className="h-4 w-4" />
                                No recibirlo
                            </Button>
                            <Button onClick={() => setAction("aprobado")} className="gap-2">
                                <Check className="h-4 w-4" />
                                Aprobar
                            </Button>
                        </>
                    )}

                    {action === "aprobado" && (
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                Object.values(cantidadesAprobadas).some(
                                    (val) => parseInt(val) <= 0
                                ) ||
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
                            onClick={handleSubmitRechazado}
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
