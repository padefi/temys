import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductTracking } from "./SeguimientoProductos" 
import { ScrollArea } from "@/Components/ui/scroll-area" 
import { useEffect, useState } from "react"
import axios from "axios"

export interface MovimientoEstado {
  id: number;
  transito_id: number;
  estado: string;
  usuario_id: number;
  fecha: string; // formato: "2025-11-07 18:23:39"
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

export interface InventarioStockTransito {
  id: number;
  movimiento_id: number;
  producto_id: number;
  origen_id: number;
  destino_id: number;
  cantidad: number;
  estado: string;
  ubicacion_actual: string;
  fecha_salida: string; // formato ISO "2025-11-04T18:23:36.000000Z"
  fecha_llegada: string;
  observaciones: string;

  producto: Producto;
  origen: Almacen;
  destino: Almacen;
  // Si la API devuelve un solo estado (objeto):
  //movimiento_estados: MovimientoEstado | null;
  // Si en el futuro devuelve varios:
   movimiento_estados: MovimientoEstado[];
}


interface TrackingModalProps {
  open: boolean
  onOpenChange: () => void
  idSeguimiento:number |null
/*  stockTransito: StockTransito | null
   historialEstados: MovimientoEstado[]
  productoNombre?: string
  origenNombre?: string
  destinoNombre?: string */
}

export function TrackingModal({
  open,
  onOpenChange,
  idSeguimiento
 /* stockTransito,
   historialEstados,
  productoNombre,
  origenNombre,
  destinoNombre, */
}: TrackingModalProps) {

       const [stockTransito, setstockTransito] = useState<InventarioStockTransito>()
console.log('modal',open)
 

  useEffect(() => {

    if (!idSeguimiento) return

    axios
      .post("/inventario/seguimiento", { movimiento_id: idSeguimiento }) 
      .then((res) => {
        setstockTransito(res.data)
      })
      .catch((err) => {
        console.error("Error al cargar el seguimiento", err)
      })
  }, [idSeguimiento]) 

  console.log(stockTransito)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl">Seguimiento de Producto</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
           <ProductTracking
            stockTransito={stockTransito}
            historialEstados={stockTransito?.movimiento_estados}
            productoNombre={stockTransito?.producto?.nombre}
            origenNombre={stockTransito?.origen?.nombre}
            destinoNombre={stockTransito?.destino?.nombre}
          />  
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
