import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { DetalleProducto } from "@/types/Inventario/Operaciones/Entregas/Entregas"; 

interface DetallesProductosTablaProps{
    productos?:DetalleProducto[]
}
export function DetalleProductos({productos}:DetallesProductosTablaProps){
     if (!productos || productos.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic p-2">
        No hay productos registrados para esta entrega.
      </div>
    );
  }
 
 return (
    <div className="p-2 border rounded-md bg-muted/30">
      <Table className="text-sm">
        <TableHeader className="bg-emerald-50">
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
            <TableHead className="text-center">Fecha de creación</TableHead>
            <TableHead className="text-center">Usuario creación</TableHead>
          </TableRow>
            
        </TableHeader>

        <TableBody>
          {productos.map((producto) => (
            
            <TableRow  key={producto.id}>
              <TableCell className="text-center">{producto.nombre}</TableCell>
              <TableCell className="text-center">{producto.cantidad}</TableCell>
              <TableCell className="text-center">{producto.fecha_creacion}</TableCell>
              <TableCell>{producto.usuarioCreacion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

}