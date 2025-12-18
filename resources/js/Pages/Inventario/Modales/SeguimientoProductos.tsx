import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@radix-ui/react-select"
import { Package, MapPin, Calendar, Clock, AlertCircle, CheckCircle2, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { InventarioStockTransito } from "@/types/Inventario/Reportes/Seguimiento/Seguimiento"
import { MovimientoEstado } from "@/types/Inventario/Reportes/Seguimiento/Seguimiento"
import { dateTimeFormat } from "@/utils/formatterFunctions"



interface ProductTrackingProps {
  stockTransito?: InventarioStockTransito
  historialEstados?: MovimientoEstado[]
  productoNombre?: string
  origenNombre?: string
  destinoNombre?: string
}

const estadoConfig = {
  pendiente: {
    label: "Pendiente",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
  },
  en_transito: {
    label: "En Tránsito",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
  },
  en_ruta: {
    label: "En Ruta",
    color: "bg-primary text-primary-foreground",
    icon: Truck,
  },
  completado: {
    label: "Completado",
    color: "bg-chart-3 text-primary-foreground",
    icon: CheckCircle2,
  },
  entregado: {
    label: "Entregado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
  retenido: {
    label: "Retenido",
    color: "bg-accent text-accent-foreground",
    icon: AlertCircle,
  },
}

export function ProductTracking({
  stockTransito,
  historialEstados,
  productoNombre,
  origenNombre,
  destinoNombre,
}: ProductTrackingProps) {
  const estadoActual = estadoConfig[stockTransito?.estado as keyof typeof estadoConfig] || estadoConfig.pendiente
  const EstadoIcon = estadoActual.icon

  console.log(stockTransito)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No especificada"
    const date = new Date(dateString)
    return dateTimeFormat(date)
  }


  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Entrega #{stockTransito?.entrega_id}</CardTitle>
              <p className="text-sm text-muted-foreground">
                CANTIDAD TOTAL • {stockTransito?.cantidad_total} unidades
              </p>
            </div>
            <Badge className={cn("text-sm px-3 py-1", estadoActual.color)}>
              <EstadoIcon className="w-4 h-4 mr-1.5" />
              {estadoActual.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Route Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Origen</p>
                <p className="text-sm font-semibold">{origenNombre}</p>
              </div>
            </div>

{/*             <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Truck className="w-5 h-5 text-primary" />
              </div>
               <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Ubicación Actual</p>
                <p className="text-sm font-semibold">{stockTransito?.ubicacion_actual}</p>
              </div> 
            </div> */}

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Destino</p>
                <p className="text-sm font-semibold">{destinoNombre}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Fecha de Salida</p>
                <p className="text-sm font-semibold">{formatDate(stockTransito?.fecha_salida)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Fecha de Llegada Estimada</p>
                <p className="text-sm font-semibold">{formatDate(stockTransito?.fecha_llegada)}</p>
              </div>
            </div>
          </div>

          {/* Observations */}
          {stockTransito?.observaciones && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Observaciones</p>
                  <p className="text-sm text-foreground">{stockTransito.observaciones}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Historial de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

            {historialEstados?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay historial de estados disponible</div>
            ) : (
              historialEstados?.map((estado, index) => {
                const config = estadoConfig[estado.estado as keyof typeof estadoConfig] || estadoConfig.pendiente
                const Icon = config.icon
                const isLast = index === historialEstados.length - 1

                return (
                  <div key={`${estado.transito_id}-${index}`} className="relative flex gap-4 items-start">
                    
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-background",
                        isLast ? config.color : "bg-muted",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="font-semibold text-base">{config.label}</h4>
                          <h4 className="text-base">Ubicacion Actual: {estado.ubicacion_actual}</h4>                      
                          <p className="text-sm text-muted-foreground">{formatDate(estado.fecha)}</p>
                        </div>
                        {isLast && (
                          <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-700">
                            Actual
                          </Badge>
                        )}
                      </div>
                      {estado.observacion && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-3 rounded-md">
                          {estado.observacion} <br />
                         
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
