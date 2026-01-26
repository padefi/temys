import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@inertiajs/core";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useMemo } from "react";
import { columns } from "./DataTable/Columns";
import DataTable from "./DataTable/Data-table";
import { Card, CardContent } from "@/Components/ui/card";
import { CirclePlus } from "lucide-react";
import { Inmueble } from "@/types/Patrimonio/Inmuebles";



interface Props extends PageProps {
    inmuebles: {
        data: Inmueble[]
        links: any
        meta: any
    }
}

export default function BuscarInmuebles({ inmuebles }: Props) {
    const memoizedColumns = useMemo(() => columns, [])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Inventario
                </h2>
            }
        >
            <div className="mx-auto w-full p-6 space-y-6">
                <div className="flex justify-between">
                    <h1>Consulta de inmuebles</h1>

                    <Link href={route("new.inmueble")}>
                        <Button variant="outline">
                            <CirclePlus className="h-4 w-4 mr-2" />
                            Nuevo Inmueble
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent>
                        <DataTable
                            columns={memoizedColumns}
                            data={inmuebles.data}   // 🔥 datos reales
                            links={inmuebles.links}
                            meta={inmuebles.meta}
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    )
}
