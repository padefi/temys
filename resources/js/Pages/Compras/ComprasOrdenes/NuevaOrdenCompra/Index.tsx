import React, { useState, useMemo } from 'react'
import { Terminal } from 'lucide-react'
import { Head, usePage, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import { Progress } from '@/Components/ui/progress'
import CargaProductos from './CargaProductos/Index'
import { Proveedor } from '@/types/Proveedor'
import { TipoMoneda } from '@/types/TipoMoneda'
import { Impuesto } from '@/types/Impuesto'
import { ProductosDisponibles } from '@/types/Producto'

import { Textarea } from "@/Components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert"

import { OrdenesCompra } from '@/types/OrdenCompra'
import { toast } from 'sonner'
import { Almacen } from '@/types/Almacen'

type PageProps = InertiaPageProps & {
  auth: { user: { id: number; name: string; email: string } }
  proveedores: { data: Proveedor[] }
  tipoMonedas: TipoMoneda[]
  productos: ProductosDisponibles[]
  almacenDestino: Almacen[]
  impuestos: Impuesto[]
  ordenCompraElegida?: OrdenesCompra
}


export default function Index() {

    const { proveedores: { data: proveedores }, auth, tipoMonedas, almacenDestino, ordenCompraElegida } = usePage<PageProps>().props

    const ordenCompra = ordenCompraElegida;

    const [busqueda, setBusqueda] = useState( ordenCompra?.proveedor?.nombre_fantasia || '')
    const [mostrarLista, setMostrarLista] = useState(false)
    const [busquedaMoneda, setBusquedaMoneda] = useState(ordenCompra?.tipo_moneda?.descripcion || '')
    const [busquedaMonedaId, setBusquedaMonedaId] = useState<number | null>(
    ordenCompra?.tipo_moneda?.id || null
    )
    const [monedaInvalida, setMonedaInvalida] = useState(false)
    const [entrega_esperada, setEntregaEsperada] = useState(ordenCompra?.entrega_esperada ? new Date(ordenCompra?.entrega_esperada).toISOString().slice(0,10) : '')

    const [almacenId, setAlmacenId] = useState<number | null>(ordenCompra?.almacen?.id || null)
    const [almacenNombre, setAlmacenNombre] = useState(ordenCompra?.almacen?.nombre || '')

    const [almacenInvalida, setAlmacenInvalida] = useState(false)
    const [observaciones, setObservaciones] = useState(ordenCompra?.observaciones || '')
    const [productos, setProductos] = useState<any[]>([])
    const [productosValidos, setProductosValidos] = useState(false)

    const [estadoOrden, setEstadoOrden] = useState(ordenCompra?.estado || '');



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
        const existe = tipoMonedas.some(moneda =>
        moneda.descripcion.toLowerCase() === busquedaMoneda.toLowerCase()
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
        busquedaMoneda.trim() !== '' &&
        !monedaInvalida &&
        almacenNombre.trim() !== '' &&
        !almacenInvalida &&
        entrega_esperada !== '' &&
        productosValidos

    const totalCampos = 4
    const completados = [
        busqueda.trim(),
        busquedaMoneda.trim() !== '' &&
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
            toast("Orden de compra cancelada.");
            setEstadoOrden('Cancelada'); // Actualizamos el estado localmente
        },
        onError: (errors) => {
            const mensajes = Object.values(errors).flat().join('\n');
            toast("Error al cancelar la orden de compra: " + mensajes);
        }
        }
    );
    };

    const generarFactura = () => {
     /* router.post('/compras/facturas/', {
        solicitudCompra: solicitudCompra?.id,
        ordenCotizacion: ordenCotizacion?.[0]?.id,
        proveedor: busqueda,
        moneda: busquedaMoneda,
        entrega_esperada: entrega_esperada,
        entregar_a,
      })*/
    }


    /////////////Confirmar Orden Cotizacion
    const confirmarOrdenCompra= () => {
    router.post('/compras/ordenes-compras/confirmar', {
      ordenCompra: ordenCompra?.id,

      proveedor: busqueda,
      moneda: busquedaMonedaId,
      entrega_esperada: entrega_esperada,
      almacen: almacenId,
      observaciones,
      productos,
      usuario_id: auth.user.id,
        }, {
        onSuccess: () => {

        router.visit('/compras/ordenes-compras/');
        //return redirect()->back()->with('success', 'Orden de cotización guardada.');
        },
        onError: (errors) => {
        console.log(errors);
        const mensajes = Object.values(errors).flat().join('\n');
        toast("Error al generar la cotización", {
            description: mensajes,
        });
        }
    })
    }

    ///////////Guardar Orden Compra
    const guardar = () => {
      router.post('/compras/ordenes-compras/guardar', {
        ordenCompra: ordenCompra?.id,
        proveedor: busqueda,
        moneda: busquedaMonedaId,
        entrega_esperada: entrega_esperada,
        almacen: almacenId,
        observaciones,
        productos,
        usuario_id: auth.user.id,
      }, {
        onSuccess: () => {
          router.visit('/compras/ordenes-compras/');
        },
        onError: (errors) => {
          console.log(errors);
          const mensajes = Object.values(errors).flat().join('\n');
          toast("Error al guardar la orden de compra", {
            description: mensajes,
          });
        }
      })
    }


  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Nueva Orden de Compra</h2>}>
      <Head title="Nueva Orden de Compra"></Head>
      <div className="py-12">
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
            disabled={!formularioCompleto || ordenCompra?.estado === 'Cancelada'}
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
                value={busquedaMoneda}
                onBlur={validarMoneda}
                onChange={e => {
                    const valor = e.target.value
                    setBusquedaMoneda(valor)
                    // Buscar el objeto moneda correspondiente
                    const monedaSeleccionada = tipoMonedas.find(
                    m => `${m.simbolo} ${m.descripcion}` === valor
                    )
                    setBusquedaMonedaId(monedaSeleccionada?.id || null)
                }}
                placeholder="Seleccionar moneda"
                className={monedaInvalida ? 'border-red-500' : ''}
                />

              <datalist id="monedas">
                {tipoMonedas.map(moneda => (
                  <option key={moneda.id} value={moneda.descripcion}>
                    {moneda.simbolo} {moneda.descripcion}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <Label>Entrega Esperada</Label>
              <Input
                type="date"
                value={entrega_esperada}
                onChange={e => setEntregaEsperada(e.target.value)}
              />

                <Label className="mt-4 block">Entregar a</Label>
                <Input
                list="almacenes"
                onBlur={validarAlmacen}
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
          </div>

          <div className="mt-4">
            <CargaProductos setProductosValidos={setProductosValidos} setProductos={setProductos} detalles={ordenCompra?.detalles}/>
            <Textarea placeholder="Observaciones." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
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
                variant="success"
                onClick={generarFactura}
                disabled={!formularioCompleto || (ordenCompra?.estado === 'Cancelada')}
                >
                    Generar Factura
                </Button>

          </div>
        </div>
      </div>


    </AuthenticatedLayout>
  )
}
