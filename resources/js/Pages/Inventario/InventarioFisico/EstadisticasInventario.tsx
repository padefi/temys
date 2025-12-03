import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { StockInventarioItem } from "@/types/Inventario/Operaciones/InventarioFisico/Stock"; 
import { Package, TrendingUp, TrendingDown } from "lucide-react"


interface EstadosMovimientoProps {
   data:  StockInventarioItem[] ;
}

export function EstadisticaInventario({ data }: EstadosMovimientoProps) {
  const totalExistenciaActual = data.reduce((sum, item) => sum + item.cantidad_actual, 0)
  const stockBajo=data.filter((item) => item.cantidad_actual <= item.stock_minimo).length
  const sinStock=data.filter((item) => item.cantidad_actual === 0).length

  const estadistica = [
    {
      titulo: "Total Productos",
      value: totalExistenciaActual,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      titulo: "Stock Bajo",
      value: stockBajo, 
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      
    },
    {
      titulo: "Sin Stock",
   value: sinStock, 
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },

  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {estadistica.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{item.titulo}</CardTitle>
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value.toLocaleString()}</div> 
          </CardContent>
        </Card>
      ))} 
    </div>
  )
}
