import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "../Existencias/Search";
import HistorialMovimientosTable from "./HistorialMovimientosTable";
import { MovimientosItem } from "../../../types/Inventario";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { Button } from "@/Components/ui/button";
import { Download, FileText, Settings2, Sheet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { DropdownMenuItemIndicator } from "@radix-ui/react-dropdown-menu";



type MovimientoProps = InertiaPageProps & {
    movimientoStocks: { data: MovimientosItem[], links: links, meta: meta },
};

export default function HistorialManagement() {
    const { props } = usePage<MovimientoProps>();
    const { movimientoStocks } = usePage<MovimientoProps>().props
    const [data, setData] = useState<MovimientosItem[]>(movimientoStocks.data)
    const [chips, setChips] = useState<Chip[]>([])
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isMultiSelected, setIsMultiSelected] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const nombreProducto = props.nombreProducto;

    const SetNombreProd = () => {
        if (nombreProducto) {
            const data: Chip = {
                value: nombreProducto as string,
            }
            setChips([data]);
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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Existencias</h2>}
        >
            <Head title="Historial movimientos" />

            <div className="mx-auto w-full p-6 space-y-12">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        {chips.length > 0 ? (
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
                        <ChipSearch onChange={setChips} />
                        {isMultiSelected && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="size-8 cursor-pointer"><Settings2 className="text-slate-900" />  </DropdownMenuTrigger>
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
                            movimientoStocks={filteredData}
                            links={movimientoStocks.links}
                            meta={movimientoStocks.meta}
                            editingIndex={editingIndex}
                            setEditingIndex={setEditingIndex}
                            onMultiSelectChange={setIsMultiSelected}>
                        </HistorialMovimientosTable>
                    </CardContent>
                </Card>
            </div>




        </AuthenticatedLayout>
    );
}


