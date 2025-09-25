import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { ExistenciasEstadistica } from "./ExistenciasEstadistica";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { Download, FileText, Sheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ExistenciasItem } from "@/types/Inventario";
import ExistenciasTable from "./ExistenciasTable";

type PageProps = InertiaPageProps & {
    existenciaStocks:ExistenciaPagination,
};

interface ExistenciaPagination {
  data: ExistenciasItem[];
  links: links;
  meta: meta;
}

export default function ExistenciaManagement() {
    const { existenciaStocks:{data:existencias , links , meta} } = usePage<PageProps>().props;
    const [existenciaData, setExistenciaData] = useState<ExistenciasItem[]>(existencias);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect(() => {
        if(existenciaData != existencias) setExistenciaData(existencias)
    }, [existencias]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Existencias</h2>}
        >
            <Head title="Existencias" />

            <div className="mx-auto w-full p-6 space-y-12">
                <div className="grid grid-cols-2 gap-2">
                    <span className="text-xl font-light">Existencias</span>
                    <div className="flex gap-2">
                        {selected!.length >= 1 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Download className="text-slate-900" />
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
                        <ExistenciasEstadistica data={existenciaData}></ExistenciasEstadistica>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <Badge variant="secondary" className="px-3 py-1">
                                {existenciaData.length} productos
                            </Badge>
                        </div>
                        <ExistenciasTable                        
                            data={existenciaData}
                            links={links}
                            meta={meta}
                            selected={selected}
                            setSelected={setSelected}
                            ></ExistenciasTable>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
