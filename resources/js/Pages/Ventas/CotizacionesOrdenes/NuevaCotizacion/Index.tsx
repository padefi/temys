import React, { useState, useMemo, useEffect } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import { Progress } from '@/Components/ui/progress'
import CargaProductos from './CargaProductos/Index'
import { Cliente } from '@/types/Cliente'
import { TipoMoneda } from '@/types/TipoMoneda'
import { Impuesto } from '@/types/Impuesto'
import { ProductosDisponibles } from '@/types/Producto'

import { Textarea } from "@/Components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"

import { SolicitudVenta } from '@/types/SolicitudVenta'
import { toast } from 'sonner'
import { Almacen } from '@/types/Almacen'
import { Archivo } from '@/types/Archivos'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { AlertDialogFooter, AlertDialogHeader } from '@/Components/ui/alert-dialog'
import { X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { Typography } from '@/Components/ui/typography'

type PageProps = InertiaPageProps & {
  auth: { user: { id: number; name: string; email: string } }
  clientes: { data: Cliente[] }
  tipoMonedas: TipoMoneda[]
  almacenDestino: Almacen[]
  productos: ProductosDisponibles[]
  impuestos: Impuesto[]
  solicitudVentaElegida?: SolicitudVenta
  flash?: {
    success?: string;
    danger?: string;
  };
}



export default function Index() {
    const {
        clientes: { data: clientes },
        auth,
        tipoMonedas,
        almacenDestino,
        solicitudVentaElegida,
        flash
    } = usePage<PageProps>().props


    // 🔵 mostrar flash messages del backend
    useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.danger) toast.error(flash.danger);
    }, [flash]);

    const solicitudVenta = solicitudVentaElegida
    const ordenCotizacionVenta = solicitudVenta?.ordenes_cotizacion_venta
    const [busqueda, setBusqueda] = useState( ordenCotizacionVenta?.[0]?.cliente?.nombre || '')
    const [mostrarLista, setMostrarLista] = useState(false)
    const [monedaId, setMonedaId] = useState<number | null>(
    ordenCotizacionVenta?.[0]?.tipo_moneda?.id ?? null
    );

    const [monedaNombre, setMonedaNombre] = useState(
    ordenCotizacionVenta?.[0]?.tipo_moneda
        ? `${ordenCotizacionVenta?.[0]?.tipo_moneda.descripcion} - ${ordenCotizacionVenta?.[0]?.tipo_moneda.simbolo}`
        : ''
    );

    const [monedaInvalida, setMonedaInvalida] = useState(false)

    const [almacenId, setAlmacenId] = useState<number | null>(
    ordenCotizacionVenta?.[0]?.almacen?.id ?? null
    );

    const [almacenNombre, setAlmacenNombre] = useState(
    ordenCotizacionVenta?.[0]?.almacen
        ? `${ordenCotizacionVenta?.[0]?.almacen.nombre} - ${ordenCotizacionVenta?.[0]?.almacen.tipo}`
        : ''
    );
    const [almacenInvalida, setAlmacenInvalida] = useState(false)

    const [cotizar_antes_de, setCotizar_antes_de] = useState(ordenCotizacionVenta?.[0]?.cotizar_antes_de ? new Date(ordenCotizacionVenta?.[0]?.cotizar_antes_de).toISOString().slice(0,10) : '')
    const [entrega_esperada, setEntregaEsperada] = useState(ordenCotizacionVenta?.[0]?.entrega_esperada ? new Date(ordenCotizacionVenta?.[0]?.entrega_esperada).toISOString().slice(0,10) : '')

    const [observaciones, setObservaciones] = useState(ordenCotizacionVenta?.[0]?.observaciones || '')
    const [productos, setProductos] = useState<any[]>([])
    const [productosValidos, setProductosValidos] = useState(false)

     ////archivos adjuntos
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<Archivo | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [estadoOrden, setEstadoOrden] = useState(ordenCotizacionVenta?.[0]?.estado || '');
    const estaBloqueada = estadoOrden === "Confirmada" || estadoOrden === "Finalizada"

    // 🔹 Calcular total cada vez que cambien los productos
    const totalOrden = useMemo(() => {
            return productos.reduce((acc, p) => acc + (p.importe || 0), 0)
    }, [productos])

    const monedaSeleccionada = tipoMonedas.find(m => m.id === monedaId) || null;


    useEffect(() => {

    if (solicitudVenta?.ordenes_cotizacion_venta?.[0]?.archivos?.length) {
        setArchivos(
        solicitudVenta.ordenes_cotizacion_venta?.[0]?.archivos.map((a: any) => ({
            id: a.id,
            nombre: a.nombre,
            url: `/ventas/cotizaciones-ordenes/archivo/${a.id}`,
            mime: a.mime,
            size: a.size,
        }))
        )
    }
    }, [solicitudVenta?.ordenes_cotizacion_venta])

    //////////Filtro de Clientes
    const clientesFiltrados = useMemo(() =>
        busqueda.length >= 3
        ? clientes.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.apellido.toLowerCase().includes(busqueda.toLowerCase())
            )
        : [], [busqueda, clientes]
    )
    ////////////Muestra Mensaje de que el Cliente no Existe
    const mostrarMensaje = busqueda.length >= 3 && clientesFiltrados.length === 0

    ///////////Handle de seleccion del cliente
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
    cotizar_antes_de !== '' &&
    entrega_esperada !== '' &&
    productosValidos

  const totalCampos = 5

  const completados = [
    busqueda.trim(),
    monedaNombre.trim() !== '' &&
    !monedaInvalida &&
    almacenNombre.trim() !== '' &&
    !almacenInvalida,
    cotizar_antes_de,
    entrega_esperada,
    productosValidos,
    //observaciones.trim()
  ].filter(Boolean).length
  const porcentaje = (completados / totalCampos) * 100

  ///////////Handle de Envio de Cotizacion
  const enviarCotizacion = () => {
    router.post('/ventas/cotizaciones-ordenes/', {
      solicitudVenta: solicitudVenta?.id,
      ordenCotizacion: ordenCotizacionVenta?.[0]?.id,
      proveedor: busqueda,
      moneda: monedaId,
      cotizar_antes_de: cotizar_antes_de,
      entrega_esperada: entrega_esperada,
      almacen: almacenId,
      observaciones,
      productos,
      usuario_id: auth.user.id,
    }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            toast.success("Orden de cotización enviada correctamente.", { duration: 4000 });
        },
        onError: (errors) => {
            console.error(errors)
            toast.error(
                Object.values(errors).flat().join("\n")
            )
        }

    });
    }



    /////////////Confirmar Orden Cotizacion
    const confirmarOrdenCotizacion= () => {
    router.post('/ventas/cotizaciones-ordenes/confirmar', {
      solicitudVenta: solicitudVenta?.id,
      ordenCotizacion: ordenCotizacionVenta?.[0]?.id,
      proveedor: busqueda,
      moneda: monedaId,
      cotizar_antes_de: cotizar_antes_de,
      entrega_esperada: entrega_esperada,
      almacen: almacenId,
      observaciones,
      productos,
      usuario_id: auth.user.id,
    }, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
            setEstadoOrden('Confirmada'); // Actualizamos el estado localmente
            toast.success("Orden de cotización confirmada correctamente.", { duration: 4000 });
        },
        onError: (errors) => {
            console.error(errors)
            toast.error(
                Object.values(errors).flat().join("\n")
            )
        }

    });
    };

    ///////////Guardar Orden Venta
    const guardar = () => {
      router.post('/ventas/cotizaciones-ordenes/guardar', {
        solicitudVenta: solicitudVenta?.id,
        ordenCotizacion: ordenCotizacionVenta?.[0]?.id,
        proveedor: busqueda,
        moneda: monedaId,
        cotizar_antes_de: cotizar_antes_de,
        entrega_esperada: entrega_esperada,
        almacen: almacenId,
        observaciones,
        productos,
        usuario_id: auth.user.id,
      }, {
        preserveScroll: true,
        onSuccess: () => {
            toast.success("Orden guardada correctamente.", { duration: 4000 });
            router.reload({ only: ['solicitudVentaElegida', 'ordenCotizacion'] })
        },
        onError: (errors) => {
            console.error(errors)
            toast.error(
                Object.values(errors).flat().join("\n")
            )
        }

    });
    };

    const handleGenerarOrdenVenta = () => {
    router.post('/ventas/cotizaciones-ordenes/guardar', {
        solicitudVenta: solicitudVenta?.id,
        ordenCotizacion: ordenCotizacionVenta?.[0]?.id,
        proveedor: busqueda,
        moneda: monedaId,
        cotizar_antes_de: cotizar_antes_de,
        entrega_esperada: entrega_esperada,
        almacen: almacenId,
        observaciones,
        productos,
        usuario_id: auth.user.id,
    },
    {
        onSuccess: () => {
            if (!ordenCotizacionVenta?.[0]?.id) {
                toast.error("No se ha seleccionado una orden de cotización.");
                return;
            }

            const select = [];
            select.push(ordenCotizacionVenta?.[0]?.id);


            router.post('/compras/cotizaciones-ordenes/generar-orden-compra', { ordenes: select, usuario_id: auth.user.id }, {
            onSuccess: () => {

                //toast.success(`Orden de Venta Generada.`);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error("Hubo un error al generar la orden de venta");
            }
            })
        },
        onError: (errors) => {
            console.error("ERRORES GUARDAR:", errors);
            router.reload({ only: ["flash"] });
        },
    })
}

// 🚀 Subida de archivos
    const handleUploadFile = async (ordenId: number, archivo: File) => {
        const formData = new FormData()
        formData.append("archivo", archivo)

        router.post(`/compras/cotizaciones-ordenes/${ordenId}/archivo`, formData, {
        forceFormData: true,
        onSuccess: () => console.log('subido'),
        onError: () => toast.error(`Error al subir ${archivo.name}`),
        })
    }

    ////////////Manejo de archivos adjuntos
    const handleArchivosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !solicitudVenta?.ordenes_cotizacion_venta?.[0].id) return;

    const nuevosArchivos: Archivo[] = Array.from(e.target.files).map(f => ({
        nombre: f.name,
        file: f,
        mime: f.type,
        size: f.size,
    }));

    setArchivos(prev => [...prev, ...nuevosArchivos]);

    nuevosArchivos.forEach(a => handleUploadFile(solicitudVenta?.ordenes_cotizacion_venta?.[0].id!, a.file!));
    }

    const abrirModal = (archivo: Archivo) => {
        console.log(archivo);
    setArchivoSeleccionado(archivo);
    setModalVisible(true);
    };

    const cerrarModal = () => {
    setArchivoSeleccionado(null);
    setModalVisible(false);
    };


  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Nueva Cotización</h2>}>
      <Head title="Nueva Cotización" />
      <div className="py-12">
        <Typography  className="text-2xl font-bold mb-4 text-center">
            Presupuesto
        </Typography>
        <div className="mx-auto px-10">
        <Button
            variant="outline"
            size="lg"
            onClick={() => router.visit('/compras/cotizaciones-ordenes')}
        >
            Volver
        </Button>
         <Button
            variant="outline"
            size="lg"
            disabled={!formularioCompleto || ordenCotizacionVenta?.[0]?.estado === 'Cancelada' || ordenCotizacionVenta?.[0]?.estado === 'Confirmada' || ordenCotizacionVenta?.[0]?.ordenes_venta?.length > 0 }
            onClick={() => guardar()}
        >
            Guardar
        </Button>
        <div className="items-end">
            <div className="flex flex-col items-end">
                {solicitudVenta?.id ? (
                    <div>
                    N° Solicitud de venta: {solicitudVenta?.id}
                    </div>
                ) : (
                    <div>
                        Solicitud de venta nueva
                    </div>
                )}
                {ordenCotizacionVenta?.[0]?.id ? (
                    <div>
                    N° Presupuesto : {ordenCotizacionVenta?.[0]?.id}
                    </div>
                ) : (
                    <div>
                        Orden de cotización nueva
                    </div>
                )}
                {ordenCotizacionVenta?.[0]?.created_at && (
                <div className="text-sm text-gray-500">
                    {new Date(ordenCotizacionVenta?.[0]?.created_at || '').toLocaleDateString('es-AR', {
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
                {ordenCotizacionVenta?.[0]?.estado && (
                <div>
                    Estado : {ordenCotizacionVenta?.[0]?.estado}
                </div>
                )}
            </div>
        </div>
          <Progress value={porcentaje} className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cliente</Label>
              <Input
                disabled={estaBloqueada}
                value={busqueda}
                onChange={e => {
                  setBusqueda(e.target.value)
                  setMostrarLista(true)
                }}
                placeholder="Buscar o ingresar cliente"
              />
              {mostrarMensaje && (
                <p className="text-sm text-gray-500 mt-1">Cliente no encontrado. Ingresarlo como nuevo.</p>
              )}
              {mostrarLista && clientesFiltrados.length > 0 && (
                <ul className="border rounded p-2 bg-white shadow max-h-60 overflow-y-auto z-10 relative">
                  {clientesFiltrados.map(cliente => (
                    <li
                      key={cliente.id}
                      className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSeleccion(cliente.nombre)}
                    >
                      {cliente.nombre} - {cliente.apellido}
                    </li>
                  ))}
                </ul>
              )}

              <Label className="mt-4 block">Moneda</Label>

                <Input
                disabled={estaBloqueada}
                list="monedas"
                value={
                    monedaId
                    ? `${tipoMonedas.find(m => m.id === monedaId)?.descripcion} - ${tipoMonedas.find(m => m.id === monedaId)?.simbolo}`
                    : monedaNombre
                }
                onChange={e => {
                    const seleccionado = tipoMonedas.find(
                    a => `${a.descripcion} - ${a.simbolo}` === e.target.value
                    )
                    setMonedaId(seleccionado?.id || null)
                    setMonedaNombre(e.target.value)
                }}
                onBlur={validarMoneda}
                placeholder="Seleccionar moneda"
                />
                <datalist id="monedas">
                {tipoMonedas.map(a => (
                    <option key={a.id} value={`${a.descripcion} - ${a.simbolo}`} />
                ))}
                </datalist>

            </div>

            <div>
              <Label>Cotizar antes de</Label>
              <Input
                disabled={estaBloqueada}
                type="date"
                value={cotizar_antes_de}
                onChange={e => setCotizar_antes_de(e.target.value)}
              />
              <Label className="mt-4">Entrega Esperada</Label>
              <Input
                disabled={estaBloqueada}
                type="date"
                value={entrega_esperada}
                onChange={e => setEntregaEsperada(e.target.value)}
              />
              <Label className="mt-4 block">Entregar a</Label>
                <Input
                disabled={estaBloqueada}
                list="almacenes"
                value={
                    almacenId
                    ? `${almacenDestino.find(a => a.id === almacenId)?.nombre} - ${almacenDestino.find(a => a.id === almacenId)?.tipo}`
                    : almacenNombre
                }
                onChange={e => {
                    const seleccionado = almacenDestino.find(
                    a => `${a.nombre} - ${a.tipo}` === e.target.value
                    );
                    setAlmacenId(seleccionado?.id || null);
                    setAlmacenNombre(e.target.value);
                }}
                onBlur={validarAlmacen}
                placeholder="Seleccionar almacén"
                />
                <datalist id="almacenes">
                {almacenDestino.map(a => (
                    <option key={a.id} value={`${a.nombre} - ${a.tipo}`} />
                ))}
                </datalist>
            </div>
          </div>

          <div className="mt-6">
            <CargaProductos
                setProductosValidos={setProductosValidos}
                setProductos={setProductos}
                detalles={ordenCotizacionVenta?.[0]?.detalles}
                ordenCotizacion={ordenCotizacionVenta?.[0]}
                estadoOrden={ordenCotizacionVenta?.[0]?.estado}
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
                        router.post(`/compras/cotizaciones-ordenes/archivo/${file.id}/eliminar`, {}, {
                            onSuccess: () => console.log('eliminado'),
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
            </li>
            ))}
        </div>

          <div className="flex gap-4 mt-6 justify-end">
                <Button
                onClick={confirmarOrdenCotizacion}
                disabled={!formularioCompleto || (ordenCotizacionVenta?.[0]?.estado === 'Confirmada' || ordenCotizacionVenta?.[0]?.estado === 'Cancelada')}
                >
                    Confirmar Orden de Cotización | Presupuesto
                </Button>

                <Button
                variant="outline"
                onClick={enviarCotizacion} disabled={!formularioCompleto || (ordenCotizacionVenta?.[0]?.estado === 'Confirmada' || ordenCotizacionVenta?.[0]?.estado === 'Cancelada')}
                >
                    Enviar Orden de Cotización
                </Button>

            {ordenCotizacionVenta?.[0]?.ordenes_venta?.[0]?.id !== undefined ? (

                <div>
                    Orden de Venta : {ordenCotizacionVenta?.[0]?.ordenes_venta?.[0]?.id}
                </div>

            ):(

                <Button
                onClick={handleGenerarOrdenVenta}
                variant="outline"
                disabled={!formularioCompleto || (ordenCotizacionVenta?.[0]?.estado === 'Cancelada')}
                >
                    Generar Orden de Venta
                </Button>

            )}

          </div>
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



    </AuthenticatedLayout>
  )
}
