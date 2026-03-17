import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { Receipt } from "lucide-react"
import { useImpuestosSelection } from "../../hooks/useImpuestoSelection" 
import { impuestosData } from "../../data/mockData"
import { ImpuestoRow } from "../components/ImpuestoRow"

export function ImpuestosTab() {
  const { selectedImpuestos, toggleImpuesto, totalSeleccionado, cantidadSeleccionados } = useImpuestosSelection()

  return (
    <div className="bg-background rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {/* <TableHead className="w-12"></TableHead> */}
            <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">Impuesto</TableHead>
            <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">Periodo</TableHead>
            <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">Vencimiento</TableHead>
            <TableHead className="text-xs text-muted-foreground uppercase tracking-wide text-right">Monto</TableHead>
            <TableHead className="text-xs text-muted-foreground uppercase tracking-wide text-right">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {impuestosData.map((impuesto) => (
            <ImpuestoRow
              key={impuesto.id}
              impuesto={impuesto}
              isSelected={selectedImpuestos.includes(impuesto.id)}
              onToggle={toggleImpuesto}
            />
          ))}
        </TableBody>
      </Table>

{/*       <div className="flex items-center justify-between p-4 bg-muted/50 rounded-b-lg border-t">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Seleccionado</p>
            <p className="text-2xl font-bold">$ {totalSeleccionado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Items a Pagar</p>
            <p className="text-lg font-semibold">{cantidadSeleccionados} comprobantes</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="link" className="text-muted-foreground">
            Descargar Detalle
          </Button>
          <Button 
            style={{ backgroundColor: "#10b981", color: "white" }}
            disabled={cantidadSeleccionados === 0}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Pagar Seleccionados
          </Button>
        </div>
      </div> */}
    </div>
  )
}
