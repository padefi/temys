import { ColumnDef } from "@tanstack/react-table";
import { EntregaItem } from "./EntregasManagement";
import { DataTableColumnHeader } from "./colum-header";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, Clock10, Eye, Truck, XCircle } from "lucide-react";

interface GetColumnsProps {
    abrirRemito: (entrega: EntregaItem) => void;
    mostrarRemito: (entrega: EntregaItem) => void;
    toggleExpandProductos: (id: number) => void;
    toggleExpandMotivo: (id: number) => void;
    cancelarModal: (entrega: EntregaItem) => void;
    expandedProductos: { [key: number]: boolean };
    expandedMotivos: { [key: number]: boolean };
    abrirModalSeguimiento: (idSeguimiento: number) => void
}

export const getColumns = ({
    abrirRemito,
    mostrarRemito,
    toggleExpandProductos,
    toggleExpandMotivo,
    cancelarModal,
    expandedProductos,
    expandedMotivos,
    abrirModalSeguimiento
}: GetColumnsProps): ColumnDef<EntregaItem>[] => [
        {
            accessorKey: "origen",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Origen"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("origen")}</div>,
        },
        {
            accessorKey: "destino",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Destino"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("destino")}</div>,
        },
        {
            accessorKey: "fecha_envio",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Fecha envio"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("fecha_envio")}</div>,
        },
        {
            accessorKey: "estado",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Estado"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => {
                const estado = row.getValue("estado") as string;

                return (
                    <div className="text-center">
                        {estado === "Entregado" && (
                            <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 ">
                                <CheckCircle2 className="inline h-4 w-4 mr-1" />
                                Entregado
                            </span>
                        )}

                        {estado === "Enviado" && (
                            <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                <Truck className="inline h-4 w-4 mr-1" />
                                Enviado
                            </span>
                        )}

                        {estado === "Pendiente" && (
                            <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                                <Clock10 className="inline h-4 w-4 mr-1" />
                                Pendiente
                            </span>
                        )}

                        {estado === "Cancelado" && (
                            <span className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                                <XCircle className="inline h-4 w-4 mr-1" />
                                Cancelado
                            </span>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "productos",
            header: "Productos",
            cell: ({ row }) => {
                const item = row.original;
                const isExpanded = expandedProductos[item.id];

                return (
                    <div className="flex justify-center">
                        <button
                            onClick={() => toggleExpandProductos(item.id)}
                            className={`min-w-[150px] h-1 flex items-center gap-1 justify-center border rounded-md px-3 py-4 font-medium shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none focus:shadow-outline
                            ${isExpanded
                                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                                }`}
                        >
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </motion.div>
                            {isExpanded ? "Ocultar detalle" : "Mostrar detalle"}
                        </button>
                    </div>
                );
            },
        },
        {
            accessorKey: "fecha_creacion",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Fecha Creacion"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={false}
                    />
                )
            },
            cell: ({ row }) => (
                <div className="text-center">
                    <div className="text-sm">
                        {new Date(row.getValue("fecha_creacion")).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {new Date(row.getValue("fecha_creacion")).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "UTC"
                        })}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "usuarioCreacion",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Usuario"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("usuarioCreacion")}</div>,
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                const item = row.original;

                if (item.estado === 'Pendiente') {
                    return (
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant="success"
                                className="hover:bg-green-700 cursor-pointer focus:outline-none focus:shadow-outline"
                                onClick={() => abrirRemito(item)}
                            >
                                Confirmar Envío
                            </Button>
                            <Button
                                variant="destructive"
                                className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                                onClick={() => cancelarModal(item)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    );
                }

                if (item.estado === 'Enviado') {
                    return (
                        <div className="flex gap-2 justify-center">
                            <Button
                                className="bg-sky-50 border border-sky-100 text-sky-700 hover:bg-sky-100 font-bold shadow-sm cursor-pointer px-3 py-4 focus:outline-none focus:shadow-outline"
                                onClick={() => mostrarRemito(item)}
                            >
                                Mostrar Remito
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-accent/10 cursor-pointer"
                                onClick={() => abrirModalSeguimiento(Number(item.id))}
                            >
                                <Eye className="h-4 w-4" />

                                Seguimiento
                            </Button>

                        </div>
                    );
                }

                if (item.estado === 'Cancelado' && item.cancelacion) {
                    const isExpanded = expandedMotivos[item.id];

                    return (
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => toggleExpandMotivo(item.id)}
                                className={`min-w-[150px] h-1 flex items-center gap-1 justify-center border px-3 py-4 font-medium shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none focus:shadow-outline
                                ${isExpanded
                                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
                                        : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                                    }
                            `}
                            >
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.div>
                                {isExpanded ? "Ocultar motivo" : "Mostrar motivo"}
                            </button>
                        </div>
                    );
                }



                return <div className="text-center text-gray-400">
                </div>;
            },
            enableSorting: false,
        },
    ];