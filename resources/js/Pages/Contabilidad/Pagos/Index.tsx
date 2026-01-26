import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';

import { FilterCombobox } from "@/Components/ui/FilterCombobox";


export default function Index() {
  const { ordenesTesoreria, proveedores, metodosPago, monedas, tiposComprobante, bancos, cuentasBancarias, tarjetas } = usePage().props as any;

  const [filter, setFilter] = useState({
    id: '',
    proveedor_id: '',
    metodo_id: '',
    banco_origen_id: '',
    cuenta_bancaria_id: '',
    tarjeta_id: '',
    moneda_id: '',
    estado: 'Pendiente',
    fecha: '',
    tipo_comprobante_id: '',
  });

  const [expanded, setExpanded] = useState<number | null>(null);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [ediciones, setEdiciones] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(false);
  const [ordenesActualizadas, setOrdenesActualizadas] = useState(ordenesTesoreria);
  const [guardadasRecientes, setGuardadasRecientes] = useState<number[]>([]);

  const handleChange = (key: string, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const requiereBanco = (metodoId: number) => {
    const metodo = metodosPago.find((m: any) => m.id === metodoId);
    return metodo?.requiere_banco || metodo?.nombre?.toLowerCase().includes("transferencia");
  };

  const requiereTarjeta = (metodoId: number) => {
    const metodo = metodosPago.find((m: any) => m.id === metodoId);
    return metodo?.nombre?.toLowerCase().includes("tarjeta");
  };

  // 🔍 Filtrado
  const ordenesFiltradas = useMemo(() => {
    return ordenesActualizadas.filter((o: any) => {
      const comprobantes = o.comprobantes || [];
      if (filter.id && !String(o.id).includes(filter.id)) return false;
      if (filter.proveedor_id && comprobantes[0]?.tipo_id != filter.proveedor_id) return false;
      if (filter.metodo_id && o.metodo_id != filter.metodo_id) return false;
      if (filter.banco_origen_id && o.banco_origen_id != filter.banco_origen_id) return false;
      if (filter.cuenta_bancaria_id && o.cuenta_origen_id != filter.cuenta_bancaria_id) return false;
      if (filter.tarjeta_id && o.tarjeta_origen_id != filter.tarjeta_id) return false;
      if (filter.moneda_id && o.moneda_id != filter.moneda_id) return false;
      if (filter.estado && o.estado != filter.estado) return false;
      if (filter.fecha && !String(o.fecha).includes(filter.fecha)) return false;
      return true;
    });
  }, [ordenesActualizadas, filter]);

  const handleEdit = (ordenId: number, field: string, value: any) => {
    setEdiciones(prev => ({
      ...prev,
      [ordenId]: { ...prev[ordenId], [field]: value },
    }));
  };

  const guardarCambios = async () => {
    const datos = Object.entries(ediciones).map(([id, cambios]) => ({
      id: Number(id),
      ...cambios,
    }));

    if (datos.length === 0) return toast.info("No hay cambios para guardar");

    try {
      setLoading(true);
      await axios.post('/contabilidad/ordenesTesoreria/guardarOrdenes', { ordenes: datos });
      toast.success("Cambios guardados correctamente");

      setOrdenesActualizadas(prev => prev.map(o => {
        const mod = datos.find(d => d.id === o.id);
        return mod ? { ...o, ...mod } : o;
      }));

      const ids = datos.map(d => d.id);
      setGuardadasRecientes(ids);
      setTimeout(() => setGuardadasRecientes([]), 2000);
      setEdiciones({});
      setSeleccionadas(prev => prev.filter(id => !ids.includes(id)));
    } catch {
      toast.error("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };


    const procesarOrden = async () => {
    if (seleccionadas.length === 0) return toast.info("No hay órdenes seleccionadas");

    try {
        setLoading(true);
        await axios.post('/contabilidad/ordenesTesoreria/procesarOrdenes', {
        ordenes: seleccionadas.map(id => {
            const orden = ordenesActualizadas.find((o: any) => o.id === id);
            return {
            id,
            metodo_id: orden.metodo_id,
            banco_origen_id: orden.banco_origen_id,
            cuenta_origen_id: orden.cuenta_origen_id,
            tarjeta_origen_id: orden.tarjeta_origen_id,
            cbu_pago: orden.cbu_pago,
            importe: orden.importe,
            proveedor_id: orden.comprobantes?.[0]?.tipo_id ?? null,
            moneda_id: orden.moneda_id,
            };
        })
        });

        toast.success("Órdenes procesadas correctamente");

        setOrdenesActualizadas(prev =>
        prev.map(o =>
            seleccionadas.includes(o.id) ? { ...o, estado: 'procesada' } : o
        )
        );

        setSeleccionadas([]);
    } catch (error) {
        console.error(error);
        toast.error("Error al procesar las órdenes");
    } finally {
        setLoading(false);
    }
    };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Órdenes de Pago</h2>}>
      <Head title="Órdenes de Pago" />



      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead>
                <Input className="mt-1" value={filter.id} onChange={e => handleChange('id', e.target.value)} placeholder="N° OP" />
              </TableHead>
              <TableHead>
                <FilterCombobox
                  items={proveedores.map((p: any) => ({ value: String(p.id), label: p.nombre_fantasia }))}
                  value={filter.proveedor_id}
                  onChange={v => handleChange('proveedor_id', v)}
                  placeholder="Proveedores"
                  emptyLabel="Sin resultados"
                />
              </TableHead>
              <TableHead>
                <FilterCombobox
                  items={metodosPago.map((m: any) => ({ value: String(m.id), label: m.nombre }))}
                  value={filter.metodo_id}
                  onChange={v => handleChange('metodo_id', v)}
                  placeholder="Método Pago"
                  emptyLabel="Sin resultados"
                />
              </TableHead>
                <TableHead className="w-44">
                <FilterCombobox
                    items={bancos.map((b: any) => ({ value: String(b.id), label: b.banco }))}
                    value={filter.banco_origen_id}
                    onChange={v => handleChange('banco_origen_id', v)}
                    placeholder="Bancos"
                    emptyLabel="Sin resultados"
                />
                </TableHead>
              {/*<TableHead>
                <FilterCombobox
                  items={cuentasBancarias.map((b: any) => ({ value: String(b.id), label: b.tipo_cuenta + ' - ' + b.numero_cuenta }))}
                  value={filter.cuenta_bancaria_id}
                  onChange={v => handleChange('cuenta_bancaria_id', v)}
                  placeholder="Cuentas"
                  emptyLabel="Sin resultados"
                />
                </TableHead>*/}
              <TableHead>
                <FilterCombobox
                  items={tarjetas.map((b: any) => ({ value: String(b.id), label: b.tipo + ' - ' + b.numero_tarjeta }))}
                  value={filter.tarjeta_id}
                  onChange={v => handleChange('tarjeta_id', v)}
                  placeholder="Tarjetas"
                  emptyLabel="Sin resultados"
                />
              </TableHead>
              <TableHead>CBU</TableHead>
              <TableHead>
                <FilterCombobox
                  items={monedas.map((m: any) => ({ value: String(m.id), label: m.descripcion }))}
                  value={filter.moneda_id}
                  onChange={v => handleChange('moneda_id', v)}
                  placeholder="Monedas"
                  emptyLabel="Sin resultados"
                />
              </TableHead>
              <TableHead>Importe</TableHead>
              <TableHead>
                <FilterCombobox
                  items={[
                    { value: "Pendiente", label: "Pendiente" },
                    { value: "Confirmado", label: "Confirmado" },
                    { value: "Anulado", label: "Anulado" },
                  ]}
                  value={filter.estado}
                  onChange={v => handleChange('estado', v)}
                  placeholder="Estados"
                  emptyLabel="Sin resultados"
                />
              </TableHead>
              <TableHead>
                <Input type="date" className="mt-1" value={filter.fecha} onChange={e => handleChange('fecha', e.target.value)} />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {ordenesFiltradas.map((o: any) => {
              const isExpanded = expanded === o.id;
              const comprobantes = o.comprobantes || [];
              const cambios = ediciones[o.id] || {};

              return (
                <>
                  <TableRow
                    key={o.id}
                    className={`transition-colors duration-500 ${
                      guardadasRecientes.includes(o.id)
                        ? "bg-green-100"
                        : ediciones[o.id]
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                <TableCell>
                    <input
                        type="checkbox"
                        checked={seleccionadas.includes(o.id)}
                        onChange={() => {
                        // Si no hay ninguna seleccionada, se permite seleccionar libremente
                        if (seleccionadas.length === 0) {
                            setSeleccionadas([o.id]);
                            return;
                        }

                        // Buscamos la primera orden seleccionada como referencia
                        const primera = ordenesActualizadas.find((x: any) => x.id === seleccionadas[0]);
                        if (!primera) return;

                        // Condiciones base: mismo proveedor y método de pago
                        const mismoProveedor =
                            o.comprobantes?.[0]?.tipo_id ===
                            primera.comprobantes?.[0]?.tipo_id;

                        const mismoMetodo = o.metodo_id === primera.metodo_id;

                        // Verificamos según el tipo de método
                        const metodo = metodosPago.find((m: any) => m.id === o.metodo_id);
                        const esTransferencia = metodo?.requiere_banco || metodo?.nombre?.toLowerCase().includes("transferencia");
                        const esTarjeta = metodo?.nombre?.toLowerCase().includes("tarjeta");

                        let mismoOrigen = true;
                        if (esTransferencia) {
                            mismoOrigen =
                            o.banco_origen_id === primera.banco_origen_id &&
                            o.cuenta_origen_id === primera.cuenta_origen_id &&
                            o.cbu_pago === primera.cbu_pago;
                        } else if (esTarjeta) {
                            mismoOrigen =
                            o.tarjeta_origen_id === primera.tarjeta_origen_id &&
                            o.cbu_pago === primera.cbu_pago;
                        } else {
                            // Métodos sin banco ni tarjeta → solo comparamos CBU
                            mismoOrigen = o.cbu_pago === primera.cbu_pago;
                        }

                        // Si ya está seleccionada, la deseleccionamos
                        if (seleccionadas.includes(o.id)) {
                            setSeleccionadas(prev => prev.filter(id => id !== o.id));
                            return;
                        }

                        // Si no cumple las condiciones, mostramos un aviso y no permitimos seleccionar
                        if (!(mismoProveedor && mismoMetodo && mismoOrigen)) {
                            toast.error("Solo se pueden seleccionar órdenes del mismo proveedor, método y origen de pago");
                            return;
                        }

                        // Si todo ok, agregamos
                        setSeleccionadas(prev => [...prev, o.id]);
                        }}
                    />
                    </TableCell>
                    <TableCell onClick={() => setExpanded(isExpanded ? null : o.id)} className="cursor-pointer">
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </TableCell>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>{comprobantes?.[0]?.proveedor?.nombre_fantasia || "-"}</TableCell>

                    {/* Método editable */}
                    <TableCell>
                      <Select value={String(cambios.metodo_id ?? o.metodo_id)} onValueChange={v => handleEdit(o.id, "metodo_id", Number(v))}>
                        <SelectTrigger><SelectValue placeholder="Método" /></SelectTrigger>
                        <SelectContent>
                          {metodosPago.map((m: any) => (
                            <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="w-44">
                    {requiereBanco(cambios.metodo_id ?? o.metodo_id) && (
                        <>
                        <Select
                            value={String(cambios.banco_origen_id ?? o.banco_origen_id ?? '')}
                            onValueChange={v => {
                            handleEdit(o.id, 'banco_origen_id', Number(v));
                            handleEdit(o.id, 'cuenta_origen_id', null);
                            }}
                        >
                            <SelectTrigger className="w-44">
                            <SelectValue placeholder="Banco" />
                            </SelectTrigger>
                            <SelectContent>
                            {bancos.map((b: any) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                {b.banco}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={String(cambios.cuenta_origen_id ?? o.cuenta_origen_id ?? '')}
                            onValueChange={v => handleEdit(o.id, 'cuenta_origen_id', Number(v))}
                            disabled={!cambios.banco_origen_id && !o.banco_origen_id}
                        >
                            <SelectTrigger className="mt-2 w-44">
                            <SelectValue placeholder="Cuenta" />
                            </SelectTrigger>
                            <SelectContent>
                            {cuentasBancarias
                                .filter((c: any) =>
                                c.banco_id === (cambios.banco_origen_id ?? o.banco_origen_id)
                                )
                                .map((c: any) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.tipo_cuenta} - {c.numero_cuenta}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        </>
                    )}
                    </TableCell>

                    <TableCell>
                      {requiereTarjeta(cambios.metodo_id ?? o.metodo_id) && (
                        <Select value={String(cambios.tarjeta_origen_id ?? o.tarjeta_origen_id ?? '')} onValueChange={v => handleEdit(o.id, 'tarjeta_origen_id', Number(v))}>
                          <SelectTrigger><SelectValue placeholder="Tarjeta" /></SelectTrigger>
                          <SelectContent>
                            {tarjetas.map((t: any) => (
                              <SelectItem key={t.id} value={String(t.id)}>{t.tipo} - {t.numero_tarjeta}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>

                    <TableCell>
                    <Input
                        placeholder="CBU"
                        value={cambios.cbu_pago ?? o.cbu_pago ?? ''}
                        onChange={(e) => handleEdit(o.id, 'cbu_pago', e.target.value)}
                        className="w-[23ch]"
                    />
                    </TableCell>

                    <TableCell>{o.moneda?.descripcion}</TableCell>
                    <TableCell>${o.importe}</TableCell>
                    <TableCell>{o.estado}</TableCell>
                    <TableCell>{o.fecha}</TableCell>
                  </TableRow>

                  {isExpanded && comprobantes.length > 0 && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={13}>
                        <div className="text-sm font-semibold mb-2 ml-2">Comprobantes Asociados:</div>
                        <Table className="ml-6 border rounded-md">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tipo</TableHead>
                              <TableHead>N° Factura</TableHead>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Importe</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {comprobantes.map((c: any) => (
                              <TableRow key={c.id}>
                                <TableCell>{c.tipo_comprobante?.nombre}</TableCell>
                                <TableCell>{c.punto_venta}-{c.numero_factura}</TableCell>
                                <TableCell>{c.fecha_factura}</TableCell>
                                <TableCell>${c.pivot?.importe_aplicado}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>


        <div className="mt-4 flex justify-end space-x-2">
        {Object.keys(ediciones).length > 0 && (
          <Button
            onClick={guardarCambios}
            disabled={loading || Object.keys(ediciones).length === 0}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        )}
        {seleccionadas.length > 0 && (
          <Button
            disabled={loading || Object.keys(ediciones).length > 0}
            onClick={procesarOrden}
          >
            Procesar {seleccionadas.length} orden(es)
          </Button>
      )}
        </div>
    </AuthenticatedLayout>
  );
}
