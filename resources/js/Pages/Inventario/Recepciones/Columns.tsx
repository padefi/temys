import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, History } from "lucide-react";
import { DataTableColumnHeader } from "../Existencias/column-header";
import { ExtendedExistenciasItem } from "@/types/Inventario";
import { Dispatch, SetStateAction } from "react";
import { RecepcionesItem } from "./RecepcionesManagement";

interface GetColumnsProps {
    setIdProducto: Dispatch<SetStateAction<number | undefined>>;
    setAjusteDialogOpen: Dispatch<SetStateAction<boolean>>;
    handleOpenWithFilter: (idProducto: number) => void;
}

export const getColumns = (): ColumnDef<RecepcionesItem>[] => [
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
        cell: ({ row }) => <div className="text-center">{row.getValue("fechaRecepcion")}</div>,
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => <div className="text-center">{row.getValue("estado")}</div>,
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
                        /* onClick={() => handleOpenWithFilter(item.producto_id)} */
                        >
                            <History className="h-4 w-4" /> Historial
                        </Button>
                    </div>
                ) : null
            );

        },
        enableSorting: false,
    },

];
