import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { RecepcionDetalle } from "./RecepcionesManagement";
import { Separator } from "@radix-ui/react-select";

interface DetallesSubtablaProps {
  detalles?: RecepcionDetalle[];
}

export function DetallesSubtabla({ detalles }: DetallesSubtablaProps) {
  if (!detalles || detalles.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-2">
        No hay detalles registrados para esta recepción.
      </div>
    );
  }

  return (
    <div className="p-2 border rounded-md bg-muted/30">
      <Table className="text-sm">
        <TableHeader className="bg-green-50">
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Cant. Esperada</TableHead>
            <TableHead className="text-center">Cant. Recibida</TableHead>
            <TableHead className="text-center">Estado</TableHead>
          </TableRow>
             
        </TableHeader>

        <TableBody>
          {detalles.map((detalle) => (
            <TableRow key={detalle.id}>
          
              <TableCell className="text-center">{detalle.nombreProducto}</TableCell>
              <TableCell className="text-center">{detalle.cantidadEsperada}</TableCell>
              <TableCell className="text-center">{detalle.cantidadRecibida}</TableCell>
              <TableCell
                className={`text-center font-medium ${
                  detalle.estado === "Completado"
                    ? "text-green-600"
                    : detalle.estado === "Pendiente"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {detalle.estado}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
