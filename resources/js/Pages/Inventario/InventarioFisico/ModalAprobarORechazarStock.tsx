import { useEffect, useState } from "react"
import { AlertTriangle, Check, CheckCircle, X } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import axios from "axios"
import { StockItem, StockRequest } from "./Types"



interface StockApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  request: StockRequest | null
  onAprobado: (requestId: string, cantidadAprobada: number, motivo: string) => void
  onRechazado: (requestId: string, motivo: string) => void
}


export default function AceptarStock({ isOpen, onClose, request, onAprobado, onRechazado }: StockApprovalModalProps) {
  const [cantidadAprobada, setCantidadAprobada] = useState("")
  const [stockDisponible, setStockDisponible] = useState<StockItem[]>([]);
  const [motivo, setMotivo] = useState("")
  const [action, setAction] = useState<"aprobado" | "rechazado" | null>(null)


  const [errorCantidad, setErrorCantidad] = useState("");
  useEffect(() => {
    if (!request?.id_producto) return; // ✅ Solo cuando request es válido

    axios
      .get(`/solicitudes-stock-disponible/${request.id_producto}`)
      .then(res => {
        setStockDisponible(res.data);
      })
      .catch(err => {
        console.error("Error al obtener detalles:", err);
      });
  }, [request]);

  console.log(stockDisponible[0])

  if (!request) return null




  const handleSubmit = async () => {
    if (action === "aprobado") {
      const cantidad = Number.parseInt(cantidadAprobada) || 0
      const estado = 'Aceptada'
      onAprobado(request.id, cantidad, motivo)
      try {
        const response = await axios.post('/solicitudes-stock-aceptar', {
          solicitud_id: request.id,
          estado,
          motivo,
          cantidad,
        });


      } catch (err: any) {
        if (err.response?.status === 422) {
          const errors = err.response.data.errors;
          setErrorCantidad(Object.values(errors).flat().join(', '));
        } else {
          setErrorCantidad('Error al conectar con el servidor');
        }
        console.error(err);
      }


    } else if (action === "rechazado") {
      const estado = 'Cancelada'

      onRechazado(request.id, motivo)
      try {
        const response = await axios.post('/solicitudes-stock-cancelar', {
          solicitud_id: request.id,
          estado,
          motivo,

        });
      } catch (err: any) {
        if (err.response?.status === 422) {
          const errors = err.response.data.errors;
          setErrorCantidad(Object.values(errors).flat().join(', '));
        } else {
          setErrorCantidad('Error al conectar con el servidor');
        }
        console.error(err);
      }
    }

    // Reset form
    setCantidadAprobada("")
    setMotivo("")
    setAction(null)
    onClose()
  }

  const handleClose = () => {
    setCantidadAprobada("")
    setMotivo("")
    setAction(null)
    onClose()
    setErrorCantidad("")
    setCantidadAprobada("")
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aprobar Solicitud de Stock</DialogTitle>
          <DialogDescription>Revisa y aprueba o rechaza la solicitud de transferencia de stock</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* alerta de stock disponible o no */}
          {stockDisponible.map((stock, index) => {
            const stockEsBajo = stock.cantidad_actual < stock.stock_minimo;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border mb-4 ${stockEsBajo
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                  }`}
              >
                <div
                  className={`flex items-center gap-2 mb-2 ${stockEsBajo ? 'text-red-800' : 'text-green-800'
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

                <div
                  className={`text-sm ${stockEsBajo ? 'text-red-700' : 'text-green-700'
                    } border-b pb-2`}
                >
                  <div className="font-medium">{stock.producto.nombre}</div>
                  <div>
                    Stock actual: <span className="font-bold">{stock.cantidad_actual}</span> | Mínimo:
                    <span className="font-bold"> {stock.stock_minimo}</span>
                  </div>
                  <div>Almacén: {stock.almacen.nombre}</div>
                </div>
              </div>
            );
          })}

          {/* detalle de la solicitud */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Almacén Solicitante</Label>
              <Input value={request.nombre_almacen_solicitante} disabled />
            </div>
            <div className="space-y-2">
              <Label>Producto</Label>
              <Input value={request.nombre_producto} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cantidad Solicitada</Label>
              <Input value={request.cantidad?.toString()} disabled />
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Input value={request.prioridad} className={`px-2 py-1 rounded-full text-xs font-medium ${request.prioridad === "Alta"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"}`} disabled />
            </div>
          </div>

          {/* Original Justification */}
          <div className="space-y-2">
            <Label>Justificación Original</Label>
            <Textarea value={request.motivo} disabled className="min-h-[60px] resize-none" />
          </div>

          {/* confirmacion */}
          {action === "aprobado" && (
            <div className="space-y-4 p-4 border rounded-lg bg-green-50">
              <div className="space-y-2">
                <Label htmlFor="approved-quantity">Cantidad Aprobada</Label>
                <Input
                  id="approved-quantity"
                  type="number"
                  placeholder="Ingresa la cantidad a aprobar"
                  value={cantidadAprobada}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const max = request.cantidad;

                    if (value > max) {
                      setErrorCantidad(`No puedes aprobar más de ${max}`);
                    } else if (value < 0) {
                      setErrorCantidad("La cantidad no puede ser negativa");
                    } else if (value == 0) {
                      setErrorCantidad("La cantidad no puede ser cero");
                    } else {
                      setErrorCantidad("");
                      setCantidadAprobada(e.target.value);
                    }
                    setCantidadAprobada(e.target.value);
                  }}
                  max={request.cantidad}
                  min="0"
                />
                {errorCantidad && (
                  <p className="text-sm text-red-500 mt-1">{errorCantidad}</p>
                )}


              </div>
              <div className="space-y-2">
                <Label htmlFor="approval-notes">Notas de Aprobación</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Notas adicionales (opcional)..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="min-h-[80px] resize-none"
                  
                />
              </div>
            </div>
          )}

          {/* seccion rechazada */}
          {action === "rechazado" && (
            <div className="space-y-4 p-4 border rounded-lg bg-red-50">
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Motivo del Rechazo</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Explica el motivo del rechazo..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="min-h-[80px] resize-none"
                  required
                />
              </div>
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
                Rechazar
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
              disabled={!cantidadAprobada || Number.parseInt(cantidadAprobada) <= 0 || !!errorCantidad || !motivo.trim()}
              className="gap-2"
              >
              <Check className="h-4 w-4" />
              Confirmar Aprobación
            </Button>
          )}

          {action === "rechazado" && (
            <Button variant="destructive" onClick={handleSubmit} disabled={!motivo.trim()} className="gap-2">
              <X className="h-4 w-4" />
              Confirmar Rechazo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
