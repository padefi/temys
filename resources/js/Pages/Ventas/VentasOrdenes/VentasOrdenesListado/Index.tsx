import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/Components/ui/context-menu';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { OrdenesVentaDetalle } from '@/types/OrdenVentaDetalle';
import { CotizacionOrdenVenta } from '@/types/CotizacionOrdenVenta';


type OrdenVenta = {
    id: number;
    almacen_destino?: {
        nombre: string;
        id: number; // ⚠️ Asegurate que exista un ID único del almaceb
    };
    cliente?: {
        nombre: string;
        apellido: string;
        id: number; // ⚠️ Asegurate que exista un ID único del cliente
    };
    detalles?: OrdenesVentaDetalle[]
    ordenes_cotizacion?: CotizacionOrdenVenta[]
    fecha_creacion: Date;
    estado: string;
}


type PageProps = {
  ordenesVentasListado: OrdenVenta[];
};

type CotizacionOrdenesListadoProps = {
  onSelectionChange: (ids: number[]) => void;
};

export default function VentasOrdenesListado({ onSelectionChange }: CotizacionOrdenesListadoProps) {

    const { props: { ordenesVentasListado } } = usePage<PageProps & { auth: any }>();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
    const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
    const [selectedClienteNombre, setSelectedClienteNombre] = useState<string | null>(null);
    const toggleExpand = (id: number) => {
        setExpanded(expanded === id ? null : id);
    };

    ///////////Handle de Agregar Orden de Cotizacion
    const handleAgregarOrden = (solicitud_id: number) => {
        router.visit(`/ventas/cotizaciones-ordenes/${solicitud_id}`);
    }

    const handleAceptarSolicitud = (solicitud_id: number) => {

        router.post(`/ventas/cotizaciones-ordenes/aceptar-solicitud/${solicitud_id}`, {}, {
        onSuccess: () => {

            toast("Solicitud", {
                description: `La solicitud ${solicitud_id} fue aceptada.`,
                action: {
                    label: "Cerrar",
                    onClick: () => console.log("Undo"),
                }
            })

        },
        onError: (error) => {
            toast.error(error.message);
        }
        })
    }

    const handleRechazarSolicitud = (solicitud_id: number) => {
        router.post(`/ventas/cotizaciones-ordenes/rechazar-solicitud/${solicitud_id}`, {}, {
        onSuccess: () => {

            toast("Solicitud", {
                description: `La solicitud ${solicitud_id} fue rechazada.`,
                action: {
                    label: "Cerrar",
                    onClick: () => console.log("Undo"),
                }
            })

        },
        onError: (error) => {
            toast.error(error.message);
        }
        })
    }

    const toggleSelectOrder = (orden: OrdenVenta) => {
    const clienteId = orden.cliente?.id;
    const clienteNombre = orden.cliente?.nombre + ' ' + orden.cliente?.apellido;

        if (!clienteId) {
        toast.error("Esta orden no tiene cliente asignado.");
        return;
        }

        if (selectedOrderIds.includes(orden.id)) {
        const updated = selectedOrderIds.filter(id => id !== orden.id);
        if (updated.length === 0) {
            setSelectedClienteId(null);
            setSelectedClienteNombre(null); // 👈 limpia también el nombre
        }
        setSelectedOrderIds(updated);
        onSelectionChange(updated);
        } else {
        if (selectedClienteId === null) {
            setSelectedClienteId(clienteId);
            setSelectedClienteNombre(clienteNombre || null); // 👈 guarda el nombre
        }

        if (selectedClienteId !== null && selectedClienteId !== clienteId) {
            toast.error("Solo puedes seleccionar órdenes del mismo cliente.");
            return;
        }

      const updated = [...selectedOrderIds, orden.id];
      setSelectedOrderIds(updated);
      onSelectionChange(updated);
    }


  };

  return (
     <div className="space-y-4">
      {/* ✅ Bloque resumen arriba */}
      {selectedOrderIds.length > 0 && (
        <div className="p-4 bg-gray-100 border rounded">
          <p className="font-semibold">Órdenes seleccionadas: {selectedOrderIds.join(', ')}</p>
          <p className="text-sm text-gray-600">
            Cliente: {selectedClienteNombre}
          </p>
        </div>
      )}

    <Table>
      <TableCaption>Lista de Ordenes de Venta</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">N° Orden</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Solicitud de Venta</TableHead>
          <TableHead>Almacen Destino</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {ordenesVentasListado.map((orden) => (
          <>
            <TableRow
              key={orden.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => {
                if (orden.detalles?.length) {
                  toggleExpand(orden.id);
                }
              }}
            >
              <TableCell>
                <ContextMenu>
                            <ContextMenuTrigger className="w-full p-2 border rounded text-center">
                                OC{orden.id}
                            </ContextMenuTrigger>

                                <ContextMenuContent>
                                    {orden.estado === 'Pendiente' ? (
                                    <ContextMenuItem onClick={() => handleAceptarSolicitud(orden.id)}>
                                        Aceptar Solicitud
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Aceptar Solicitud
                                    </ContextMenuItem>
                                    )}
                                    {orden.estado === 'Aceptada' ? (
                                    <ContextMenuItem onClick={() => handleRechazarSolicitud(orden.id)}>
                                        Rechazar Solicitud
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Rechazar Solicitud
                                    </ContextMenuItem>
                                    )}
                                    <ContextMenuSeparator />
                                    {(orden.estado === 'Pendiente' || orden.estado === 'Aceptada') ? (
                                    <ContextMenuItem onClick={() => handleAgregarOrden(orden.id)}>
                                        Agregar Orden
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Agregar Orden
                                    </ContextMenuItem>
                                    )}
                                    <ContextMenuSeparator />
                                    {(orden.detalles?.length ?? 0) > 0 ? (
                                    <ContextMenuItem >
                                        {expanded === orden.id ? 'Cerrar' : 'Ver Órdenes'}
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Ver Órdenes
                                    </ContextMenuItem>
                                    )}
                                </ContextMenuContent>
                        </ContextMenu>
                </TableCell>
                <TableCell>{orden.cliente?.nombre }</TableCell>
                <TableCell>{orden.ordenes_cotizacion?.[0]?.solicitud_venta?.[0] ? `${orden.ordenes_cotizacion?.[0]?.solicitud_venta?.[0]?.origen?.descripcion} - ${orden.ordenes_cotizacion?.[0]?.solicitud_venta?.[0]?.descripcion} - N° ${orden.ordenes_cotizacion?.[0]?.solicitud_venta?.[0]?.id}` : ''}</TableCell>
                <TableCell>{orden.almacen_destino?.nombre}</TableCell>
                <TableCell className={
                        orden.estado === 'Confirmada'
                            ? 'text-green-600'
                            : orden.estado === 'Pendiente'
                            ? 'text-yellow-600'
                            : orden.estado === 'Cancelada'
                            ? 'text-red-600'
                            : orden.estado === 'Finalizada'
                            ? 'text-blue-600'
                            : ''
                        }>{orden.estado}

                </TableCell>
                <TableCell>
                    {new Date(orden.fecha_creacion).toLocaleDateString('es-AR')}
                </TableCell>

                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    router.visit(`/ventas/ordenes-ventas/${orden.id}`);
                                    }}
                                >
                                    Ver Orden de Venta
                                </Button>
                            </TableCell>
            </TableRow>

            {expanded === orden.id && (
              <TableRow className="bg-gray-50">
                <TableCell colSpan={6}>
                  <Table className="w-full border border-gray-200 rounded-md mt-2">
                    <TableHeader>
                        <TableRow>
                            <TableHead># Producto</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Descripción</TableHead>

                            <TableHead>Cantidad</TableHead>

                            <TableHead>Importe</TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>
                      {orden.detalles?.length ? (
                        orden.detalles.map((detalle) => (

                          <TableRow key={detalle.id}>

                            <TableCell>{detalle.id}</TableCell>
                            <TableCell>{detalle.producto?.nombre}</TableCell>
                            <TableCell>{detalle.descripcion}</TableCell>
                            <TableCell>{detalle.cantidad}</TableCell>
                            <TableCell>{detalle.importe}</TableCell>

                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No hay órdenes de Venta.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}




