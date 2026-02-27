import { TableFooter, TableRow, TableCell } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { currencyNumber } from "@/utils/formatterFunctions";
import { Partida } from "@/types/Contabilidad/Asientos";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

interface Props {
    data: Partida[];
    onAdd: () => void;
    onSaveAll: () => void;
    isEditing: boolean;
    isPending: boolean;
    hasErrors: boolean;
    colSpan: number;
}

export function PartidasTableFooter({ data, onAdd, onSaveAll, isEditing, isPending, hasErrors, colSpan }: Props) {
    const { totalDebe, totalHaber, balanceado } = useMemo(() => {
        const debe = data.reduce((acc, row) => acc + (Number(row.debe) || 0), 0);
        const haber = data.reduce((acc, row) => acc + (Number(row.haber) || 0), 0);
        return {
            totalDebe: debe,
            totalHaber: haber,
            balanceado: Math.abs(debe - haber) < 0.01 && debe > 0
        };
    }, [data]);

    const diff = Math.abs(totalDebe - totalHaber);

    return (
        <TableFooter className="sticky bottom-0 bg-background z-10">
            <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={2} />
                <TableCell className="text-right uppercase text-xs">
                    <div className="flex items-center">
                        <span className="font-bold">Total Debe:</span>
                        <span className={cn("text-sm font-bold", !balanceado ? "text-destructive" : "text-green-600")}>{currencyNumber(totalDebe)}</span>
                    </div>
                </TableCell>
                <TableCell className="text-right uppercase text-xs">
                    <div className="flex items-center">
                        <span className="font-bold">Total Haber:</span>
                        <span className={cn("text-sm font-bold", !balanceado ? "text-destructive" : "text-green-600")}>{currencyNumber(totalHaber)}</span>
                    </div>
                </TableCell>
                <TableCell />
            </TableRow>

            {!balanceado && totalDebe + totalHaber > 0 && (
                <TableRow className="bg-destructive/10">
                    <TableCell colSpan={colSpan} className="text-center text-destructive text-xs py-1">
                        El asiento está desbalanceado por: {currencyNumber(diff)}
                    </TableCell>
                </TableRow>
            )}

            <TableRow>
                <TableCell colSpan={colSpan}>
                    <div className='flex flex-col gap-2 pt-4'>
                        <Button variant="outline" className="w-full" onClick={onAdd} disabled={isEditing}>
                            + Agregar línea
                        </Button>
                        <Button
                            variant={balanceado ? "success" : "destructive"}
                            className="w-full"
                            onClick={onSaveAll}
                            disabled={!balanceado || isEditing || hasErrors}
                        >
                            {isPending ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <span>{balanceado ? "Guardar Asiento" : "Revisar Balance"}</span>
                            )}
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        </TableFooter>
    );
}