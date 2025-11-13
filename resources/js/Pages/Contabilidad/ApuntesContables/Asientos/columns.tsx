import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./column-header";
import { Asiento } from "@/types/Contabilidad/Asientos/Index";
import { currencyNumber, dateFormat } from "@/utils/formatterFunctions";
import BadgeEstadoAsiento from "@/Components/Contabilidad/ApuntesContables/BadgeEstadoAsiento";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        label: string;
    }
}

export const columns: ColumnDef<Asiento>[] = [
    {
        id: "fecha",
        accessorKey: "fecha",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha" />
        ),
        cell: ({ row }) => {
            return <div className="font-medium">{dateFormat(row.original.fecha)}</div>
        },
    },
    {
        id: "numero",
        accessorKey: "numero",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Número" />
        )
    },
    {
        id: "concepto",
        accessorKey: "concepto",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Concepto" />
        )
    },
    {
        id: "importe",
        accessorKey: "importe",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Total" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("importe"));
            return <div className="font-medium">{currencyNumber(amount)}</div>
        },
    },
    {
        id: "estado",
        accessorKey: "estado",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const state = row.original.estado;
            return <div className="font-medium">{<BadgeEstadoAsiento state={state} />}</div>
        },
    },
];