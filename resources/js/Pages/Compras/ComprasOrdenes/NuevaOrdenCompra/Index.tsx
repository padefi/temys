import React, { useState, useMemo, useEffect } from 'react'
import { Subtitles, Terminal } from 'lucide-react'
import { Head, usePage, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import { Progress } from '@/Components/ui/progress'
import { Typography } from '@/Components/ui/typography'

import CargaProductos from './CargaProductos/Index'
import { Proveedor } from '@/types/Proveedor'
import { TipoMoneda } from '@/types/TipoMoneda'
import { Impuesto } from '@/types/Impuesto'
import { ProductosDisponibles } from '@/types/Producto'
import { Textarea } from "@/Components/ui/textarea"
import GenerarOrdenPagoModal from "./GenerarOrdenPagoModal"
import GenerarFacturaModal from "./GenerarFacturaModal"

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"


import { OrdenesCompra } from '@/types/OrdenCompra'
import { toast } from 'sonner'
import { Almacen } from '@/types/Almacen'
import { Archivo } from '@/types/Archivos'

type PageProps = InertiaPageProps & {
  auth: { user: { id: number; name: string; email: string } }
  proveedores: { data: Proveedor[] }
  tipoMonedas: TipoMoneda[]
  productos: ProductosDisponibles[]
  almacenDestino: Almacen[]
  impuestos: Impuesto[]
  ordenCompraElegida?: OrdenesCompra
  flash?: {
    success?: string;
    danger?: string;
  };
}


export default function Index() {

    const {
        proveedores: { data: proveedores },
        auth,
        tipoMonedas,
        almacenDestino,
        ordenCompraElegida,
        flash
    } = usePage<PageProps>().props

    // 🔵 mostrar flash messages del backend
    useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.danger) toast.error(flash.danger);
    }, [flash]);

    const ordenCompra = ordenCompraElegida;
    const [busqueda, setBusqueda] = useState( ordenCompra?.proveedor?.nombre_fantasia || '')
    const [mostrarLista, setMostrarLista] = useState(false)

    const [entrega_esperada, setEntregaEsperada] = useState(ordenCompra?.entrega_esperada ? new Date(ordenCompra?.entrega_esperada).toISOString().slice(0,10) : '')

    const [monedaId, setMonedaId] = useState<number | null>(ordenCompra?.tipo_moneda?.id || null);
    const [monedaNombre, setMonedaNombre] = useState(
    ordenCompra?.tipo_moneda
        ? `${ordenCompra.tipo_moneda.descripcion} - ${ordenCompra.tipo_moneda.simbolo}`
        : ''
    );
    const [monedaCodigo, setMonedaCodigo] = useState<string | null>(ordenCompra?.tipo_moneda?.codigo || null);
    const [monedaInvalida, setMonedaInvalida] = useState(false)

    const [almacenId, setAlmacenId] = useState<number | null>(ordenCompra?.almacen?.id || null);
    const [almacenNombre, setAlmacenNombre] = useState(
    ordenCompra?.almacen
        ? `${ordenCompra.almacen.nombre} - ${ordenCompra.almacen.tipo}`
        : ''
    );

    const [almacenInvalida, setAlmacenInvalida] = useState(false)

    const [observaciones, setObservaciones] = useState(ordenCompra?.observaciones || '')
    const [productos, setProductos] = useState<any[]>([])
    const [productosValidos, setProductosValidos] = useState(false)
    const [productosValidosFactura, setProductosValidosFactura] = useState(false)

    const [estadoOrden, setEstadoOrden] = useState(ordenCompra?.estado || '');

    ////archivos adjuntos
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<Archivo | null>(null);
    const [modalVisible, setModalVisible] = useState(false);


    const [modalPagoVisible, setModalPagoVisible] = useState(false)
    const [modalFacturaVisible, setModalFacturaVisible] = useState(false)

    const estaBloqueada = estadoOrden === "Confirmada" || estadoOrden === "Finalizada"

    // 🔹 Calcular total cada vez que cambien los productos
    const totalOrden = useMemo(() => {
        return productos.reduce((acc, p) => acc + (p.importe || 0), 0)
    }, [productos])

    const monedaSeleccionada = tipoMonedas.find(m => m.id === monedaId) || null;
    const [cotizacionMoneda, setCotizacionMoneda] = useState<number | null>(
    ordenCompra?.cotizacion_moneda || null
    );


    const [facturasSeleccionadas, setFacturasSeleccionadas] = useState<number[]>([])


    useEffect(() => {
    if (!ordenCompra) return;

    const archivosCotizacion: Archivo[] = (ordenCompra.ordenes_cotizacion ?? []).flatMap(oc =>
    (oc.archivos ?? []).map(a => ({
        id: a.id,
        nombre: a.nombre, // <--- corregido
        url: `/compras/cotizaciones-ordenes/archivo/${a.id}`,
        mime: a.mime,
        size: a.size,
        isCotizacion: true
    }))
    );

    const archivosOrdenCompra: Archivo[] = (ordenCompra.archivos ?? []).map(a => ({
    id: a.id,
    nombre: a.nombre, // <--- corregido
    url: `/compras/ordenes-compras/archivo/${a.id}`,
    mime: a.mime,
    size: a.size,
    isCotizacion: false
    }));

    setArchivos([...archivosCotizacion, ...archivosOrdenCompra]);
    }, [ordenCompra]);



    //////////Filtro de Proveedores
    const proveedoresFiltrados = useMemo(() =>
        busqueda.length >= 3
        ? proveedores.filter(p =>
            p.nombre_fantasia.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.razon_social.toLowerCase().includes(busqueda.toLowerCase())
            )
        : [], [busqueda, proveedores]
    )

    ////////////Muestra Mensaje de que el Proveedor no Existe
    const mostrarMensaje = busqueda.length >= 3 && proveedoresFiltrados.length === 0

    ///////////Handle de seleccion del proveedor
    const handleSeleccion = (nombre: string) => {
        setBusqueda(nombre)
        setMostrarLista(false)
    }

    ////////////Validacion de Moneda
    const validarMoneda = () => {
        const existe = tipoMonedas.some(
        a => `${a.descripcion} - ${a.simbolo}`.toLowerCase() === monedaNombre.toLowerCase()
        )
        setMonedaInvalida(!existe)
    }

    ////////////Validacion de Almacen
    const validarAlmacen = () => {
    const existe = almacenDestino.some(
        a => `${a.nombre} - ${a.tipo}`.toLowerCase() === almacenNombre.toLowerCase()
    )
    setAlmacenInvalida(!existe)
    }


    /////////////Validacion de Campos Obligatorios
    const formularioCompleto =
        busqueda.trim() !== '' &&
        monedaNombre.trim() !== '' &&
        !monedaInvalida &&
        almacenNombre.trim() !== '' &&
        !almacenInvalida &&
        entrega_esperada !== '' &&
        productosValidos &&
        (monedaCodigo === "ARS" || (cotizacionMoneda !== null && cotizacionMoneda > 0));



    const totalCampos = 4
    const completados = [
        busqueda.trim(),
        monedaNombre.trim() !== '' &&
        !monedaInvalida &&
        almacenNombre.trim() !== '' &&
        !almacenInvalida,
        entrega_esperada,
        productosValidos,
        //observaciones.trim()
    ].filter(Boolean).length


    const porcentaje = (completados / totalCampos) * 100

  ///////////Handle de Envio de Cotizacion
  const cancelaOrdenCompra = () => {
    if (!ordenCompra?.id) return;

    router.post(
        '/compras/ordenes-compras/cancelar',
        { ordenCompra: ordenCompra.id },
        {
        onSuccess: () => {
            setEstadoOrden('Cancelada'); // Actualizamos el estado localmente
            router.reload({ only: ["flash"] });
        },
        onError: (errors) => {
           router.reload({ only: ["flash"] });
        }
        }
    );
    };

    const generarOrdenPago = () => {

        console.log(ordenCompra)
      /*router.post('/compras/facturas/', {
        solicitudCompra: ordenCompra?,
        ordenCotizacion: ordenCotizacion?.[0]?.id,
        proveedor: busqueda,
        moneda: busquedaMoneda,
        entrega_esperada: entrega_esperada,
        entregar_a,
      })*/
    }


    /////////////Confirmar Orden Compra
    const confirmarOrdenCompra= () => {

    router.post('/compras/ordenes-compras/confirmar', {
      ordenCompra: ordenCompra?.id,

      proveedor: busqueda,
      moneda: monedaId,
      cotizacion_moneda: monedaCodigo !== "ARS" ? cotizacionMoneda : null,
      entrega_esperada: entrega_esperada,
      almacen: almacenId,
      observaciones,
      productos,
      usuario_id: auth.user.id,
        }, {
        onSuccess: () => {

            setEstadoOrden('Confirmada'); // Actualizamos el estado localmente
            router.reload({ only: ["flash"] });
        },
        onError: (errors) => {
          router.reload({ only: ["flash"] });
        }
    })

    }

    ///////////Guardar Orden Compra
    const guardar = () => {
      router.post('/compras/ordenes-compras/guardar', {
        ordenCompra: ordenCompra?.id,
        proveedor: busqueda,
        moneda: monedaId,
        cotizacion_moneda: monedaCodigo !== "ARS" ? cotizacionMoneda : null,
        entrega_esperada: entrega_esperada,
        almacen: almacenId,
        observaciones,
        productos,
        usuario_id: auth.user.id,
      }, {
        onSuccess: () => {
            router.reload({ only: ["flash"] });
        },
        onError: (errors) => {

            router.reload({ only: ["flash"] });
        }
      })
    }
     // 🚀 Subida de archivos
    const handleUploadFile = async (ordenId: number, archivo: File) => {
        const formData = new FormData()
        formData.append("archivo", archivo)

        router.post(`/compras/ordenes-compras/${ordenId}/archivo`, formData, {
        forceFormData: true,
        onSuccess: () => toast.success(`Archivo ${archivo.name} subido con éxito`),
        onError: () => toast.error(`Error al subir ${archivo.name}`),
        })
    }

    ////////////Manejo de archivos adjuntos
    const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !ordenCompra?.id) return;

    const nuevosArchivos: Archivo[] = Array.from(e.target.files).map(f => ({
        nombre: f.name,
        file: f,
        mime: f.type,
        size: f.size,
    }));

    setArchivos(prev => [...prev, ...nuevosArchivos]);

    nuevosArchivos.forEach(a => handleUploadFile(ordenCompra.id!, a.file!));
    }

    const abrirModal = (archivo: Archivo) => {
    setArchivoSeleccionado(archivo);
    setModalVisible(true);
    };

    const cerrarModal = () => {
    setArchivoSeleccionado(null);
    setModalVisible(false);
    };

    /*const eliminarArchivo = (index: number) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
    };*/


    const handleGenerarOrdenPago = (data: any) => {

    // 🚀 acá llamás a router.post() para crear la orden de pago
    }

    const handleGenerarFactura = (data: any) => {
        router.reload({ only: ['ordenCompraElegida', 'flash'] }) // 🔁 recarga parcial
    }

return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Nueva Orden de Compra</h2>}>
      <Head title="Nueva Orden de Compra"></Head>


    <div className="py-12">
        <Typography  className="text-2xl font-bold mb-4 text-center">
            Orden de Compra
        </Typography>
        <div className="mx-auto px-10">
        <Button
            variant="outline"
            size="lg"
            onClick={() => router.visit('/compras/ordenes-compras')}
        >
            Volver
        </Button>
         <Button
            variant="outline"
            size="lg"
            disabled={!formularioCompleto || ordenCompra?.estado === 'Cancelada' || ordenCompra?.estado === 'Finalizada' || estaBloqueada }
            onClick={() => guardar()}
        >
            Guardar
        </Button>

        <div className="items-end">
            <div className="flex flex-col items-end">
                {!ordenCompra?.id && (
                    <div>
                    Orden de Compra Nueva
                    </div>
                )}

                {ordenCompra?.created_at && (
                <div className="text-sm text-gray-500">
                    {new Date(ordenCompra?.created_at || '').toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        })
                    }
                </div>
                )}
               {estadoOrden && (
                <div>
                    Orden de Compra N° {ordenCompra?.id}
                    <br></br>
                    Estado : {estadoOrden}
                </div>
                )}
            </div>
        </div>
          <Progress value={porcentaje} className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Proveedor</Label>
              <Input
                value={busqueda}
                onChange={e => {
                  setBusqueda(e.target.value)
                  setMostrarLista(true)
                }}
                disabled={estaBloqueada}
                placeholder="Buscar o ingresar proveedor"
              />
              {mostrarMensaje && (
                <p className="text-sm text-gray-500 mt-1">Proveedor no encontrado. Ingresarlo como nuevo.</p>
              )}
              {mostrarLista && proveedoresFiltrados.length > 0 && (
                <ul className="border rounded p-2 bg-white shadow max-h-60 overflow-y-auto z-10 relative">
                  {proveedoresFiltrados.map(proveedor => (
                    <li
                      key={proveedor.id}
                      className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSeleccion(proveedor.nombre_fantasia)}
                    >
                      {proveedor.razon_social} - {proveedor.nombre_fantasia}
                    </li>
                  ))}
                </ul>
              )}

              <Label className="mt-4 block">Moneda</Label>
                <Input
                list="monedas"
                onBlur={validarMoneda}
                disabled={estaBloqueada}
                value={monedaNombre}
                onChange={e => {
                    const valor = e.target.value
                    setMonedaNombre(valor)
                    const seleccionado = tipoMonedas.find(a => `${a.descripcion} - ${a.simbolo}` === valor)
                    setMonedaId(seleccionado?.id || null)
                    setMonedaCodigo(seleccionado?.codigo || null)
                }}
                placeholder="Seleccionar almacén"
                className={almacenInvalida ? 'border-red-500' : ''}
                />
                <datalist id="monedas">
                {tipoMonedas.map(a => (
                    <option key={a.id} value={`${a.descripcion} - ${a.simbolo}`} />
                ))}
                </datalist>
            </div>

            <div>
              <Label>Entrega Esperada</Label>
              <Input
                type="date"
                disabled={estaBloqueada}
                value={entrega_esperada}
                onChange={e => setEntregaEsperada(e.target.value)}
              />

                <Label className="mt-4 block">Entregar a</Label>
                <Input
                list="almacenes"
                onBlur={validarAlmacen}
                disabled={estaBloqueada}
                value={almacenNombre}
                onChange={e => {
                    const valor = e.target.value
                    setAlmacenNombre(valor)
                    const seleccionado = almacenDestino.find(a => `${a.nombre} - ${a.tipo}` === valor)
                    setAlmacenId(seleccionado?.id || null)
                }}
                placeholder="Seleccionar almacén"
                className={almacenInvalida ? 'border-red-500' : ''}
                />
                <datalist id="almacenes">
                {almacenDestino.map(a => (
                    <option key={a.id} value={`${a.nombre} - ${a.tipo}`} />
                ))}
                </datalist>


            </div>

            {/* Cotización Moneda */}
            {monedaCodigo !== "ARS" && (
            <div className="mt-4">
                <Label>Cotización</Label>
                <Input
                type="number"
                placeholder="Cotización"
                value={cotizacionMoneda ?? ""}
                onChange={(e) => setCotizacionMoneda(Number(e.target.value))}
                disabled={estaBloqueada}
                className={cotizacionMoneda && cotizacionMoneda > 0 ? "" : "border-red-500"}
                />
                {(!cotizacionMoneda || cotizacionMoneda <= 0) && (
                <p className="text-sm text-red-500 mt-1">
                    La cotización es obligatoria si la moneda no es ARS.
                </p>
                )}
            </div>
            )}

          </div>

          <div className="mt-4">
            <CargaProductos
                setProductosValidos={setProductosValidos}
                setProductos={setProductos}
                detalles={ordenCompra?.detalles}
                estadoOrden={ordenCompra?.estado ?? "Pendiente"}
            />
            <div className="flex justify-end mt-2">
            {/* 🔹 Mostrar el total */}
            <Typography variant="h2" className="mt-2">
            Total: {monedaSeleccionada?.simbolo || "$"}{" "}
            {totalOrden.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                style: "decimal", // 🔹 no currency
            })}
            </Typography>
            </div>
            <Textarea placeholder="Observaciones." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>

        {/* 📎 Subir varios archivos */}
        <div className="mt-4">




            <Label>Adjuntar archivos</Label>
            <Input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleArchivosChange}
            />
            {archivos.map((file, idx) => (
            <li key={idx} className="flex justify-between items-center py-1 px-2 hover:bg-gray-100">
                <span
                className="cursor-pointer hover:underline"
                onClick={() => abrirModal(file)}
                >
                📄 {file.nombre}
                </span>

                {!file.isCotizacion && ordenCompra?.estado == 'Pendiente' && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <button className="ml-2 text-red-600 hover:text-red-800">
                        <X size={16} />
                    </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar archivo</AlertDialogTitle>
                        <AlertDialogDescription>
                        ¿Estás seguro que quieres eliminar <strong>{file.nombre}</strong>? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                        onClick={() => {
                            setArchivos(prev => prev.filter(f => f !== file));
                            if (file.id) {
                            router.post(`/compras/ordenes-compras/archivo/${file.id}/eliminar`, {}, {
                                onSuccess: () => toast.success('Archivo eliminado correctamente'),
                                onError: () => toast.error('Error al eliminar el archivo')
                            });
                            }
                        }}
                        >
                        Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                )}

            </li>
            ))}
        </div>



          <div className="flex gap-4 mt-6 justify-end">
                <Button
                onClick={confirmarOrdenCompra}
                disabled={!formularioCompleto || (ordenCompra?.estado === 'Confirmada' || ordenCompra?.estado === 'Cancelada')}
                >
                    Confirmar Orden de Compra
                </Button>

                <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                variant="outline"
                onClick={cancelaOrdenCompra} disabled={!formularioCompleto || (ordenCompra?.estado === 'Confirmada' || ordenCompra?.estado === 'Cancelada')}
                >
                    Cancelar
                </Button>

                <Button
                onClick={() => setModalFacturaVisible(true)}
                disabled={!formularioCompleto || (ordenCompra?.estado !== 'Confirmada')}
                >
                    Cargar Factura
                </Button>

                {/*<Button
                className="bg-green-800 hover:bg-green-900 text-white"
                variant="secondary"
                onClick={() => setModalPagoVisible(true)}
                disabled={
                    !formularioCompleto ||
                    ordenCompra?.estado === 'Cancelada' ||
                    ordenCompra?.estado === 'Pendiente' ||
                    facturasSeleccionadas.length === 0
                }
                >
                Generar Orden de Pago
                </Button>*/}

          </div>
            {/* 📄 Facturas asociadas con selección */}
            {ordenCompra?.comprobantes_proveedores && ordenCompra?.comprobantes_proveedores.length > 0 && (
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Comprobantes asociados</h3>
                <ul className="border rounded p-3 bg-gray-50">
                {ordenCompra.comprobantes_proveedores.map((f) => (
                    <li
                    key={f.id}
                    className="py-2 border-b last:border-0 flex items-center justify-between"
                    >
                    <div className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        checked={facturasSeleccionadas.includes(f.id)}
                        onChange={(e) => {
                            if (e.target.checked) {
                            setFacturasSeleccionadas((prev) => [...prev, f.id]);
                            } else {
                            setFacturasSeleccionadas((prev) => prev.filter((id) => id !== f.id));
                            }
                        }}
                        //disabled={ordenCompra?.estado !== 'Confirmada'}
                        />
                        <div>
                        <strong>{f.tipo_comprobante?.nombre || '-'}</strong> Nº {f.id || '-'}
                        <div className="text-sm text-gray-600">
                            Fecha: {new Date(f.fecha_factura).toLocaleDateString('es-AR')}
                        </div>
                        {/*<div className="text-sm text-gray-600">
                            Total: {f.detalles?.reduce((acc, det) => acc + (det.importe || 0), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </div>*/}
                        </div>
                    </div>

                    {f.archivos?.length > 0 && (
                        <Button
                        variant="outline"
                        onClick={() =>
                            window.open(`/compras/facturas-proveedores/${f.id}`, '_blank')
                        }
                        >
                        Ver
                        </Button>
                    )}
                    </li>
                ))}
                </ul>
            </div>
            )}


        </div>
      </div>



    <Dialog.Root open={modalVisible} onOpenChange={setModalVisible}>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />

    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <Dialog.Title className="text-lg font-bold mb-2">{archivoSeleccionado?.nombre}</Dialog.Title>
        <Dialog.Close asChild>
        <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
            <X size={20} />
        </button>
        </Dialog.Close>

        {archivoSeleccionado && (
        <>
            {archivoSeleccionado.file ? (
            // Recién subido
            archivoSeleccionado.file.type.startsWith('image/') ? (
                <img
                src={URL.createObjectURL(archivoSeleccionado.file)}
                alt={archivoSeleccionado.nombre}
                className="max-h-96 w-auto mx-auto"
                />
            ) : archivoSeleccionado.file.type === 'application/pdf' ? (
                <iframe
                src={URL.createObjectURL(archivoSeleccionado.file)}
                className="w-full h-96"
                />
            ) : (
                <p className="mt-4 text-gray-500">No se puede previsualizar este tipo de archivo.</p>
            )
            ) : (
            // Existente
            archivoSeleccionado.mime.startsWith('image/') ? (
                <img
                src={archivoSeleccionado.url}
                alt={archivoSeleccionado.nombre}
                className="max-h-96 w-auto mx-auto"
                />
            ) : archivoSeleccionado.mime === 'application/pdf' ? (
                <iframe
                src={archivoSeleccionado.url}
                className="w-full h-96"
                />
            ) : (
                <p className="mt-4 text-gray-500">No se puede previsualizar este tipo de archivo.</p>
            )
            )}
        </>
        )}
    </Dialog.Content>
    </Dialog.Root>

    {/*<GenerarOrdenPagoModal
        open={modalPagoVisible}
        onClose={() => setModalPagoVisible(false)}
        onSubmit={handleGenerarOrdenPago}
        totalOrden={totalOrden}
        monedaOrden={monedaSeleccionada?.id}
        tipoMonedas={tipoMonedas}
        proveedorId={ordenCompra?.proveedor?.id || 0}
        facturasSeleccionadas={facturasSeleccionadas}
        comprobantes={ordenCompra?.comprobantes_proveedores || []}

    />*/}

    <GenerarFacturaModal
            open={modalFacturaVisible}
            onClose={() => setModalFacturaVisible(false)}
            onSubmit={handleGenerarFactura}
            totalOrden={totalOrden}
            monedaOrden={monedaSeleccionada?.id || null}
            setProductosValidosFactura={setProductosValidosFactura}
            setProductos={setProductos}
            tipoMonedas={tipoMonedas}
            proveedorId={ordenCompra?.proveedor?.id || 0}
            ordenCompra={ordenCompra}
            productos={productos}
            co_cuentas={[]}
            impuestos={[]}
            estadoOrden={''}
            detalles={[]}
            auth={auth}

    />

    </AuthenticatedLayout>
  )
}
