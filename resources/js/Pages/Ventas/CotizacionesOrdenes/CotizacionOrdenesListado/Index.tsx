import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Checkbox } from "@/Components/ui/checkbox";

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


type OrdenVenta = {
  id: number;
  estado: string;
  almacen_destino: number;
}


type OrdenCotizacion = {
  id: number;
  estado: string;
  ordenes_venta?: OrdenVenta[]
  cliente?: {
    nombre: string;
    id: number; // ⚠️ Asegurate que exista un ID único del cliente
  };
  tipo_moneda?: {
    descripcion: string;
    simbolo: string;
  };
};


export interface Origenes {
  id: number;
  descripcion: string;
}

type SolicitudVenta = {
  id: number;
  origen?: Origenes;
  descripcion: string;
  estado: string;
  created_at: string;
  updated_at: string;
  ordenes_cotizacion?: OrdenCotizacion[];
};

type PageProps = {
  solicitudesVentasListado: SolicitudVenta[];
};

type CotizacionOrdenesListadoProps = {
  onSelectionChange: (ids: number[]) => void;
};

export default function CotizacionOrdenesListado({ onSelectionChange }: CotizacionOrdenesListadoProps) {

    const { props: { solicitudesVentasListado } } = usePage<PageProps & { auth: any }>();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
    const [selectedProveedorId, setSelectedProveedorId] = useState<number | null>(null);
    const [selectedProveedorNombre, setSelectedProveedorNombre] = useState<string | null>(null);
console.log(solicitudesVentasListado)
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

    const toggleSelectOrder = (orden: OrdenCotizacion) => {
    const clienteId = orden.cliente?.id;
    const clienteNombre = orden.cliente?.nombre;

        if (!clienteId) {
        toast.error("Esta orden no tiene cliente asignado.");
        return;
        }

        if (selectedOrderIds.includes(orden.id)) {
        const updated = selectedOrderIds.filter(id => id !== orden.id);
        if (updated.length === 0) {
            setSelectedProveedorId(null);
            setSelectedProveedorNombre(null); // 👈 limpia también el nombre
        }
        setSelectedOrderIds(updated);
        onSelectionChange(updated);
        } else {
        if (selectedProveedorId === null) {
            setSelectedProveedorId(clienteId);
            setSelectedProveedorNombre(clienteNombre || null); // 👈 guarda el nombre
        }

        if (selectedProveedorId !== null && selectedProveedorId !== clienteId) {
            toast.error("Solo puedes seleccionar órdenes del mismo cliente.");
            return;
        }

      const updated = [...selectedOrderIds, orden.id];
      setSelectedOrderIds(updated);
      onSelectionChange(updated);
    }


  };

   const handleFinalizarSolicitud = (solicitud_id: number) => {
        router.post(`/ventas/cotizaciones-ordenes/finalizar-solicitud/${solicitud_id}`, {}, {
        onSuccess: () => {

            toast("Solicitud", {
                description: `La solicitud ${solicitud_id} fue finalizada.`,
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

  return (
     <div className="space-y-4">
      {/* ✅ Bloque resumen arriba */}
      {selectedOrderIds.length > 0 && (
        <div className="p-4 bg-gray-100 border rounded">
          <p className="font-semibold">Órdenes seleccionadas: {selectedOrderIds.join(', ')}</p>
          <p className="text-sm text-gray-600">
            Proveedor: {selectedProveedorNombre}
          </p>
        </div>
      )}

    <Table>
      <TableCaption>Lista de Solicitudes de Venta</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">N° Solicitud</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {solicitudesVentasListado.map((solicitud) => (
          <>
            <TableRow
              key={solicitud.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => {
                if (solicitud.ordenes_cotizacion?.length) {
                  toggleExpand(solicitud.id);
                }
              }}
            >
              <TableCell>
                <ContextMenu>
                            <ContextMenuTrigger className="w-full p-2 border rounded text-center">
                                S{solicitud.id}
                            </ContextMenuTrigger>

                                <ContextMenuContent>
                                    {solicitud.estado === 'Pendiente' ? (
                                    <ContextMenuItem onClick={() => handleAceptarSolicitud(solicitud.id)}>
                                        Aceptar Solicitud
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Aceptar Solicitud
                                    </ContextMenuItem>
                                    )}
                                    {solicitud.estado === 'Aceptada' || solicitud.estado === 'Pendiente' ? (
                                    <ContextMenuItem onClick={() => handleRechazarSolicitud(solicitud.id)}>
                                        Rechazar Solicitud
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Rechazar Solicitud
                                    </ContextMenuItem>
                                    )}
                                    {(solicitud.estado === 'Aceptada') && (
                                     <ContextMenuItem onClick={() => handleFinalizarSolicitud(solicitud.id)}>
                                        Finalizar Orden
                                    </ContextMenuItem>
                                    )}
                                    <ContextMenuSeparator />
                                    {(solicitud.estado === 'Aceptada') ? (

                                    <ContextMenuItem onClick={() => handleAgregarOrden(solicitud.id)}>
                                        Agregar Orden
                                    </ContextMenuItem>

                                    ):(
                                    <ContextMenuItem disabled>
                                        Agregar Orden
                                    </ContextMenuItem>
                                    )}
                                    <ContextMenuSeparator />
                                    {(solicitud.ordenes_cotizacion?.length ?? 0) > 0 ? (
                                    <ContextMenuItem >
                                        {expanded === solicitud.id ? 'Cerrar' : 'Ver Órdenes'}
                                    </ContextMenuItem>
                                    ):(
                                    <ContextMenuItem disabled>
                                        Ver Órdenes
                                    </ContextMenuItem>
                                    )}
                                </ContextMenuContent>
                        </ContextMenu>
              </TableCell>
              <TableCell>{solicitud.origen?.descripcion}</TableCell>
              <TableCell>{solicitud.descripcion}</TableCell>
              <TableCell className={
                        solicitud.estado === 'Aceptada'
                            ? 'text-green-600'
                            : solicitud.estado === 'Pendiente'
                            ? 'text-yellow-600'
                            : solicitud.estado === 'Rechazada'
                            ? 'text-red-600'
                            : ''
                        }>{solicitud.estado}
                    </TableCell>
              <TableCell>
                {new Date(solicitud.created_at).toLocaleDateString('es-AR')}
              </TableCell>
            </TableRow>

            {expanded === solicitud.id && (
              <TableRow className="bg-gray-50">
                <TableCell colSpan={5}>
                  <Table className="w-full border border-gray-200 rounded-md mt-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>✔️</TableHead>
                        <TableHead># Orden</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Moneda</TableHead>
                        <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {solicitud.ordenes_cotizacion?.length ? (
                        solicitud.ordenes_cotizacion.map((orden) => (

                          <TableRow key={orden.id}>
                            <TableCell>
                                {!orden.ordenes_venta?.[0]?.id && orden.estado === 'Confirmada' ? (
                              <Checkbox
                                checked={selectedOrderIds.includes(orden.id)}
                                onCheckedChange={() => toggleSelectOrder(orden)}
                              />
                            ):orden.ordenes_venta?.[0]?.id ? (
                                    <div
                                        className="text-red-600"
                                    >
                                        Orden de venta N° {orden.ordenes_venta?.[0]?.id} - {orden.ordenes_venta?.[0]?.estado}
                                    </div>
                            ):(
                                <div className="text-red-600"></div>
                            )}
                            </TableCell>
                            <TableCell>P{orden.id}</TableCell>
                            <TableCell>{orden.cliente?.nombre || 'Sin nombre'}</TableCell>
                            <TableCell>{orden.tipo_moneda?.simbolo || '-'}</TableCell>
                            <TableCell>{orden.estado}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    router.visit(`/ventas/cotizaciones-ordenes/${solicitud.id}/${orden.id}`);
                                    }}
                                >
                                    Ver Presupuesto
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No hay presupuestos.
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




