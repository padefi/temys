import { useCuentasData, usePartidasData, useSaveAsiento } from "@/hooks/Contabilidad/ApuntesContables";
import { useEditableRow } from "@/hooks/Table/useEditableRow";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { DataTable } from "@/Components/Table";
import { EstadoAsiento, Partida, PartidaPageProps } from "@/types/Contabilidad/Asientos";
import { useMemo } from "react";
import { PartidasTableFooter } from "./footer";
import { toast } from "sonner";
import { useTypedPage } from "@/hooks/useTypedPage";

export default function TableContainer() {
    const { numero, fecha } = useTypedPage<PartidaPageProps>().props;
    const { partidas } = usePartidasData();
    const { cuentas } = useCuentasData();
    const { mutate: saveAsiento, isPending } = useSaveAsiento();
    const { tableData, editingRowId, editingColumnId, hasErrors, onAdd, onEdit, onSave, onCancel, onDelete, updateData, setFieldError, setEditingColumnId } =
        useEditableRow<Partida>({
            initialData: partidas,
            createEmptyRow: () => ({
                id: Date.now(),
                cuenta: { id: 0, codigo: "", descripcion: "", estado: true },
                concepto: "",
                debe: 0,
                haber: 0,
            }),
        });

    const columns = useMemo(() =>
        getColumns({
            editingRowId,
            hasErrors,
            onEdit,
            onSave,
            onCancel,
            onDelete,
            planCuentas: cuentas
        }), [editingRowId, hasErrors, cuentas, onSave, onEdit, onCancel, onDelete]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData,
            setFieldError,
            setEditingColumnId,
            editingRowId,
            editingColumnId,
            hasErrors,
        },
    });

    const { balanceado, totalAsiento } = useMemo(() => {
        const debe = tableData.reduce((acc, row) => acc + (Number(row.debe) || 0), 0);
        const haber = tableData.reduce((acc, row) => acc + (Number(row.haber) || 0), 0);

        return {
            balanceado: Math.abs(debe - haber) < 0.01 && debe > 0,
            totalAsiento: debe,
        };
    }, [tableData]);

    const handleSave = () => {
        if (!balanceado) return alert("El asiento desbalancea.");

        if (hasErrors || editingRowId !== null) {
            return toast.error("Por favor, termina de editar y corrige los errores en las filas.");
        }

        const payload = {
            id: numero,
            ejercicio: 1,
            numero: numero,
            estado: "PENDIENTE" as EstadoAsiento,
            fecha: fecha,
            concepto: "PRUEBA",
            importe: totalAsiento,
            partidas: tableData,
        };

        saveAsiento(payload);
    };

    return (
        <>
            <DataTable table={table}>
                <PartidasTableFooter
                    data={tableData}
                    onAdd={onAdd}
                    onSaveAll={handleSave}
                    isEditing={editingRowId !== null || isPending}
                    isPending={isPending}
                    hasErrors={hasErrors}
                    colSpan={table.getAllColumns().length}
                />
            </DataTable>

            {isPending && <div className="fixed inset-0 bg-black/10 z-50 pointer-events-none" />}
        </>
    );
}
