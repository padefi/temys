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
import { ComprobanteProveedor } from '@/types/ComprobanteProveedor';


type PageProps = {
  comprobantesProveedorListado: ComprobanteProveedor[];
};

type ComprobantesProveedoresListadoProps = {
  onSelectionChange: (ids: number[]) => void;
};

export default function ComprobantesProveedoresListado({ onSelectionChange }: ComprobantesProveedoresListadoProps) {

    const { props: { comprobantesProveedorListado } } = usePage<PageProps & { auth: any }>();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
    const [selectedProveedorId, setSelectedProveedorId] = useState<number | null>(null);
    const [selectedProveedorNombre, setSelectedProveedorNombre] = useState<string | null>(null);



    const toggleExpand = (id: number) => {
        setExpanded(expanded === id ? null : id);
    };

    ///////////Handle de Agregar Orden de Cotizacion
    /*const handleAgregarOrden = (solicitud_id: number) => {
        router.visit(`/compras/cotizaciones-ordenes/${solicitud_id}`);
    }*/

    /*const handleAceptarSolicitud = (solicitud_id: number) => {

        router.post(`/compras/cotizaciones-ordenes/aceptar-solicitud/${solicitud_id}`, {}, {
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
    }*/

    /*const handleRechazarSolicitud = (solicitud_id: number) => {
        router.post(`/compras/cotizaciones-ordenes/rechazar-solicitud/${solicitud_id}`, {}, {
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
    }*/

    const toggleSelectOrder = (comprobanteProveedor: ComprobanteProveedor) => {
        const proveedorId = comprobanteProveedor.proveedor_id;
        const proveedorNombre = comprobanteProveedor.proveedor?.razon_social + ' ' + comprobanteProveedor.proveedor?.nombre_fantasia;

            if (!proveedorId) {
            toast.error("Esta orden no tiene proveedor asignado.");
            return;
            }

            if (selectedOrderIds.includes(comprobanteProveedor.id)) {
            const updated = selectedOrderIds.filter(id => id !== comprobanteProveedor.id);
            if (updated.length === 0) {
                setSelectedProveedorId(null);
                setSelectedProveedorNombre(null); // 👈 limpia también el nombre
            }
            setSelectedOrderIds(updated);
            onSelectionChange(updated);
            } else {
            if (selectedProveedorId === null) {
                setSelectedProveedorId(proveedorId);
                setSelectedProveedorNombre(proveedorNombre || null); // 👈 guarda el nombre
            }

            if (selectedProveedorId !== null && selectedProveedorId !== proveedorId) {
                toast.error("Solo puedes seleccionar órdenes del mismo proveedor.");
                return;
            }

        const updated = [...selectedOrderIds, comprobanteProveedor.id];
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
            Proveedor: {selectedProveedorNombre}
          </p>
        </div>
      )}

    <Table>
      <TableCaption>Lista de Comprobantes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">N° Comprobante</TableHead>
          <TableHead>Tipo Comprobante</TableHead>
          <TableHead>N° Factura</TableHead>
          <TableHead>Proveedor</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {comprobantesProveedorListado.map((comprobanteProveedor) => (
          <>
            <TableRow
              key={comprobanteProveedor.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => {
                if (comprobanteProveedor.detalles?.length) {
                  toggleExpand(comprobanteProveedor.id);
                }
              }}
            >
              <TableCell>
                <ContextMenu>
                            <ContextMenuTrigger className="w-full p-2 border rounded text-center">
                                C{comprobanteProveedor.id}
                            </ContextMenuTrigger>

                                <ContextMenuContent>
                                    <ContextMenuItem onClick={() => {
                                        router.visit(`/compras/comprobantes-proveedores/${comprobanteProveedor.id}`);
                                    }}>
                                        Ver Comprobante
                                    </ContextMenuItem>
                                </ContextMenuContent>
                        </ContextMenu>
                </TableCell>
                <TableCell>{comprobanteProveedor.tipo_comprobante?.nombre}</TableCell>
                <TableCell>{comprobanteProveedor.punto_venta + '-' + comprobanteProveedor.numero_factura}</TableCell>
                <TableCell>{comprobanteProveedor.proveedor?.razon_social}</TableCell>
                <TableCell>{comprobanteProveedor.descripcion}</TableCell>
                <TableCell className={
                        comprobanteProveedor.estado === 'Confirmada'
                            ? 'text-green-600'
                            : comprobanteProveedor.estado === 'Pendiente'
                            ? 'text-yellow-600'
                            : comprobanteProveedor.estado === 'Cancelada'
                            ? 'text-red-600'
                            : comprobanteProveedor.estado === 'Finalizada'
                            ? 'text-blue-600'
                            : ''
                        }>{comprobanteProveedor.estado}



                </TableCell>
                <TableCell>
                    {new Date(comprobanteProveedor.fecha_factura).toLocaleDateString('es-AR')}
                </TableCell>

            </TableRow>

            {expanded === comprobanteProveedor.id && (
              <TableRow className="bg-gray-50">
                <TableCell colSpan={6}>
                  <Table className="w-full border border-gray-200 rounded-md mt-2">
                    <TableHeader>
                        <TableRow>
                            <TableHead># Producto</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Modelo</TableHead>
                            <TableHead>Cuenta Contable</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unitario</TableHead>
                            <TableHead>% Desc.</TableHead>
                            <TableHead>Importe</TableHead>

                        </TableRow>
                    </TableHeader>

                    <TableBody>
                      {comprobanteProveedor.detalles?.length ? (
                        comprobanteProveedor.detalles.map((detalle) => (

                          <TableRow key={detalle.id}>

                            <TableCell>{detalle.id}</TableCell>
                            <TableCell>{detalle.producto?.nombre}</TableCell>
                            <TableCell>{detalle.descripcion}</TableCell>
                            <TableCell>{detalle.modelo}</TableCell>
                            <TableCell>{detalle.cuenta_contable?.codigo + ' ' + detalle.cuenta_contable?.descripcion}</TableCell>
                            <TableCell>{detalle.cantidad}</TableCell>
                            <TableCell>{detalle.precio_unitario}</TableCell>
                            <TableCell>{detalle.porcentaje_descuento}</TableCell>
                            <TableCell>{detalle.importe}</TableCell>

                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No hay órdenes de Compra.
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




