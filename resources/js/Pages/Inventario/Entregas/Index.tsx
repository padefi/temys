import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Truck, CheckCircle2, XCircle, Clock10 } from "lucide-react";
import { useForm } from '@inertiajs/react';
import { useEffect, useState, Fragment } from 'react';
import { router } from '@inertiajs/react';
import { dateFormat, dateTimeFormat } from '@/utils/formatterFunctions';
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import { Textarea } from "@/Components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";

/* PDF */
//@ts-ignore
import pdfMake from "pdfmake/build/pdfmake";
//@ts-ignore
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
pdfMake.vfs = pdfFonts.vfs;

interface DetalleProducto {
    nombre: string;
    cantidad: number;
    fecha_creacion: string;
    usuario_creacion: string;
}
interface Cancelacion {
    motivo: string;
    fecha: string;
    usuario: string;
}
interface Entrega {
    id: number;
    fecha_envio: string | null;
    fecha_creacion: string | null;
    usuario_creacion: string;
    estado: string;
    origen: string;
    destino: string;
    productos: DetalleProducto[];
    cancelacion?: Cancelacion;
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
    const [modalOpen, setModalOpen] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [modalGenerarRemito, setModalGenerarRemito] = useState(false);
    const [modalRemitoAbierto, setModalRemitoAbierto] = useState(false);
    const [remitoActual, setRemitoActual] = useState<Entrega | null>(null);
    const [entregaSeleccionada, setEntregaSeleccionada] = useState<Entrega | null>(null);
    const [mostrarMotivo, setMostrarMotivo] = useState<{ [key: number]: boolean }>({});
    const [modalBloqueado, setModalBloqueado] = useState(false);

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

    const openCancelarModal = (entrega: any) => {
        setEntregaSeleccionada(entrega);
        setMotivo('');
        setModalOpen(true);
    };

    const abrirPrevisualizacionRemito = (entrega: Entrega) => {
        setEntregaSeleccionada(entrega);
        setModalGenerarRemito(true);
    };

    const confirmarEnvio = async (entrega: Entrega) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez confirmado, la orden será marcada como enviada y se generará el remito correspondiente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-green-900 hover:bg-green-700 text-white font-bold px-5 py-2 mx-3 rounded cursor-pointer focus:outline-none focus:shadow-outline',
                cancelButton: 'bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded cursor-pointer focus:outline-none focus:shadow-outline',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(route('entregas.confirmar-envio', entrega.id))
                .then(() => {
                    generarRemitoPdf(entrega); //Se pasa el objeto directamente
                    router.reload({ only: ['entregas'] });
                })
                .catch(() => {
                    Swal.fire('Error', 'No se pudo confirmar la orden.', 'error');
                });
            }
        });
    };

    const generarRemitoPdf = (entrega: Entrega) => {
        //Abre el PDF ya generado por mPDF en el backend
        window.open(route('remitos.mostrar', entrega.id), '_blank');
    };

    const confirmarCancelacion = (id: number) => {
        setModalBloqueado(true); //Desactiva el trapping de Radix(dialog) mientras SweetAlert está abierto

        Swal.fire({
            title: '¿Confirmar cancelación?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true, //Fuerza a SweetAlert a cubrir completamente el fondo
            focusConfirm: false, //Evita que Radix(dialog) vuelva a tomar el foco
            buttonsStyling: false, //Necesario para habilitar estilos personalizados
            customClass: {
                confirmButton: 'bg-red-600 text-white hover:bg-red-500 font-bold px-5 py-2 mx-3 rounded cursor-pointer focus:outline-none focus:shadow-outline',
                cancelButton: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-5 py-2 rounded cursor-pointer focus:outline-none focus:shadow-outline',
                popup: 'z-[9999]', //Fuerza el SweetAlert al frente
            }
        }).then((result) => {
            setModalBloqueado(false); //Reactivamos el trapping normal del Dialog

            if (result.isConfirmed) {
                axios.post(route('entregas.cancelar', id), { motivo })
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Cancelado',
                            text: 'La orden fue cancelada.',
                            customClass: { popup: 'z-[9999]', }
                        });
                        setModalOpen(false);
                        router.reload({ only: ['entregas'] });
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo cancelar la orden.',
                            customClass: { popup: 'z-[9999]' }
                        });
                    });
            }
        });
    };

    const toggleMostrarMotivo = (id: number) => {
        setMostrarMotivo(prev => ({ ...prev, [id]: !prev[id] }));
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
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
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
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entregas.data.map(entrega => (
                                        <Fragment key={entrega.id}>
                                            <TableRow>
                                                <TableCell>{entrega.origen}</TableCell>
                                                <TableCell>{entrega.destino}</TableCell>
                                                <TableCell>{dateFormat(entrega.fecha_envio)}</TableCell>
                                                <TableCell>
                                                    {entrega.estado === "Entregado" && (
                                                        <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                                                            <CheckCircle2 className="inline h-4 w-4 mr-1" />
                                                            Entregado
                                                        </span>
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
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => toggleRow(entrega.id)}
                                                        className={`min-w-[150px] flex items-center gap-1 justify-center border rounded-md px-3 py-4 font-medium shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none focus:shadow-outline
                                                            ${
                                                            expandedRows.includes(entrega.id)
                                                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
                                                                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
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
                                                <TableCell>{dateTimeFormat(entrega.fecha_creacion)}
                                                </TableCell>
                                                <TableCell>{entrega.usuario_creacion || '-'}</TableCell>
                                                <TableCell>
                                                    {/* Acciones - Cuando el estado de la Orden es PENDIENTE */}
                                                    {entrega.estado === 'Pendiente' && (
                                                        <div className="flex gap-2 text-center">
                                                            <Button
                                                                variant="success"
                                                                className="hover:bg-green-700 cursor-pointer focus:outline-none focus:shadow-outline"
                                                                onClick={() => abrirPrevisualizacionRemito(entrega)}
                                                            >
                                                                Confirmar Envío
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                                                                onClick={() => openCancelarModal(entrega)}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {/* Acciones - Cuando el estado de la Orden es ENVIADO */}
                                                    {entrega.estado === 'Enviado' && (
                                                        <div className="flex gap-2 text-center">
                                                            <Button
                                                                className="bg-sky-50 border border-sky-100 text-sky-700 hover:bg-sky-100 font-bold shadow-sm cursor-pointer px-3 py-4 focus:outline-none focus:shadow-outline"
                                                                onClick={() => {
                                                                setRemitoActual(entrega);
                                                                setModalRemitoAbierto(true);
                                                                }}
                                                            >
                                                                Mostrar Remito
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                                                                onClick={() => openCancelarModal(entrega)}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {/* Acciones - Cuando el estado de la Orden es CANCELADO */}
                                                    {entrega.estado === 'Cancelado' && entrega.cancelacion && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => toggleMostrarMotivo(entrega.id)}
                                                            className={`min-w-[150px] flex items-center gap-1 justify-center border px-3 py-4 font-medium shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none focus:shadow-outline
                                                                ${
                                                                    mostrarMotivo[entrega.id]
                                                                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
                                                                        : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                                                                }
                                                            `}
                                                        >
                                                            <motion.div
                                                                animate={{ rotate: mostrarMotivo[entrega.id] ? 180 : 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </motion.div>
                                                            {mostrarMotivo[entrega.id] ? "Ocultar motivo" : "Mostrar motivo"}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>

                                            {/* Animación con framer-motion */}
                                            {/* Detalle de los Productos asociados a la Orden */}
                                            <AnimatePresence>
                                                {expandedRows.includes(entrega.id) && (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="p-0 pb-2">
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
                                                                                        <td className="px-4 py-2 text-sm text-gray-700">{dateTimeFormat(producto.fecha_creacion)}</td>
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

                                                {/* Motivo Cancelación de la Orden */}
                                                <AnimatePresence>
                                                    {entrega.estado === 'Cancelado' && mostrarMotivo[entrega.id] && entrega.cancelacion && (
                                                        <TableRow>
                                                            <TableCell colSpan={8} className="p-0 pb-2">
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: "auto", opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    style={{ overflow: "hidden" }}
                                                                >
                                                                    <div className="bg-white shadow-inner border border-gray-200 rounded-b-md">
                                                                        <div className="p-1.5">
                                                                            <div className="overflow-x-auto">
                                                                                <table className="min-w-full divide-y divide-gray-300">
                                                                                    <thead className="bg-red-50 border-b border-red-600">
                                                                                        <tr>
                                                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Motivo de la cancelación</th>
                                                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className="bg-white divide-y divide-gray-200">

                                                                                        <tr className="hover:bg-gray-50">
                                                                                            <td className="px-4 py-2 text-sm text-gray-700">{entrega.cancelacion.motivo}</td>
                                                                                            {entrega.cancelacion.fecha && (
                                                                                            <td className="px-4 py-2 text-sm text-gray-700">{dateTimeFormat(entrega.cancelacion.fecha)}</td>
                                                                                            )}
                                                                                            {entrega.cancelacion.usuario && (
                                                                                            <td className="px-4 py-2 text-sm text-gray-700">{entrega.cancelacion.usuario || '-'}</td>
                                                                                            )}
                                                                                        </tr>

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

                                {/* Modal Previsualización datos del REMITO a generar */}
                                <Dialog open={modalGenerarRemito} onOpenChange={setModalGenerarRemito}>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Previsualización datos del remito a generar</DialogTitle>
                                        </DialogHeader>

                                        {entregaSeleccionada && (
                                            <div className="space-y-4 text-sm">
                                                <div><strong>Fecha:</strong> {new Date().toLocaleDateString()}</div>
                                                <div><strong>Origen:</strong> {entregaSeleccionada.origen}</div>
                                                <div><strong>Destino:</strong> {entregaSeleccionada.destino}</div>

                                                <div>
                                                <strong>Productos:</strong>
                                                <ul className="ml-4 list-disc">
                                                    {entregaSeleccionada.productos.map((producto: DetalleProducto, index: number) => (
                                                    <li key={index}>
                                                        {producto.nombre} - Cantidad: {producto.cantidad}
                                                    </li>
                                                    ))}
                                                </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button
                                                variant="success"
                                                className="hover:bg-green-700 cursor-pointer focus:outline-none focus:shadow-outline"
                                                onClick={() => {
                                                setModalGenerarRemito(false);
                                                setTimeout(() => entregaSeleccionada?.id && confirmarEnvio(entregaSeleccionada), 300); //Espera a que se cierre
                                                }}
                                            >
                                                Confirmar y generar remito
                                            </Button>
                                            <Button
                                                onClick={() => setModalGenerarRemito(false)}
                                                variant="destructive"
                                                className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* Modal Motivo de cancelación de la Orden */}
                                <Dialog open={modalOpen} onOpenChange={setModalOpen} modal={!modalBloqueado}>
                                    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                                        <DialogHeader>
                                            <DialogTitle>Cancelar orden #{entregaSeleccionada?.id}</DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <p>¿Estás seguro de que querés cancelar esta orden?</p>
                                            <Textarea
                                                placeholder="Motivo de la cancelación"
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                                disabled={modalBloqueado}
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                variant="destructive"
                                                className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    entregaSeleccionada?.id && confirmarCancelacion(entregaSeleccionada.id);
                                                }}
                                                disabled={!motivo.trim() || modalBloqueado}
                                            >
                                                Confirmar Cancelación
                                            </Button>
                                            <Button
                                                onClick={() => setModalOpen(false)}
                                                disabled={modalBloqueado}
                                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-3 py-4 cursor-pointer focus:outline-none focus:shadow-outline"
                                            >
                                                Cerrar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Modal para ver el REMITO ya generado de una Orden */}
                                {modalRemitoAbierto && remitoActual && (
                                <Dialog open={modalRemitoAbierto} onOpenChange={setModalRemitoAbierto}>
                                    <DialogContent className="max-w-5xl h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Remito #{String(remitoActual.id).padStart(8, "0")}</DialogTitle>
                                        </DialogHeader>

                                        <div className="mt-4 h-[75vh]">
                                            <iframe
                                                src={remitoActual ? route('remitos.mostrar', remitoActual.id) : ""}
                                                title="Remito PDF"
                                                width="100%"
                                                height="100%"
                                                style={{ border: "none" }}
                                            />
                                        </div>

                                        <DialogFooter className="mt-0">
                                            <Button
                                                onClick={() => setModalRemitoAbierto(false)}
                                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-3 py-4 cursor-pointer focus:outline-none focus:shadow-outline"
                                            >
                                                Cerrar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                )}
                            </Table>

                            {/* Información de paginación */}
                            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                                <div>
                                    Mostrando {entregas.meta.from} a {entregas.meta.to} de {entregas.meta.total} resultados
                                </div>
                                <div className="flex gap-1">
                                    {entregas.links.map((link: PaginationLink, index: number) => {
                                    let label = link.label;

                                    //Reemplaza claves de traducción por texto
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
