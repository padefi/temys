import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ChevronRight, ChevronDown, PackageCheck, Eye } from "lucide-react";
import { DataTableColumnHeader } from "../Existencias/column-header";
import { RecepcionesItem} from "./RecepcionesManagement";


interface GetColumnsProps {
    onAbrirModal: (recepcion: RecepcionesItem) => void;
    abrirModalSeguimiento: (idSeguimiento: number) => void
}

export const getColumns = ({ onAbrirModal, abrirModalSeguimiento }: GetColumnsProps): ColumnDef<RecepcionesItem>[] => [
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
        accessorKey: "fecha_recepcion",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Fecha Recepcion"
                    disabled={disabled}
                    className="justify-center font-bold min-w-[90px]"
                    isVisible={true}
                />
            )
        },
        cell: ({ row }) => <div className="text-center">{
            <>
                <div className="text-sm">
                    {new Date(row.getValue("fecha_recepcion")).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
                <div className="text-xs text-muted-foreground">
                    {new Date(row.getValue("fecha_recepcion")).toLocaleTimeString("es-ES", {
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
                    class: "bg-yellow-100 text-yellow-800 ",
                    label: "Pendiente"
                },
                parcial: {
                    class: "bg-blue-100 text-blue-800",
                    label: "Parcial"
                },
                completa: {
                    class: "bg-green-100 text-green-800",
                    label: "Completa"
                },
                 cancelado: {
                    class: "bg-red-100 text-red-800",
                    label: "Cancelado"
                }
            };

            const config = estadoConfig[estado.toLowerCase() as keyof typeof estadoConfig] || {
                class: "bg-gray-100 text-gray-800 border-gray-300",
                label: estado
            };

            return (
                <div className="text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${config.class}`}>
                        {config.label}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "tipo_recepcion",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
            return (
                <DataTableColumnHeader
                    column={column}
                    title="Tipo Recepcion"
                    disabled={disabled}
                    className="justify-center font-bold min-w-[90px]"
                    isVisible={true}
                />
            )
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("tipo_recepcion")}</div>,
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
                <>
                   { item.estado_orden_entrega=== "Enviado" ? (
                    <div className="text-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-accent/10  cursor-pointer mb-2"
                            onClick={() => onAbrirModal(item)}
                        >
                            <PackageCheck className="h-4 w-4" />
                            Contar y Verificar
                        </Button>

                    </div>
                    ) : null}

                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-accent/10 cursor-pointer"
                        onClick={() => abrirModalSeguimiento(Number(item.orden_id))}
                    >
                        <Eye className="h-4 w-4" />

                        Seguimiento
                    </Button>
                </>

            );

        },
        enableSorting: false,
    },

];
