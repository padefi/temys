import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import axios from 'axios';
import { toast } from 'sonner';

import { FilterCombobox } from "@/Components/ui/FilterCombobox";
import { ChevronUp, ChevronDown } from "lucide-react";


export default function Index() {
  const { movimientosTesoreria, proveedores, metodosPago, monedas, tiposComprobante, bancos, cuentasBancarias, tarjetas } = usePage().props as any;

  const [filter, setFilter] = useState({
    id: '',
    proveedor_id: '',
    metodo_pago_id: '',
    banco_id: '',
    cuenta_bancaria_id: '',
    tarjeta_id: '',
    tipo_moneda_id: '',
    estado: 'Pendiente',
    fecha_pago: '',
    tipo_comprobante_id: '',
  });

  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [ediciones, setEdiciones] = useState<number[]>([]);
  const [movimientosActualizados, setMovimientosActualizados] = useState(movimientosTesoreria);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);



  const handleChange = (key: string, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };


  // 🔍 Filtrado
    const movimientosFiltrados = useMemo(() => {
    let filtrados = movimientosActualizados.filter((o: any) => {
        if (filter.id && !String(o.id).includes(filter.id)) return false;
        if (filter.proveedor_id && o.proveedor_id != filter.proveedor_id) return false;
        if (filter.metodo_pago_id && o.metodo_pago_id != filter.metodo_pago_id) return false;
        if (filter.banco_id && o.banco_id != filter.banco_id) return false;
        if (filter.tipo_moneda_id && o.tipo_moneda_id != filter.tipo_moneda_id) return false;
        if (filter.estado) {
        if (filter.estado === "Pendiente" && o.conciliado !== 0) return false;
        if (filter.estado === "Conciliado" && o.conciliado !== 1) return false;
        }
        if (filter.fecha_pago) {
        const fechaFiltro = new Date(filter.fecha_pago).toISOString().slice(0, 10);
        const fechaMovimiento = new Date(o.fecha_pago || o.fecha).toISOString().slice(0, 10);
        if (fechaMovimiento !== fechaFiltro) return false;
        }
        return true;
    });

    // 🔽 Ordenamiento
    if (sortConfig) {
        filtrados = [...filtrados].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return 0;
        });
    }

    return filtrados;
    }, [movimientosActualizados, filter, sortConfig]);



    const handleSort = (key: string) => {
    setSortConfig((prev) => {
        if (prev?.key === key) {
        // cambia de asc -> desc -> null
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return null;
        }
        return { key, direction: "asc" };
    });
    };



    const conciliarMovimientos = async () => {
    if (seleccionadas.length === 0) return toast.info("No hay movimientos seleccionados");

    try {
        setLoading(true);
        const { data } = await axios.post('/contabilidad/movimientosTesoreria/conciliarMovimientos', {
        ids: seleccionadas,
        });

        toast.success("Movimientos conciliados correctamente");

        setMovimientosActualizados(prev =>
        prev.map(o =>
            seleccionadas.includes(o.id)
            ? { ...o, conciliado: true, estado: "Conciliado", fecha_conciliado: data.fecha }
            : o
        )
        );

        setSeleccionadas([]);
    } catch (error) {
        console.error(error);
        toast.error("Error al conciliar los movimientos");
    } finally {
        setLoading(false);
    }
    };


  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Conciliación</h2>}>
      <Head title="Conciliación" />



    <div className="flex flex-col h-[calc(100vh-12rem)] rounded-md border shadow-sm overflow-hidden">
    <div className="flex-1 overflow-auto">
        <Table className="min-w-full">

          <TableHeader  className="sticky top-0 bg-gray-50 z-10">
            <TableRow className="bg-gray-50">
              <TableHead></TableHead>
                <TableHead onClick={() => handleSort('id')} className="cursor-pointer select-none">
                    N° OP
                    {sortConfig?.key === 'id' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="inline ml-1 w-4 h-4" /> :
                        <ChevronDown className="inline ml-1 w-4 h-4" />
                    )}
                </TableHead>
                <TableHead>
                    <FilterCombobox
                    items={proveedores.map((p: any) => ({
                        value: String(p.id),
                        label: p.nombre_fantasia,
                    }))}
                    value={String(filter.proveedor_id)}
                    onChange={(v) => handleChange("proveedor_id", Number(v))}
                    placeholder="Proveedores"
                    emptyText="Sin resultados"
                    loading={proveedores.length === 0}
                    />
                </TableHead>
                <TableHead>
                    <FilterCombobox
                    items={metodosPago.map((m: any) => ({ value: String(m.id), label: m.nombre }))}
                    value={filter.metodo_pago_id}
                    onChange={v => handleChange('metodo_pago_id', v)}
                    placeholder="Método Pago"
                    emptyLabel="Sin resultados"
                    />
                </TableHead>
                <TableHead>
                    <FilterCombobox
                        items={bancos.map((b: any) => ({ value: String(b.id), label: b.banco }))}
                        value={String(filter.banco_id)}
                        onChange={v => handleChange('banco_id', Number(v))}
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
                    </TableHead>
                <TableHead>
                    <FilterCombobox
                    items={tarjetas.map((b: any) => ({ value: String(b.id), label: b.tipo + ' - ' + b.numero_tarjeta }))}
                    value={filter.tarjeta_id}
                    onChange={v => handleChange('tarjeta_id', v)}
                    placeholder="Tarjetas"
                    emptyLabel="Sin resultados"
                    />
                </TableHead>*/}
                <TableHead>CBU</TableHead>
                <TableHead>
                    <FilterCombobox
                    items={monedas.map((m: any) => ({ value: String(m.id), label: m.descripcion }))}
                    value={filter.tipo_moneda_id}
                    onChange={v => handleChange('tipo_moneda_id', v)}
                    placeholder="Monedas"
                    emptyLabel="Sin resultados"
                    />
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right">
                    Debe
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right">
                    Haber
                </TableHead>
              <TableHead>
                <FilterCombobox
                  items={[
                    { value: "Pendiente", label: "Pendiente" },
                    { value: "Conciliado", label: "Conciliado" },
                  ]}
                  value={filter.estado}
                  onChange={v => handleChange('estado', v)}
                  placeholder="Estados"
                  emptyLabel="Sin resultados"
                />
              </TableHead>
              <TableHead>
                <Input type="date" className="mt-1" value={filter.fecha_pago} onChange={e => handleChange('fecha_pago', e.target.value)} />
              </TableHead>
            </TableRow>
          </TableHeader>

            <TableBody>
            {movimientosFiltrados.map((o: any) => {
                return (
                <TableRow key={o.id}>
                    <TableCell>
                    {o.conciliado === 0 && (
                    <input
                        type="checkbox"
                        checked={seleccionadas.includes(o.id)}
                        onChange={() => {
                        if (seleccionadas.includes(o.id)) {
                            setSeleccionadas(prev => prev.filter(id => id !== o.id));
                        } else {
                            setSeleccionadas(prev => [...prev, o.id]);
                        }
                        }}
                    />
                    )}
                    </TableCell>

                    <TableCell>{o.id}</TableCell>
                    <TableCell>{o.proveedor?.nombre_fantasia || "-"}</TableCell>

                    <TableCell>{o.metodo_pago?.nombre || "-"}</TableCell>
                    <TableCell className="w-44">{o.banco?.banco || "-"}</TableCell>
                    {/*<TableCell>{o.tarjeta_origen_id ? o.tarjeta?.numero_tarjeta : "-"}</TableCell>*/}
                    <TableCell>{o.referencia_bancaria || "-"}</TableCell>

                    <TableCell>{o.tipo_moneda?.descripcion}</TableCell>

                    {/* 💰 Mostrar importe en Debe o Haber según tipo_movimiento */}
                    <TableCell className="text-right">
                    {o.tipo_movimiento === "entrada" ? `$${o.monto}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                    {o.tipo_movimiento === "salida" ? `$${o.monto}` : "-"}
                    </TableCell>

                    <TableCell>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                        o.conciliado
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        {o.conciliado ? "Conciliado" : "Pendiente"}
                    </span>
                    </TableCell>
                    <TableCell>{o.fecha}</TableCell>
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
      </div>
    </div>


        <div className="mt-4 flex justify-end space-x-2">
        {seleccionadas.length > 0 && (
            <Button
                disabled={loading || Object.keys(ediciones).length > 0}
                onClick={conciliarMovimientos}
            >
                Conciliar {seleccionadas.length} movimiento(s)
            </Button>
        )}
        </div>
    </AuthenticatedLayout>
  );
}
