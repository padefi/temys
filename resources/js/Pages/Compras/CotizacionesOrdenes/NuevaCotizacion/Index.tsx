import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Proveedor } from '@/types/proveedores';
import { TipoMoneda } from '@/types/tipoMoneda';
import { Progress } from '@/Components/ui/progress';
import CargaProductos from './CargaProductos/Index'

type PageProps = InertiaPageProps & {
  proveedores: { data: Array<Proveedor> };
  tipoMonedas: Array<TipoMoneda>;
  module: number;
};

export default function Index() {
  const { proveedores: { data: proveedores }, tipoMonedas } = usePage<PageProps>().props;

  const [busqueda, setBusqueda] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);
  const [busquedaMoneda, setBusquedaMoneda] = useState('');
  const [monedaInvalida, setMonedaInvalida] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [destino, setDestino] = useState('');

  const proveedoresFiltrados = useMemo(() => (
    busqueda.length >= 3
      ? proveedores.filter(p =>
        p.nombre_fantasia.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.razon_social.toLowerCase().includes(busqueda.toLowerCase()))
      : []
  ), [busqueda, proveedores]);

  const mostrarMensaje = busqueda.length >= 3 && proveedoresFiltrados.length === 0;

  const handleSeleccion = (nombre: string) => {
    setBusqueda(nombre);
    setMostrarLista(false);
  };

  const validarMoneda = () => {
    const existe = tipoMonedas.some(moneda =>
      moneda.descripcion.toLowerCase() === busquedaMoneda.toLowerCase()
    );
    setMonedaInvalida(!existe);
  };

  // 🎯 Cálculo de progreso
  const totalCampos = 5;
  const completados = [
    busqueda.trim(),
    busquedaMoneda.trim() && !monedaInvalida,
    fechaVencimiento,
    fechaEntrega,
    destino.trim()
  ].filter(Boolean).length;

  const porcentaje = (completados / totalCampos) * 100;

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Nueva Cotización</h2>}>
      <Head title="Nueva Cotización" />
      <div className="py-12">
        <div className="mx-auto max-w sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
            <div className="p-6 text-gray-900">

              <Progress value={porcentaje} className="mb-6" />

              <h1 className="text-2xl my-3 font-bold">Nueva Cotización</h1>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Proveedor:</label>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      setMostrarLista(true);
                    }}
                    placeholder="Buscar o ingresar proveedor"
                    className="w-full px-4 py-2 border rounded mb-4"
                  />

                  {mostrarMensaje && (
                    <p className="text-sm text-gray-500 mb-2">Proveedor no encontrado. Ingresarlo como nuevo.</p>
                  )}

                  {mostrarLista && proveedoresFiltrados.length > 0 && (
                    <ul className="border rounded p-2 bg-white shadow max-h-60 overflow-y-auto z-10 relative">
                      {proveedoresFiltrados.map((proveedor) => (
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

                  <label>Moneda:</label>
                  <input
                    list="monedas"
                    value={busquedaMoneda}
                    onBlur={validarMoneda}
                    onChange={(e) => setBusquedaMoneda(e.target.value)}
                    placeholder="Seleccionar moneda"
                    className={`w-full px-4 py-2 border rounded mb-4 ${monedaInvalida ? 'border-red-500' : 'border-gray-300'}`}
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
                  <label>Fecha Vencimiento Cotización:</label>
                  <input
                    type='date'
                    className='w-full px-4 py-2 border rounded mb-4'
                    name='fecha_vencimiento'
                    value={fechaVencimiento}
                    onChange={e => setFechaVencimiento(e.target.value)}
                  />

                  <label>Entrega Esperada:</label>
                  <input
                    type='date'
                    className='w-full px-4 py-2 border rounded mb-4'
                    name='fecha_entrega'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                  />
                </div>

                <div>
                  <label>Entregar a:</label>
                  <input
                    type='text'
                    className='w-full px-4 py-2 border rounded mb-4'
                    name='destino'
                    value={destino}
                    onChange={e => setDestino(e.target.value)}
                  />
                </div>
              </div>

                <CargaProductos></CargaProductos>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
