import { useEffect, useState } from "react";
import { AlertTriangle, Check, CheckCircle, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
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
import { StockItem, StockRequest } from "./Types";

interface StockApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: StockRequest | null;
  onAprobado: (
    requestId: string,
    cantidadAprobada: number,
    motivo: string
  ) => void;
  onRechazado: (requestId: string, motivo: string) => void;
}

export default function AceptarStock({
  isOpen,
  onClose,
  request,
  onAprobado,
  onRechazado,
}: StockApprovalModalProps) {
  const [stockDisponible, setStockDisponible] = useState<StockItem[]>([]);
  const [motivo, setMotivo] = useState("");
  const [action, setAction] = useState<"aprobado" | "rechazado" | null>(null);
  const [cantidadesAprobadas, setCantidadesAprobadas] = useState<Record<number, string>>({});
  const [erroresPorProducto, setErroresPorProducto] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!request) return;

    const fetchStock = async () => {
      try {
        const responses = await Promise.all(
          request.detalles.map((detalle) =>
            axios.get(`/solicitudes-stock-disponible/${detalle.producto_id}`)
          )
        );

        const allStock = responses.flatMap((res) => res.data);
        setStockDisponible(allStock);
      } catch (err) {
        console.error("Error al obtener detalles:", err);
      }
    };

    fetchStock();
  }, [request]);

  if (!request) return null;
console.log("Request", request);

  const handleSubmit = async () => {
    const estado = action === "aprobado" ? "Aceptada" : "Cancelada";

    try {
      const payload = {
        solicitud_id: request.id,
        estado,
        motivo,
        productos:
          action === "aprobado"
            ? request.detalles.map((detalle) => ({
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

  const stockPorProducto = (productoId: number) =>
    stockDisponible.find((s) => s.producto.id === productoId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Aprobar Solicitud de Stock</DialogTitle>
          <DialogDescription>
            Revisa y aprueba o rechaza la solicitud de transferencia de stock
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {request.detalles.map((detalle) => {
            const stock = stockPorProducto(detalle.producto_id);
            const cantidadAprobada = cantidadesAprobadas[detalle.producto_id] || "";
            const stockEsBajo = stock
              ? stock.cantidad_actual < stock.stock_minimo
              : false;

            return (
              <div
                key={detalle.producto_id}
                className={`p-4 rounded-lg border ${
                  stockEsBajo
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div
                  className={`flex items-center gap-2 mb-2 ${
                    stockEsBajo ? "text-red-800" : "text-green-800"
                  }`}
                >
                  {stockEsBajo ? (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Stock Bajo Detectado</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Stock Disponible</span>
                    </>
                  )}
                </div>

                <div className="text-sm mb-4">
                  <div className="font-medium">
                    {detalle.nombre_producto || "Producto desconocido"}
                  </div>
                  <div>
                    Cantidad solicitada: <b>{detalle.cantidad}</b>
                  </div>
                  {stock && (
                    <div>
                      Stock actual: <b>{stock.cantidad_actual}</b> / Mínimo:{" "}
                      <b>{stock.stock_minimo}</b>
                      <br />
                      Almacén: {stock.almacen.nombre}
                    </div>
                  )}
                </div>

                {action === "aprobado" && (
                  <div className="space-y-2">
                    <Label>Cantidad Aprobada</Label>
                    <Input
                      type="number"
                      placeholder="Cantidad a aprobar"
                      value={cantidadAprobada}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        const errores: Record<number, string> = {};

                        if (!stock || stock.cantidad_actual === 0) {
                          errores[detalle.producto_id] = "No hay stock disponible en el almacén";
                        } /* else if (value > detalle.cantidad) {
                          errores[detalle.producto_id] = `No puedes aprobar más de ${detalle.cantidad}`;
                        } */ else if (value > stock.cantidad_actual) {
                          errores[detalle.producto_id] = `No hay suficiente stock disponible (${stock.cantidad_actual})`;
                        } else if (value <= 0) {
                          errores[detalle.producto_id] = "La cantidad debe ser mayor que 0";
                        }

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
                      max={detalle.cantidad}
                      min="0"
                      disabled={!stock || stock.cantidad_actual === 0 || stock.cantidad_actual <= stock.stock_minimo}
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
              onClick={handleSubmit}
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
              onClick={handleSubmit}
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
