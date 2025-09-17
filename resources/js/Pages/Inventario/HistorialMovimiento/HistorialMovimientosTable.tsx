import { Checkbox } from "@/Components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { useState } from "react";
import { MovimientosItem } from "@/types/Inventario"; 
import { Button } from "@/Components/ui/button";


interface MovimientosProps {
    movimientoStocks: MovimientosItem[]
}

export default function HistorialMovimientosTable({ movimientoStocks }: MovimientosProps) {
    const [selected, setSelected] = useState<number[]>([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
     const totalPages = Math.ceil(movimientoStocks.length / itemsPerPage);

    const toggleRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );       
            
        if(selected.length === movimientoStocks.length - 1){
            setIsAllChecked(true);
            return;
        }
        setIsAllChecked(false);
    }

    const toggleAll = () => {
        if (isAllChecked) {
            setSelected([]); // desmarcar todos
        } else {
            setSelected(movimientoStocks.map((item: any) => item.id)); // marcar todos
        }
        setIsAllChecked(!isAllChecked);
    };

    return (
        <>
        <Table>
            <TableHeader className="sticky-header">
                <TableRow>
                    <TableHead className="text-center">  <Checkbox
                        checked={isAllChecked}
                        onCheckedChange={toggleAll}
                    />
                    </TableHead>
                    <TableHead className="text-center">Fecha</TableHead>
                    <TableHead className="text-center">Producto</TableHead>
                    <TableHead className="text-center">Tipo movimiento</TableHead>
                    <TableHead className="text-center">Origen</TableHead>
                    <TableHead className="text-center">Destino</TableHead>
                    <TableHead className="text-center">Hecho por</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="text-center">
                {movimientoStocks.map((item: any) => {
                    return (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Checkbox
                                checked={selected.includes(item.id)}
                                 onCheckedChange={() => toggleRow(item.id)} 
                                />
                            </TableCell>
                            <TableCell>{item.fecha}</TableCell>
                            <TableCell> {item.nombreProducto}</TableCell>
                            <TableCell>{item.tipo_movimiento}</TableCell>
                            <TableCell>{item.origen}</TableCell>
                            <TableCell>{item.destino}</TableCell>
                            <TableCell>{item.usuarioCreacion}</TableCell>
                            <TableCell>{item.cantidad}</TableCell>
                        </TableRow>)
                })}

            </TableBody>
        </Table>

  
        </>
    )
}