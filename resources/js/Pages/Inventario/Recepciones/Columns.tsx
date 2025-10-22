import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { History, ChevronRight, ChevronDown, PackageCheck } from "lucide-react";
import { DataTableColumnHeader } from "../Existencias/column-header";
import { RecepcionesItem } from "./RecepcionesManagement";
import { Badge } from "lucide-react";

interface GetColumnsProps {
    onAbrirModal: (recepcion: RecepcionesItem) => void;
}

export const getColumns = ({ onAbrirModal }: GetColumnsProps): ColumnDef<RecepcionesItem>[] => [
    {
        id: "expander",
        header: "",
        cell: ({ row }) => {
            return (
                <button
                    onClick={row.getToggleExpandedHandler()}
                    className="flex justify-center items-center w-full pointer"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </button>
            );
        },
    },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (

            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />


        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        accessorKey: "fechaRecepcion",
        header: "Fecha Recepcion",
        cell: ({ row }) => <div className="text-center">{
            <>
                <div className="text-sm">
                    {new Date(row.getValue("fechaRecepcion")).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
                <div className="text-xs text-muted-foreground">
                    {new Date(row.getValue("fechaRecepcion")).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC"
                    })}
                </div>

            </>

        }</div>,
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string;

            const estadoConfig = {
                pendiente: {
                    class: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    label: "Pendiente"
                },
                parcial: {
                    class: "bg-blue-100 text-blue-800 border-blue-300",
                    label: "Parcial"
                },
                completa: {
                    class: "bg-green-100 text-green-800 border-green-300",
                    label: "Completa"
                }
            };

            const config = estadoConfig[estado.toLowerCase() as keyof typeof estadoConfig] || {
                class: "bg-gray-100 text-gray-800 border-gray-300",
                label: estado
            };

            return (
                <div className="text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.class}`}>
                        {config.label}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "tipoRecepcion",
        header: "Tipo recepcion",
        cell: ({ row }) => <div className="text-center">{row.getValue("tipoRecepcion")}</div>,
    },
    {
        accessorKey: "usuarioCreacion",
        header: "Usuario",
        cell: ({ row }) => <div className="text-center">{row.getValue("usuarioCreacion")}</div>,
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const item = row.original;

            return (
                item.estado === "Pendiente" ? (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-accent/10"
                            onClick={() => onAbrirModal(item)}
                        >
                            <PackageCheck className="h-4 w-4" />
                            Contar y Verificar
                        </Button>
                    </div>
                ) : null
            );

        },
        enableSorting: false,
    },

];
