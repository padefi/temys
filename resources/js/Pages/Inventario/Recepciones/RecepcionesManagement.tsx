import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent } from "@/Components/ui/card";
import RecepcionesTable from "./RecepcionesTable";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { useEffect, useState } from "react";

export interface RecepcionesItem {
  id: number
  origen_id: number
  destino_id: number
  tipo_recepcion: string
  movimiento_id: number
  fecha_recepcion: Date
  estado: string
  usuario_creacion: string
}




type PageProps = InertiaPageProps & {
    recepcionProductos: ExistenciaPagination,
};

interface ExistenciaPagination {
    data: RecepcionesItem[];
    links: links;
    meta: meta;
}



export default function RecepcionesManagement() {
   const { recepcionProductos: { data: recepcion, links, meta } } = usePage<PageProps>().props;
     const { recepcionProductos } = usePage<PageProps>().props;
     const [data, setData] = useState<RecepcionesItem[]>([]);

  useEffect(() => {
    setData(recepcionProductos.data);
  }, [recepcionProductos]);

  console.log(data)


    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Existencias</h2>}
        >
            <Head title="Historial movimientos" />


            <div className="mx-auto w-full p-6 space-y-12">

            <Card>
                <CardContent>
                    
                    <RecepcionesTable    data={recepcion}
                            links={links}
                            meta={meta}></RecepcionesTable>
                </CardContent>
            </Card>


            </div>
        </AuthenticatedLayout>
    )
}