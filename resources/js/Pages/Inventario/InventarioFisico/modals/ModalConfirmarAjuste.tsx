import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { Package, MapPin, Calendar, User, FileText, TrendingUp, TrendingDown } from "lucide-react"
import { AjusteData } from "../Types"
import axios from "axios"


interface AjusteInventarioModalProps {
    isOpen: boolean;
    onClose: () => void;
    idAjuste: number;
    productoId: number;
    onApprove: () => void;
    onReject: () => void;
}

export function AjusteInventarioModal({
    isOpen,
    onClose,
    idAjuste,
    productoId,
    onApprove,
    onReject,
}: AjusteInventarioModalProps) {
    const [ajusteData, setAjusteData] = useState<AjusteData | null>(null);

    useEffect(() => {
        if (!idAjuste || !productoId) return;

        axios
            .get(`/inventario/ajusteInventario`, {
                params: {
                    ajuste_id: idAjuste,
                    producto_id: productoId,
                },
            })
            .then((res) => setAjusteData(res.data.data[0]))
            .catch((err) => console.error("Error al cargar el ajuste", err));
    }, [idAjuste, productoId]);



    if (!ajusteData) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">
                            Ajuste de Inventario
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-center text-muted-foreground">Cargando ajuste...</p>
                </DialogContent>
            </Dialog>
        );
    }

    // 🔹 Ahora sí, ya tenemos datos
    const isDiferenciaPositiva = ajusteData.diferencia > 0;
    const diferenciaColor = isDiferenciaPositiva ? "text-green-600" : "text-red-600";
    const diferenciaIcon = isDiferenciaPositiva ? TrendingUp : TrendingDown;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center">Ajuste de Inventario</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Producto */}
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Producto</p>
                            <p className="font-medium">{ajusteData.producto}</p>
                        </div>
                    </div>

                    {/* Almacén */}
                    <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Almacén</p>
                            <p className="font-medium">{ajusteData.almacen}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Cantidades */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">En Sistema</p>
                            <p className="text-2xl font-bold">{ajusteData.cantidadSistema}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Contado</p>
                            <p className="text-2xl font-bold">{ajusteData.cantidadContada}</p>
                        </div>
                    </div>

                    {/* Diferencia */}
                    <div className="text-center p-4 border rounded-lg">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {React.createElement(diferenciaIcon, {
                                className: `h-5 w-5 ${diferenciaColor}`,
                            })}
                            <p className="text-sm text-muted-foreground">Diferencia</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <p className={`text-3xl font-bold ${diferenciaColor}`}>
                                {isDiferenciaPositiva ? "+" : ""}
                                {ajusteData.diferencia}
                            </p>
                            <Badge variant={isDiferenciaPositiva ? "default" : "destructive"}>
                                {isDiferenciaPositiva ? "Exceso" : "Faltante"}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Información adicional */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Fecha</p>
                                <p className="text-sm font-medium">{ajusteData.fecha}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Usuario</p>
                                <p className="text-sm font-medium">{ajusteData.usuario}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Motivo</p>
                                <p className="text-sm font-medium">{ajusteData.motivo}</p>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={onReject}>
                            Rechazar
                        </Button>
                        <Button className="flex-1" onClick={onApprove}>
                            Aprobar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
