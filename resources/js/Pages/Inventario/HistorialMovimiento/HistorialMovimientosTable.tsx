import { Checkbox } from "@/Components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { useEffect, useState } from "react";
import { MovimientosItem } from "@/types/Inventario";
import { Footer } from "@/Pages/UserModulePanel/footer";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";


interface MovimientosProps {
    movimientoStocks: MovimientosItem[],
    links: links,
    meta: meta;
    editingIndex: number | null;
    setEditingIndex: (val: number | null) => void;
    onMultiSelectChange?: (isMulti: boolean) => void;
}

export default function HistorialMovimientosTable({ movimientoStocks, links, meta, onMultiSelectChange }: MovimientosProps) {
    const { updateParams, isLoading } = useDataTableParams();
    const [selected, setSelected] = useState<number[]>([]);
    const [isAllChecked, setIsAllChecked] = useState(false);

    // Actualizar datos cuando cambien las props del backend
    const [tableData, setTableData] = useState<MovimientosItem[]>(movimientoStocks);

    useEffect(() => {
        setTableData(movimientoStocks);
        // Resetear selección al cambiar la página
        setSelected([]);
        setIsAllChecked(false);
    }, [movimientoStocks]);

    /* console.log(movimientoStocks) */

    /* const toggleRow = (id: number) => {
        setSelected((prev) => {
            const newSelected = prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id];

            onMultiSelectChange?.(newSelected.length >= 1);

            setIsAllChecked(newSelected.length === movimientoStocks.length);
            return newSelected;
        });
    }; */

    const toggleRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );

        if (selected.length === movimientoStocks.length - 1) {
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
                        <TableHead className="text-center">  <Checkbox checked={isAllChecked} onCheckedChange={toggleAll} /> </TableHead>
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
                    {isLoading ? (
                        <DataTableSkeleton columnCount={8} rowCount={5} showHeaders={false}></DataTableSkeleton>
                    ) : (
                        tableData.map((item: any) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell> <Checkbox checked={selected.includes(item.id)} onCheckedChange={() => toggleRow(item.id)} /> </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(item.fecha).toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(item.fecha).toLocaleTimeString("es-ES", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                timeZone: "UTC"
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell> {item.nombreProducto}</TableCell>
                                    <TableCell>{item.tipo_movimiento}</TableCell>
                                    <TableCell>{item.origen}</TableCell>
                                    <TableCell>{item.destino}</TableCell>
                                    <TableCell>{item.usuarioCreacion}</TableCell>
                                    <TableCell>{item.cantidad}</TableCell>
                                </TableRow>
                            )
                        }))
                    }
                </TableBody>
            </Table>

            <Footer
                links={links}
                meta={meta}
                updateParams={updateParams}
                isLoading={isLoading} />

        </>
    )
}