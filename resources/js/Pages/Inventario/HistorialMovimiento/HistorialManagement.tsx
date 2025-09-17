import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "../Existencias/Search";
import HistorialMovimientosTable from "./HistorialMovimientosTable";
import { MovimientosItem } from "../../../types/Inventario";


type MovimientoProps = InertiaPageProps & {
    movimientoStocks: { data: MovimientosItem[] };
};

export default function HistorialManagement() {
    const { props } = usePage<MovimientoProps>();
    const { movimientoStocks } = usePage<MovimientoProps>().props
    const [data, setData] = useState<MovimientosItem[]>(movimientoStocks.data)
    const [chips, setChips] = useState<Chip[]>([])
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
            <Card>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <ChipSearch initialChips={chips} onChange={setChips} />
                        <Badge variant="secondary" className="px-3 py-1">
                            {filteredData.length} productos
                        </Badge>
                    </div>
                    <HistorialMovimientosTable movimientoStocks={filteredData}></HistorialMovimientosTable>
                </CardContent>
            </Card>
        </AuthenticatedLayout>


    );
}


