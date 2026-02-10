import { usePartidasData } from "@/hooks/Contabilidad/ApuntesContables";
import { useEditableRow } from "@/hooks/Table/useEditableRow";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { DataTable } from "@/Components/Table";
import { Partida } from "@/types/Contabilidad/Asientos";

export default function TableContainer() {
    const { partidas } = usePartidasData();

    const { tableData, editingRowId, onEdit, onSave, onCancel, updateData } =
        useEditableRow<Partida>(partidas);

    const table = useReactTable({
        data: tableData,
        columns: getColumns({
            editingRowId,
            onEdit,
            onSave,
            onCancel,
        }),
        getCoreRowModel: getCoreRowModel(),
        meta: { updateData },
    });

    return <DataTable table={table} />;
}
