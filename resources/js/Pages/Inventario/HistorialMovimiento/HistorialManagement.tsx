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


type MovimientoProps = InertiaPageProps & {
    movimientoStocks: { data: MovimientosItem[], links: links, meta: meta },
};

export default function HistorialManagement() {
    const { props } = usePage<MovimientoProps>();
    const { movimientoStocks } = usePage<MovimientoProps>().props
    const [data, setData] = useState<MovimientosItem[]>(movimientoStocks.data)
    const [chips, setChips] = useState<Chip[]>([])
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
                <div className="flex justify-between">
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

                    <ChipSearch onChange={setChips} />
                    <span></span>
                </div>
                {/*  <Card>
                    <CardContent>

                    </CardContent>
                </Card> */}

                <Card>
                    <CardContent>
                        <HistorialMovimientosTable
                            movimientoStocks={filteredData}
                            links={movimientoStocks.links}
                            meta={movimientoStocks.meta}
                            editingIndex={editingIndex}
                            setEditingIndex={setEditingIndex}>
                        </HistorialMovimientosTable>
                    </CardContent>
                </Card>
            </div>




        </AuthenticatedLayout>
    );
}


