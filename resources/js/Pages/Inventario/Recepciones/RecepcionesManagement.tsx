import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent } from "@/Components/ui/card";
import RecepcionesTable from "./RecepcionesTable";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { useEffect, useMemo, useState } from "react";
import { getColumns } from "./Columns";
import RecepcionProductos from "./modals/ConteoModal";
import { TrackingModal } from "../Modales/SeguimientoModal";

export interface RecepcionDetalle {
  id: number;
  producto_id: number;
  nombreProducto: string;
  cantidadRecibida: number;
  cantidadEsperada: number;
  estado: string;
}

export interface RecepcionesItem {
  id: string;
  origen_id: number;
  destino_id: number;
  tipo_recepcion: string;
  movimiento_id: number;
  fecha_recepcion: Date;
  estado: string;
  usuario_creacion: string;
  detalles?: RecepcionDetalle[];
}

type PageProps = InertiaPageProps & {
    recepcionProductos: ExistenciaPagination;
};

interface ExistenciaPagination {
    data: RecepcionesItem[];
    links: links;
    meta: meta;
}

export interface Seguimiento{
    movimiento_id:number,
    producto_id: number,
    origen_id: number,
    destino_id: number,
    cantidad: number,
    estado: string,
    ubicacion_actual: string,
    fecha_salida: Date,
    fecha_llegada: Date,
    observaciones: string,
    productoNombre: string,
    origenNombre: string,
    destinoNombre: string,

}

export default function RecepcionesManagement() {
    const { recepcionProductos } = usePage<PageProps>().props;
    const [data, setData] = useState<RecepcionesItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSeguimientoOpen, setisModalSeguimientoOpen] = useState(false);

   
    const [recepcionSeleccionada, setRecepcionSeleccionada] = useState<RecepcionesItem | null>(null);
    const [recepcionSeguimiento, setRecepcionSeguimiento] = useState<number | null>(null);
 

    useEffect(() => {
        setData(recepcionProductos.data);
    }, [recepcionProductos]);

    const abrirModal = (recepcion: RecepcionesItem) => {
     
        setRecepcionSeleccionada(recepcion);
        setIsModalOpen(true);
    };

        const abrirModalSeguimiento = (idSeguimiento: number) => {
               console.log('holaaaaaaaaaaa')
        setRecepcionSeguimiento(idSeguimiento);
        console.log(recepcionSeguimiento)
        setisModalSeguimientoOpen(true);
    };


    const handleAprobado = (id: any) => {    
        setIsModalOpen(false);
    };

    const handleRechazado = (id: any) => {  
        setIsModalOpen(false);
    };
    
    const columns = useMemo(
        () => getColumns({ onAbrirModal: abrirModal, abrirModalSeguimiento:abrirModalSeguimiento }),
        []
    );


    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Recepciones</h2>}
        >
            <Head title="Gestión de Recepciones" />
            <div className="mx-auto w-full p-6 space-y-12">
                <Card>
                    <CardContent>
                        <RecepcionesTable
                            data={data} 
                            links={recepcionProductos.links}
                            meta={recepcionProductos.meta}
                            columns={columns}
                            getRowCanExpand={() => true} // Todas las filas pueden expandirse
                        />
                    </CardContent>
                </Card>
            </div>

             <RecepcionProductos
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={recepcionSeleccionada}  
                onAprobado={handleAprobado} 
                onRechazado={handleRechazado}
            />
     

            
      <TrackingModal
        open={isModalSeguimientoOpen}
        onOpenChange={()=>setisModalSeguimientoOpen(false)}
        idSeguimiento={recepcionSeguimiento}
      /*  stockTransito={selectedMovimiento}
       historialEstados={selectedMovimiento ? historialEstadosData[selectedMovimiento.movimiento_id] || [] : []}
        productoNombre={selectedMovimiento?.productoNombre}
        origenNombre={selectedMovimiento?.origenNombre}
        destinoNombre={selectedMovimiento?.destinoNombre} */
      />
        </AuthenticatedLayout>
    );
}