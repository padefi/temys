import { ColumnDef } from "@tanstack/react-table";
import { EntregaItem } from "./EntregasManagement";
import { DataTableColumnHeader } from "./colum-header";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from "lucide-react";
interface GetColumnsProps {
    abrirRemito: (entrega: EntregaItem) => void;
    toggleMostrarMotivo: (id: number) => void;
    cancelarModal: (entrega: EntregaItem) => void;
    mostrarMotivo: { [key: number]: boolean };
    setRemitoActual: React.Dispatch<React.SetStateAction<EntregaItem | null>>;
}


export const getColumns = ({ abrirRemito, toggleMostrarMotivo, cancelarModal, mostrarMotivo }: GetColumnsProps): ColumnDef<EntregaItem>[] => [
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
        header: "Fecha Envio",
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
        cell: ({ row }) => <div className="text-center">{row.getValue("estado")}</div>,
    },

        /*     {
            accessorKey: "productos",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="productos"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("productos")}</div>,
        }, */
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
                    isVisible={true}
                />
            )
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("fecha_creacion")}</div>,
    },
    {
        accessorKey: "usuario_creacion",
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
        cell: ({ row }) => <div className="text-center">{row.getValue("usuario_creacion")}</div>,
    },

   
  


    {
        accessorKey: "cancelacion",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
            return (
                <DataTableColumnHeader
                    column={column}
                    title="cancelacion"
                    disabled={disabled}
                    className="justify-center font-bold min-w-[90px]"
                    isVisible={true}
                />
            )
        },
        /* cell: ({ row }) => <div className="text-center">{row.getValue("cancelacion")}</div>, */
    },

    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const item = row.original;

            if (item.estado === 'Pendiente') {
                return (
                    <div className="flex gap-2 text-center">
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
                    <div className="flex gap-2 text-center">
                        <Button
                            className="bg-sky-50 border border-sky-100 text-sky-700 hover:bg-sky-100 font-bold shadow-sm cursor-pointer px-3 py-4 focus:outline-none focus:shadow-outline"
                        >
                            Mostrar Remito
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

            if (item.estado === 'Cancelado' && item.cancelacion) {
                return (
                    <Button
                        size="sm"
                        onClick={() => toggleMostrarMotivo(item.id)}
                        className={`min-w-[150px] flex items-center gap-1 justify-center border px-3 py-4 font-medium shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none focus:shadow-outline
            ${mostrarMotivo[item.id]
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                            }`}
                    >
                        <motion.div
                            animate={{ rotate: mostrarMotivo[item.id] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </motion.div>
                        {mostrarMotivo[item.id] ? "Ocultar motivo" : "Mostrar motivo"}
                    </Button>
                );
            }

            return null; // Para otros estados sin acciones
        },
        enableSorting: false,
    },




]