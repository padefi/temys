import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { DetalleCancelacion } from "@/types/Inventario/Operaciones/Entregas/Entregas"; 

interface DetallesProductosTablaProps{
    cancelacion?:DetalleCancelacion
}
export function DetalleCancelado({cancelacion}:DetallesProductosTablaProps){
     if (!cancelacion) {
    return (
      <div className="text-sm text-gray-500 italic p-2">
        No hay productos registrados para esta entrega.
      </div>
    );
  }
 return (
    <div className="p-2 border rounded-md bg-muted/30">
      <Table className="text-sm">
        <TableHeader className=" bg-red-100">
          <TableRow >
            <TableHead className="text-center">Motivo</TableHead>
            <TableHead className="text-center">Fecha</TableHead>
            <TableHead className="text-center">Usuario</TableHead>
          </TableRow>            
        </TableHeader>

        <TableBody>        
            <TableRow >         
              <TableCell className="text-center">{cancelacion.motivo}</TableCell>
              <TableCell className="text-center">{cancelacion.fecha}</TableCell>         
              <TableCell>{cancelacion.usuario}</TableCell>
            </TableRow>
        
        </TableBody>
      </Table>
    </div>
  );

}