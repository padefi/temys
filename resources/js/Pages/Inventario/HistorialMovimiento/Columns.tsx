import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/components/ui/button"; /* from "@/Components/ui/button"; */
import { Pencil, History } from "lucide-react";
import { DataTableColumnHeader } from "../Existencias/column-header";
import { MovimientosItem } from "@/types/Inventario";
import { Dispatch, SetStateAction } from "react";

interface GetColumnsProps {
    setIdProducto: Dispatch<SetStateAction<number | undefined>>;
    setAjusteDialogOpen: Dispatch<SetStateAction<boolean>>;
    handleOpenWithFilter: (idProducto: number) => void;
}

export const columns: ColumnDef<MovimientosItem>[] = [
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
            accessorKey: "fecha",
            header: 'Fecha',
            cell: ({ row }) => <>
                <div className="text-sm">
                    {new Date(row.getValue("fecha")).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
                <div className="text-xs text-muted-foreground">
                    {new Date(row.getValue("fecha")).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC"
                    })}
                </div>
            </>,
        },
        {
            accessorKey: "nombreProducto",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Producto"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                )
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("nombreProducto")}</div>,
        },
        {
            accessorKey: "tipo_movimiento",
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Tipo movimiento"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={false}
                    />
                );
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("tipo_movimiento")}</div>,
        },
        {
            accessorKey: "origen",
            /* header: "Existencia Origen", */
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
                );
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("origen")}</div>,
        },
        {
            accessorKey: "destino",
            /* header: "Destino", */
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
                );
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("destino")}</div>,
        },
        {
            accessorKey: "usuarioCreacion",
           /*  header: "Hecho por", */
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Hecho por"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={true}
                    />
                );
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("usuarioCreacion")}</div>,
        },
        {
            accessorKey: "cantidad",
           /*  header: "Cantidad", */
            header: ({ column, table }) => {
                const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
                return (
                    <DataTableColumnHeader
                        column={column}
                        title="Cantidad"
                        disabled={disabled}
                        className="justify-center font-bold min-w-[90px]"
                        isVisible={false}
                    />
                );
            },
            cell: ({ row }) => <div className="text-center">{row.getValue("cantidad")}</div>,
        },

    ];
