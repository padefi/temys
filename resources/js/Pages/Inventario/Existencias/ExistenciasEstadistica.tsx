import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { ExistenciasItem} from "@/types/Inventario"
import { Package, TrendingUp, TrendingDown, ChartArea } from "lucide-react"


interface EstadosMovimientoProps {
   data:  ExistenciasItem[] ;
}

export function ExistenciasEstadistica({ data }: EstadosMovimientoProps) {

  console.log(data)
  const totalExistenciaActual = data.reduce((sum, item) => sum + item.cantidad_actual, 0)
  const totalEntrantes = data.reduce((sum, item) => sum + item.entrada, 0)
  const totalSalientes = data.reduce((sum, item) => sum + item.salida, 0)
  const totalEstimada = data.reduce((sum, item) => sum +  (item.cantidad_actual - item.salida + item.entrada), 0)

  const estadistica = [
    {
      titulo: "Existencia actual",
      value: totalExistenciaActual,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      titulo: "Entrantes",
      value: totalEntrantes,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      titulo: "Salientes",
      value: totalSalientes,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      titulo: "Existencia estimada",
      value: totalEstimada,
      icon: ChartArea,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
