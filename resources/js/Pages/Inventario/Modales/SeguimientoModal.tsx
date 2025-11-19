import { Dialog, DialogContent, DialogHeader, DialogTitle,DialogDescription } from "@/Components/ui/dialog"
import { ProductTracking } from "./SeguimientoProductos"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { useEffect, useState } from "react"
import axios from "axios"

export interface MovimientoEstado {
  id: number;
  transito_id: number;
  estado: string;
  usuario_id: number;
  fecha: string; 
  observacion: string;
  usuario?: {
    id: number;
    name: string;
  };
}

export interface Almacen {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
}

export interface InventarioOrdenEntrega {
  id: number;
  origen: Almacen;
  destino: Almacen;
  
}

export interface InventarioStockTransito {
  id: number;
  movimiento_id: number;
  producto_id: number;
  origen_id: number;
  destino_id: number;
  cantidad: number;
  estado: string;
  ubicacion_actual: string;
  fecha_salida: string; 
  fecha_llegada: string;
  observaciones: string;
  producto: Producto;
   orden_entrega: InventarioOrdenEntrega;
  movimiento_estados: MovimientoEstado[];
}


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

console.log(idEntregas)
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
 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl">Seguimiento de Producto</DialogTitle>
            <DialogDescription>
            Aca podra ver el seguimiento
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
