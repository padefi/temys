import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog"
import { ProductTracking } from "./SeguimientoProductos"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { useEffect, useState } from "react"
import { InventarioStockTransito } from "@/types/Inventario/Reportes/Seguimiento/Seguimiento"
import axios from "axios"


interface TrackingModalProps {
  open: boolean
  onOpenChange: () => void
  idEntregas: number | null
}

export function TrackingModal({
  open,
  onOpenChange,
  idEntregas
}: TrackingModalProps) {

  const [stockTransito, setstockTransito] = useState<InventarioStockTransito>()

  useEffect(() => {
    if (!idEntregas) return;

    axios
      .post("/inventario/seguimiento", { orden_id: idEntregas })
      .then((res) => {
        setstockTransito(res.data[0]);

      })
      .catch((err) => {
        console.error("Error al cargar el seguimiento", err);
      });
  }, [idEntregas]);

  console.log(stockTransito)


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl">Seguimiento de Entrega</DialogTitle>
          <DialogDescription>
            Aca podra visualizar en que estado se encuientra su envio de productos
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <ProductTracking
            stockTransito={stockTransito}
            historialEstados={stockTransito?.movimiento_estados}
            productoNombre={stockTransito?.producto?.nombre}
            origenNombre={stockTransito?.orden_entrega?.origen?.nombre}
            destinoNombre={stockTransito?.orden_entrega?.destino?.nombre}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
