import { useEditableRow } from "@/hooks/Table/useEditableRow";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getColumns } from "./columns";
import { DataTable } from "@/Components/Table";
import { Partida } from "@/types/Contabilidad/Asientos/Partida";
import getData from "./get-data";

export default function TableContainer() {
  const initialData = getData();

  const {
    tableData,
    editingRowId,
    onEdit,
    onSave,
    onCancel,
    updateData,
  } = useEditableRow<Partida>(initialData);

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
