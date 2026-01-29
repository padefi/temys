import { TableCell, TableRow } from "@/Components/ui/table"
import { Checkbox } from "@/Components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Impuesto } from "@/types/Patrimonio/Inmuebles" 

interface ImpuestoRowProps {
  impuesto: Impuesto
  isSelected: boolean
  onToggle: (id: string) => void
}

function getEstadoBadge(estado: string) {
  switch (estado) {
    case "Pendiente":
      return <span className="font-medium text-sm" style={{ color: "#f59e0b" }}>Pendiente</span>
    case "Vencido":
      return <span className="font-medium text-sm" style={{ color: "#f97316" }}>Vencido</span>
    case "Pagado":
      return <span className="font-medium text-sm" style={{ color: "#10b981" }}>Pagado</span>
    default:
      return <span className="text-muted-foreground text-sm">{estado}</span>
  }
}

export function ImpuestoRow({ impuesto, isSelected, onToggle }: ImpuestoRowProps) {
  return (
    <TableRow 
      className="cursor-pointer"
      style={{
        backgroundColor: isSelected 
          ? "rgba(16, 185, 129, 0.08)" 
          : impuesto.estado === "Vencido" 
            ? "rgba(249, 115, 22, 0.08)" 
            : undefined
      }}
      onClick={() => onToggle(impuesto.id)}
    >
 {/*      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggle(impuesto.id)}
        />
      </TableCell> */}
      <TableCell className={cn(
        "font-medium",
        impuesto.estado === "Pagado" && "text-muted-foreground"
      )}>
        {impuesto.nombre}
      </TableCell>
      <TableCell>{impuesto.periodo}</TableCell>
      <TableCell 
        className={cn(impuesto.estado === "Vencido" && "font-medium")}
        style={{ color: impuesto.estado === "Vencido" ? "#f97316" : undefined }}
      >
        {impuesto.vencimiento}
      </TableCell>
      <TableCell className="text-right font-semibold">
        $ {impuesto.monto.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </TableCell>
      <TableCell className="text-right">
        {getEstadoBadge(impuesto.estado)}
      </TableCell>
    </TableRow>
  )
}