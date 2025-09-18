import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Search, Truck, CheckCircle2, XCircle, Clock10 } from "lucide-react";
import { useForm } from '@inertiajs/react';
import { useEffect, useState, Fragment } from 'react';
import { router } from '@inertiajs/react';
import { safeDateFormat, safeDateTimeFormat  } from '@/utils/formatterFunctions';
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface DetalleProducto {
    nombre: string;
    cantidad: number;
    fecha_creacion: string;
    usuario_creacion: string;
}
interface Entrega {
    id: number;
    fecha_envio: string;
    fecha_creacion: string;
    usuario_creacion: string;
    estado: string;
    origen: string;
    destino: string;
    productos: DetalleProducto[];
}
interface Almacen {
    id: number;
    nombre: string;
}
interface Props {
    entregas: {
        data: Entrega[];
        links: any;
        meta: {
            current_page: number;
            from: number;
            to: number;
            per_page: number;
            total: number;
            last_page: number;
        };
    };
    almacenes: Almacen[];
    filters: {
        producto?: string;
        estado?: string;
        origen_id?: string;
        destino_id?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
    };
    errors: Record<string, string>;
}

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function Index({ entregas, almacenes, filters, errors }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(() => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('showFilters') === 'true';
        }
        return true;
    });
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const { data, setData, get, processing } = useForm({
        producto: filters.producto || '',
        estado: filters.estado || 'all', 
        origen_id: filters.origen_id || 'all',   
        destino_id: filters.destino_id || 'all', 
        fecha_desde: filters.fecha_desde || '',
        fecha_hasta: filters.fecha_hasta || '',
    });

    const submit = () => {
        const filtros = { ...data };
      
        if (filtros.estado === 'all') filtros.estado = '';
        if (filtros.origen_id === 'all') filtros.origen_id = '';
        if (filtros.destino_id === 'all') filtros.destino_id = '';
      
        setIsLoading(true);
      
        router.get(route('entregas'), filtros, {
          preserveState: true,
          preserveScroll: true,
          onFinish: () => setIsLoading(false), 
        });
    };

    /* useEffect(() => {
        submit();
    }, []); */

    useEffect(() => {
        localStorage.setItem('showFilters', String(showFilters));
    }, [showFilters]);

    const resetFilters = () => {
        setData({
          producto: '',
          estado: 'all',
          origen_id: 'all',
          destino_id: 'all',
          fecha_desde: '',
          fecha_hasta: '',
        });
        router.get(route('entregas'), {}, { preserveState: false });
    };

    const toggleRow = (id: number) => {
        setExpandedRows(prev =>
          prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    return (
        <AuthenticatedLayout>
        <Head title="Órdenes de Entrega" />
            <div className="p-6 space-y-4 max-w-7xl mx-auto">
                {/* Título */}
                <h1 className="text-2xl font-bold mb-2">Órdenes de Entrega</h1>

                {/* Filtros */}
                <Card className="w-full">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Filtros</CardTitle>
                            <CardDescription>Filtra las órdenes de entrega por producto, estado, almacén o fechas</CardDescription>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setShowFilters(prev => !prev)}
                            className={`min-w-[150px] text-sm px-3 py-1 border rounded-md shadow-sm transition-colors duration-200 cursor-pointer
                            ${showFilters 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                            }`}
                        >
                            <motion.div
                                animate={{ rotate: showFilters ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </motion.div>
                            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                        </Button>
                    </CardHeader>

                    <AnimatePresence initial={false}>
                        {showFilters && (
                            <motion.div
                                key="filters"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* Buscar producto */}
                                    <div>
                                        <label className="text-sm mb-1 block">Producto</label>
                                        <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-8"
                                            placeholder="Buscar producto..."
                                            value={data.producto}
                                            onChange={e => setData('producto', e.target.value)}
                                        />
                                        </div>
                                    </div>
                                    {/* Fecha desde */}
                                    <div>
                                        <label className="text-sm mb-1 block">Desde</label>
                                        <Input type="date" value={data.fecha_desde} onChange={e => setData('fecha_desde', e.target.value)} />
                                    </div>
                                    {/* Fecha hasta */}
                                    <div>
                                        <label className="text-sm mb-1 block">Hasta</label>
                                        <Input type="date" value={data.fecha_hasta} onChange={e => setData('fecha_hasta', e.target.value)} />
                                        {errors.fecha_hasta && (<p className="text-sm text-red-600 mt-1">{errors.fecha_hasta}</p>)}
                                    </div>
                                    {/* Estado */}
                                    <div>
                                        <label className="text-sm mb-1 block">Estado</label>
                                        <Select value={data.estado} onValueChange={value => setData('estado', value)}>
                                        <SelectTrigger className="w-full h-10">
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="Enviado">Enviado</SelectItem>
                                            <SelectItem value="Entregado">Entregado</SelectItem>
                                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                                        </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Origen */}
                                    <div className="col-span-2">
                                        <label className="text-sm mb-1 block">Origen</label>
                                        <Select value={data.origen_id} onValueChange={value => setData('origen_id', value)}>
                                        <SelectTrigger className="w-full h-10">
                                            <SelectValue placeholder="Origen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            {almacenes.map(a => (
                                            <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Destino */}
                                    <div className="col-span-2">
                                        <label className="text-sm mb-1 block">Destino</label>
                                        <Select value={data.destino_id} onValueChange={value => setData('destino_id', value)}>
                                        <SelectTrigger className="w-full h-10">
                                            <SelectValue placeholder="Destino" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            {almacenes.map(a => (
                                            <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                    </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 cursor-pointer"
                                            onClick={submit}
                                            disabled={isLoading}
                                            >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Procesando...
                                                </span>
                                            ) : (
                                                'Filtrar'
                                            )}
                                        </Button>
                                        <Button
                                            className="bg-sky-600  hover:bg-sky-700 border border-sky-600 cursor-pointer"
                                            onClick={resetFilters}
                                            disabled={processing}
                                            >
                                            Limpiar filtros
                                        </Button>
                                    </div>    
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>                   
                </Card>

                {/* Tabla */}
                <Card className="mt-4 w-full">
                    <CardHeader>
                        <CardTitle>Órdenes de Entrega</CardTitle>
                        <CardDescription>Lista de órdenes de entrega generadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="min-w-full">
                            <Table>
                                <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                                    <TableRow>
                                        <TableHead>Origen</TableHead>
                                        <TableHead>Destino</TableHead>
                                        <TableHead>Fecha Envío</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Productos</TableHead>
                                        <TableHead>Fecha Creación</TableHead>
                                        <TableHead>Usuario</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entregas.data.map(entrega => (
                                        <Fragment key={entrega.id}>   
                                            <TableRow>
                                                <TableCell>{entrega.origen}</TableCell>
                                                <TableCell>{entrega.destino}</TableCell>
                                                <TableCell>{safeDateFormat(entrega.fecha_envio)}</TableCell>
                                                <TableCell>
                                                {entrega.estado === "Entregado" && (
                                                    <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                                        <CheckCircle2 className="inline h-4 w-4 mr-1" />
                                                        Entregado
                                                    </span>
                                                    /* <Badge variant="success"><CheckCircle2 className="inline h-4 w-4 mr-1" />Entregado</Badge> */
                                                )}
                                                {entrega.estado === "Enviado" && (
                                                    <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                                        <Truck className="inline h-4 w-4 mr-1" />
                                                        Enviado
                                                    </span>
                                                )}
                                                {entrega.estado === "Pendiente" && (
                                                    <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                                                        <Clock10 className="inline h-4 w-4 mr-1" />
                                                        Pendiente
                                                    </span>
                                                )}
                                                {entrega.estado === "Cancelado" && (
                                                    <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                                                        <XCircle className="inline h-4 w-4 mr-1" />
                                                        Cancelado
                                                    </span>
                                                    /*<Badge variant="destructive"><XCircle className="inline h-4 w-4 mr-1" />Cancelado</Badge>*/
                                                )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => toggleRow(entrega.id)}
                                                        className={`min-w-[150px] flex items-center gap-1 justify-center border rounded-md px-3 py-1 font-medium shadow-sm transition-colors duration-200 cursor-pointer
                                                            ${
                                                            expandedRows.includes(entrega.id)
                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                                                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200'
                                                            }
                                                        `}
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: expandedRows.includes(entrega.id) ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <ChevronDown className="w-4 h-4" />
                                                        </motion.div>
                                                        {expandedRows.includes(entrega.id) ? "Ocultar detalle" : "Mostrar detalle"}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{safeDateTimeFormat(entrega.fecha_creacion)}                                                   
                                                </TableCell>
                                                <TableCell>{entrega.usuario_creacion || '-'}</TableCell>
                                            </TableRow>

                                            {/* Animación con framer-motion */}
                                            <AnimatePresence>
                                                {expandedRows.includes(entrega.id) && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="p-0 pb-2">
                                                            <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                            style={{ overflow: "hidden"}}
                                                            >
                                                                <div className="bg-white shadow-inner border border-gray-200 rounded-b-md">
                                                                    <div className="p-1.5">
                                                                        <div className="overflow-x-auto">
                                                                            <table className="min-w-full divide-y divide-gray-300">
                                                                                <thead className="bg-green-50 border-b border-green-600">
                                                                                    <tr>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha creación</th>
                                                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuario creación</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                                    {entrega.productos.map((producto, i) => (
                                                                                    <tr key={i} className="hover:bg-gray-50">
                                                                                        <td className="px-4 py-2 text-sm text-gray-700">{producto.nombre}</td>
                                                                                        <td className="px-4 py-2 text-sm text-gray-700">{producto.cantidad}</td>
                                                                                        <td className="px-4 py-2 text-sm text-gray-700">{safeDateTimeFormat(producto.fecha_creacion)}</td>
                                                                                        <td className="px-4 py-2 text-sm text-gray-700">{producto.usuario_creacion || '-'}</td>
                                                                                    </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                </AnimatePresence>
                                        </Fragment>
                                    ))}
                                    
                                    {entregas.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-gray-500">No hay resultados</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            {/* Información de paginación */}
                            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                                <div>
                                    Mostrando {entregas.meta.from} a {entregas.meta.to} de {entregas.meta.total} resultados
                                </div>
                                <div className="flex gap-1">
                                    {entregas.links.map((link: PaginationLink, index: number) => {
                                    let label = link.label;

                                    // Reemplazar claves de traducción por texto
                                    if (label === 'pagination.previous') label = 'Anterior';
                                    if (label === 'pagination.next') label = 'Siguiente';

                                    return (
                                        <button
                                        key={index}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        className={`px-4 py-1 rounded-md border text-sm transition-colors duration-200 cursor-pointer
                                            ${link.active
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : !link.url
                                            ? 'text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed'
                                            : 'hover:bg-gray-100 text-gray-700 border-gray-300'}
                                        `}
                                        >
                                        {label}
                                        </button>
                                    );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}