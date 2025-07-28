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

import { CotizacionOrden } from '@/types/CotizacionOrden'
import { SolicitudCompra } from '@/types/SolicitudCompra'
import { toast } from 'sonner'

type PageProps = InertiaPageProps & {
  auth: { user: { id: number; name: string; email: string } }
  proveedores: { data: Proveedor[] }
  tipoMonedas: TipoMoneda[]
  productos: ProductosDisponibles[]
  impuestos: Impuesto[]
  solicitudCompraElegida?: SolicitudCompra
}


export default function Index() {

  const { proveedores: { data: proveedores }, auth, tipoMonedas, solicitudCompraElegida } = usePage<PageProps>().props


  const solicitudCompra = solicitudCompraElegida
  const ordenCotizacion = solicitudCompra?.ordenes_cotizacion
  console.log(ordenCotizacion?.[0]?.ordenes_compra)
  const [busqueda, setBusqueda] = useState( ordenCotizacion?.[0]?.proveedor?.nombre_fantasia || '')
  const [mostrarLista, setMostrarLista] = useState(false)
  const [busquedaMoneda, setBusquedaMoneda] = useState(ordenCotizacion?.[0]?.tipo_moneda?.descripcion || '')
  const [monedaInvalida, setMonedaInvalida] = useState(false)
  const [cotizar_antes_de, setCotizar_antes_de] = useState(ordenCotizacion?.[0]?.cotizar_antes_de ? new Date(ordenCotizacion?.[0]?.cotizar_antes_de).toISOString().slice(0,10) : '')
  const [entrega_esperada, setEntregaEsperada] = useState(ordenCotizacion?.[0]?.entrega_esperada ? new Date(ordenCotizacion?.[0]?.entrega_esperada).toISOString().slice(0,10) : '')
  const [entregar_a, setEntregar_a] = useState(ordenCotizacion?.[0]?.entregar_a || '')
  const [observaciones, setObservaciones] = useState(ordenCotizacion?.[0]?.observaciones || '')
  const [productos, setProductos] = useState<any[]>([])
  const [productosValidos, setProductosValidos] = useState(false)



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

  /////////////Validacion de Campos Obligatorios
  const formularioCompleto =
    busqueda.trim() !== '' &&
    busquedaMoneda.trim() !== '' &&
    !monedaInvalida &&
    entregar_a.trim() !== '' &&
    observaciones.trim() !== '' &&
    productosValidos

  const totalCampos = 5
  const completados = [
    busqueda.trim(),
    busquedaMoneda.trim() && !monedaInvalida,
    cotizar_antes_de,
    entrega_esperada,
    entregar_a.trim(),
    //observaciones.trim()
  ].filter(Boolean).length

  const porcentaje = (completados / totalCampos) * 100

  ///////////Handle de Envio de Cotizacion
  const enviarCotizacion = () => {
    router.post('/compras/cotizaciones-ordenes/', {
      solicitudCompra: solicitudCompra?.id,
      ordenCotizacion: ordenCotizacion?.[0]?.id,
      proveedor: busqueda,
      moneda: busquedaMoneda,
      cotizar_antes_de: cotizar_antes_de,
      entrega_esperada: entrega_esperada,
      entregar_a,
      observaciones,
      productos,
      usuario_id: auth.user.id,
        }, {
        onSuccess: () => {

        router.visit('/compras/cotizaciones-ordenes/');
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

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Nueva Cotización</h2>}>
      <Head title="Nueva Cotización" />
      <div className="py-12">
        <div className="mx-auto px-10">
        <Button
            variant="outline"
            size="lg"
            onClick={() => router.visit('/compras/cotizaciones-ordenes')}
        >
            Volver
        </Button>
        <div className="items-end">
            <div className="flex flex-col items-end">
                {solicitudCompra?.id ? (
                    <div>
                    N° Solicitud : {solicitudCompra?.id}
                    </div>
                ) : (
                    <div>
                        Solicitud de compra nueva
                    </div>
                )}
                {ordenCotizacion?.[0]?.id ? (
                    <div>
                    N° Orden : {ordenCotizacion?.[0]?.id}
                    </div>
                ) : (
                    <div>
                        Orden de cotización nueva
                    </div>
                )}
                {ordenCotizacion?.[0]?.created_at && (
                <div className="text-sm text-gray-500">
                    {new Date(ordenCotizacion?.[0]?.created_at || '').toLocaleDateString('es-AR', {
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
                {ordenCotizacion?.[0]?.estado && (
                <div>
                    Estado : {ordenCotizacion?.[0]?.estado}
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
                onChange={e => setBusquedaMoneda(e.target.value)}
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
              <Label>Cotizar antes de</Label>
              <Input
                type="date"
                value={cotizar_antes_de}
                onChange={e => setCotizar_antes_de(e.target.value)}
              />
              <Label className="mt-4">Entrega Esperada</Label>
              <Input
                type="date"
                value={entrega_esperada}
                onChange={e => setEntregaEsperada(e.target.value)}
              />
              <Label className="mt-4">Entregar a</Label>
              <Input
                value={entregar_a}
                onChange={e => setEntregar_a(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <CargaProductos setProductosValidos={setProductosValidos} setProductos={setProductos} detalles={ordenCotizacion?.[0]?.detalles}/>
            <Textarea placeholder="Observaciones." value={observaciones} onChange={e => setObservaciones(e.target.value)} />
          </div>

          <div className="flex gap-4 mt-6 justify-end">
                <Button
                disabled={!formularioCompleto || (ordenCotizacion?.[0]?.estado === 'Confirmada' || ordenCotizacion?.[0]?.estado === 'Rechazada')}
                >
                    Confirmar Orden de Cotización
                </Button>

                <Button
                variant="outline"
                onClick={enviarCotizacion} disabled={!formularioCompleto || (ordenCotizacion?.[0]?.estado === 'Confirmada' || ordenCotizacion?.[0]?.estado === 'Rechazada')}
                >
                    Enviar Cotización
                </Button>

            {ordenCotizacion?.[0]?.ordenes_compra?.[0]?.id !== undefined ? (

                <div>
                    Orden de Compra : {ordenCotizacion?.[0]?.ordenes_compra?.[0]?.id}
                </div>

            ):(

                <Button
                variant="success"
                disabled={!formularioCompleto || (ordenCotizacion?.[0]?.estado === 'Rechazada')}
                >
                    Generar Orden de Compra
                </Button>

            )}

          </div>
        </div>
      </div>





    </AuthenticatedLayout>
  )
}
