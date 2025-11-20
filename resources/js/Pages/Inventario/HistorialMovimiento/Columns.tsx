import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { DataTableColumnHeader } from "../Existencias/column-header";
import { MovimientosItem } from "@/types/Inventario/Reportes/HistorialMovimiento";
import { Dispatch, SetStateAction } from "react";


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
        cell: ({ row }) => {
            const item = row.original;
    
            // movimientos positivos
            const positivos = ['recepcion', 'ajuste', 'orden_compra'];

            // movimientos negativos
            const negativos = ['orden_entrega']; 

            return (
                <>
                    {positivos.includes(item.tipo_movimiento) && (
                        <div className="text-green-600 dark:text-green-400 font-semibold">+{row.getValue("cantidad")}</div>
                    )}

                    {negativos.includes(item.tipo_movimiento) && (
                        <div className="text-red-600 dark:text-red-400 font-semibold">-{row.getValue("cantidad")}</div>
                    )}
                </>
            );
        }

    },

];
