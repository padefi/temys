"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { Calendar, Package, User, TrendingUp, History } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { StockItem } from "@/types/Inventario/Operaciones/InventarioFisico/Stock" 
import { router } from "@inertiajs/react"
import { toast } from "sonner"


interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  idProducto: number
}

export function ExistenciaModal({ isOpen, onClose, idProducto }: ProductModalProps) {
  const [ajusteProducto, setAjusteProducto] = useState<StockItem>();
  const [cantidadContada, setCantidadContada] = useState<number | undefined>(undefined);

  // Función para calcular la diferencia
  const calculaDiferencia = (aMano: number, contada: number) => {
    if (contada > 0) {
      return (contada !== undefined ? contada : aMano) - aMano;
    }
  };
  const diferencia = calculaDiferencia(ajusteProducto?.cantidad_actual ?? 0, cantidadContada ?? 0) ?? 0;


  useEffect(() => {
    if (!idProducto) return;
    axios
      .get(`/ajuste-stock/${idProducto}`)
      .then((res) => setAjusteProducto(res.data.data[0]))
      .catch((err) => console.error("Error al cargar el ajuste", err));
  }, [idProducto]);

const handleOpenWithFilter = (idProducto: number) => {
    router.visit(`/inventario/historialMoviminto/movimiento/${idProducto}`); //renderiza pagina con id
  };


  const handleAplicarFila = async (id: number, cantidad: number, motivo?: string) => {
    if (!cantidad || cantidad <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    try {
      const response = await axios.post(`/actualizar-cantidad-contadas/${id}`, {
        cantidad_contada: cantidad,
        motivo: motivo || "Ajuste manual individual desde existencias",
      });

      toast.success(response.data.message);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al aplicar ajuste");
      console.error("Error al aplicar fila:", error);
    }
  };


  if (!ajusteProducto) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-balance">Detalles del Producto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nombre del producto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Producto</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md text-balance">{ajusteProducto?.producto.nombre}</p>
          </div>

          <Separator />

          {/* Información de inventario */}
          <div className="grid  gap-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Inventario
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">Cantidad a la mano:</span>
                  <Badge variant="secondary" className="font-mono">
                    {ajusteProducto?.cantidad_actual}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">Cantidades contadas:</span>
                  <input
                    type="number"
                    className="w-24 p-2 text-sm font-mono rounded-md border border-input bg-background"
                    value={cantidadContada ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d*$/.test(val)) {
                        toast.error("Solo se permiten números");
                        return;
                      }
                      const num = val === "" ? undefined : Number(val);
                      if (num === 0) {
                        toast.error("El número no puede ser 0");
                        return;
                      }
                      setCantidadContada(num);
                    }}
                  />
                </div>


                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">Diferencia:</span>
                  <Badge
                    variant={
                      diferencia > 0 ? "success" :
                        diferencia < 0 ? "destructive" :
                          "outline"
                    }
                    className="font-mono"
                  >
                    {diferencia === 0 ? "Sin diferencia" : diferencia}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 flex items-center gap-2 bg-transparent" onClick={() => { handleOpenWithFilter(idProducto) }}>
              <History className="h-4 w-4" />
              Ver Historial
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (!ajusteProducto || cantidadContada === undefined) {
                  toast.error("Debe ingresar una cantidad válida");
                  return;
                }

                handleAplicarFila(
                  ajusteProducto.id,
                  cantidadContada,
                  "Ajuste manual individual desde existencias"
                );

                onClose(); // cerrar modal después de aplicar
              }}
            >
              Establecer Conteo
            </Button>

            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
