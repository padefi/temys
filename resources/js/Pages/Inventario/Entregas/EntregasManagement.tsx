import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { getColumns } from "./Columns";
import EntregasTable from "./EntregasTable";
import { Card, CardContent } from "@/Components/ui/card";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import CancelarEntrega from "./modals/ModalCancelar";
import AceptarEntrega from "./modals/ModalAceptar";
import MostrarRemito from "./modals/ModalAbrirRemito";

export interface DetalleProducto {
    id: string;
    nombre: string;
    cantidad: number;
    fecha_creacion: string;
    usuarioCreacion: string;
}

export interface DetalleCancelacion {
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
    cancelacion: DetalleCancelacion;
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
    const { ordenEntregas } = usePage<PageProps>().props;
    const [data, setData] = useState<EntregaItem[]>([]);

    // Estados para las expansiones
    const [expandedProductos, setExpandedProductos] = useState<{ [key: number]: boolean }>({});
    const [expandedMotivos, setExpandedMotivos] = useState<{ [key: number]: boolean }>({});

    // Estados para los modales
    const [entregaSeleccionada, setEntregaSeleccionada] = useState<EntregaItem | null>(null);
    const [remitoActual, setRemitoActual] = useState<EntregaItem | null>(null);
    const [modalGenerarRemito, setModalGenerarRemito] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalRemitoAbierto, setModalRemitoAbierto] = useState(false);

    useEffect(() => {
        setData(ordenEntregas.data);
    }, [ordenEntregas]);

    console.log(ordenEntregas);

    // Funciones para manejar las expansiones
    const toggleExpandProductos = (id: number) => {
        setExpandedProductos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleExpandMotivo = (id: number) => {
        setExpandedMotivos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Funciones para los modales
    const abrirPrevisualizacionRemito = (entrega: EntregaItem) => {
        setEntregaSeleccionada(entrega);
        setModalGenerarRemito(true);
    };

    const abrirModalRemito = (entrega: EntregaItem) => {
        setRemitoActual(entrega);
        setModalRemitoAbierto(true);
    };

    const openCancelarModal = (entrega: EntregaItem) => {
        console.log('hola');
        setEntregaSeleccionada(entrega);
        setMotivo('');
        setModalOpen(true);
    };

    const columns = useMemo(
        () => getColumns({
            abrirRemito: abrirPrevisualizacionRemito,
            mostrarRemito: abrirModalRemito,
            toggleExpandProductos: toggleExpandProductos,
            toggleExpandMotivo: toggleExpandMotivo,
            cancelarModal: openCancelarModal,
            expandedProductos: expandedProductos,
            expandedMotivos: expandedMotivos,
        }),
        [expandedProductos, expandedMotivos]
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Ordenes de entregas
                </h2>
            }
        >
            <Head title="Ordenes de entrega" />

            <div className="mx-auto w-full p-6 space-y-12">
                <Card>
                    <CardContent>
                        <EntregasTable
                            data={data}
                            columns={columns}
                            expandedProductos={expandedProductos}
                            expandedMotivos={expandedMotivos}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modal para cancelar entrega */}
            <CancelarEntrega
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                request={entregaSeleccionada}
                setMotivo={setMotivo}
                motivo={motivo}
            />

            {/* Modal para confirmar envío y generar remito */}
            <AceptarEntrega
                isOpen={modalGenerarRemito}
                onClose={() => setModalGenerarRemito(false)}
                request={entregaSeleccionada}
                setRemitoActual={setRemitoActual}
            />

            {/* Modal para mostrar remito existente */}
            <MostrarRemito   
                isOpen={modalRemitoAbierto}
                onClose={() => setModalRemitoAbierto(false)}
                remitoActual={remitoActual}
            />
        </AuthenticatedLayout>
    );
}