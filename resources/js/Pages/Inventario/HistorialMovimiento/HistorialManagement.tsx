import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "../Existencias/Search";
import HistorialMovimientosTable from "./HistorialMovimientosTable";
import { MovimientosItem } from "@/types/Inventario/Reportes/HistorialMovimiento"; 
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { FileDown, FileText, Sheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { columns } from "./Columns";



type MovimientoProps = InertiaPageProps & {
    movimientoStocks: { data: MovimientosItem[], links: links, meta: meta },
};

export default function HistorialManagement() {
    const { props } = usePage<MovimientoProps>();
    const { movimientoStocks } = usePage<MovimientoProps>().props
    const [data, setData] = useState<MovimientosItem[]>(movimientoStocks.data)
    const [chips, setChips] = useState<Chip[]>([])
    const [chipExterno, setChipExterno] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const nombreProducto = props.nombreProducto;

    const memoizedColumns = useMemo(() => columns, []);
    const SetNombreProd = () => {
        if (nombreProducto) {
            const data: Chip = {
                value: nombreProducto as string,
            }
            setChips([data]);
            setChipExterno(true);
        }
    }

    useEffect(() => {
        SetNombreProd();
    }, []);


    const filteredData = data.filter((item) => {
        if (chips.length === 0) return true;
        return chips.some((chip) =>
            item.nombreProducto?.toLowerCase().includes(chip.value.toLowerCase())
        );
    });

    useEffect(() => {
        setData(movimientoStocks.data)
    }, [movimientoStocks]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Existencias</h2>}
        >
            <Head title="Historial movimientos" />

            <div className="mx-auto w-full p-6 space-y-12 ">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        {chipExterno ? (
                            <>
                                <span className="text-xl text-teal-500 font-medium">Existencias</span>
                                <br />
                                <span className="text-s">Historial de movimientos</span>
                            </>
                        ) : (
                            <span className="text-xl font-light">Historial de movimientos</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <ChipSearch onChange={setChips} initialChips={chips} setExterno={setChipExterno} />
                        {selected.length >= 1 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="size-8 cursor-pointer">

                                    <FileDown className="text-slate-900" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Exportar en</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><FileText /> PDF</DropdownMenuItem>
                                    <DropdownMenuItem><Sheet /> EXCEL</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                    </div>
                </div>
                
                <Card>
                    <CardContent>
                        <HistorialMovimientosTable
                            columns={memoizedColumns}
                            data={filteredData}
                            links={movimientoStocks.links}
                            meta={movimientoStocks.meta}
                            editingIndex={editingIndex}
                            setEditingIndex={setEditingIndex}
                            selected={selected}
                            setSelected={setSelected}
                        >
                        </HistorialMovimientosTable>
                    </CardContent>
                </Card>
            </div>

        </AuthenticatedLayout>
    );
}


