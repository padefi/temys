import { ColumnDef } from "@tanstack/react-table"
import { Partida } from "@/types/Contabilidad/Asientos/Index";
import { currencyNumber, dateFormat } from "@/utils/formatterFunctions";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        label: string;
    }
}

export const columns: ColumnDef<Partida>[] = [
    {
        id: "cuenta",
        header: "Cuenta",
        cell: ({ row }) => {
            const cuenta = row.original.cuenta;
            return (
                <div className="flex flex-col">
                    <span className="font-semibold">{cuenta.codigo}</span>
                    <span className="text-xs text-muted-foreground">
                        {cuenta.descripcion}
                    </span>
                </div>
            );
        },
    },
    {
        id: "concepto",
        accessorKey: "concepto",
    },
    {
        id: "debe",
        accessorKey: "debe",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("debe"));
            return <div className="font-medium">{currencyNumber(amount)}</div>
        },
    },
    {
        id: "haber",
        accessorKey: "haber",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("haber"));
            return <div className="font-medium">{currencyNumber(amount)}</div>
        },
    },
];