import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { getColumns } from "./Columns";
import EntregasTable from "./EntregasTable";
import { Card, CardContent } from "@/Components/ui/card";

interface DetalleProducto {
    nombre: string;
    cantidad: number;
    fecha_creacion: string;
    usuario_creacion: string;
}
interface Cancelacion {
    motivo: string;
    fecha: string;
    usuario: string;
}
export interface EntregaItem {
    id: number;
    fecha_envio: string | null;
    fecha_creacion: string | null;
    usuario_creacion: string;
    estado: string;
    origen: string;
    destino: string;
    productos: DetalleProducto[];
    cancelacion?: Cancelacion;
}



type PageProps = InertiaPageProps & {
    ordenEntregas: EntregasPagination;
};

interface EntregasPagination {
    data: EntregaItem[];
    links: links;
    meta: meta;
}


export default function EntregasManagement() {
    const { ordenEntregas } = usePage<PageProps>().props
    const [data, setData] = useState<EntregaItem[]>([]);
/* ---------------------------------------------------- */
  const [entregaSeleccionada, setEntregaSeleccionada] = useState<EntregaItem | null>(null);
       const [remitoActual, setRemitoActual] = useState<EntregaItem | null>(null);
       const [modalGenerarRemito, setModalGenerarRemito] = useState(false);
       const [motivo, setMotivo] = useState("");
       const [modalOpen, setModalOpen] = useState(false);
        const [modalRemitoAbierto, setModalRemitoAbierto] = useState(false);
const [mostrarMotivo, setMostrarMotivo] = useState<{ [key: number]: boolean }>({});


    useEffect(() => {
        setData(ordenEntregas.data)
    }, [ordenEntregas])

    console.log(ordenEntregas)
    
    const abrirPrevisualizacionRemito = (entrega: EntregaItem) => {
        setEntregaSeleccionada(entrega);
        setModalGenerarRemito(true);
    };

        const openCancelarModal = (entrega: EntregaItem) => {
        setEntregaSeleccionada(entrega);
        setMotivo('');
        setModalOpen(true);
    };

  const toggleMostrarMotivo = (id: number) => {
        setMostrarMotivo(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const columns = useMemo(
        () => getColumns({
            abrirRemito:abrirPrevisualizacionRemito,
            toggleMostrarMotivo:toggleMostrarMotivo,
            cancelarModal:openCancelarModal,
            mostrarMotivo:mostrarMotivo,
            setRemitoActual:setRemitoActual
        }),
        []
    )


    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Ordenes de entregas</h2>}
        >
            <Head title="Ordenes de entrega" />


            <div className="mx-auto w-full p-6 space-y-12">
                <Card>
                    <CardContent>
                        <EntregasTable data={data} columns={columns}  getRowCanExpand={() => true}></EntregasTable>

                    </CardContent>
                </Card>
            </div>


        </AuthenticatedLayout>
    )

}