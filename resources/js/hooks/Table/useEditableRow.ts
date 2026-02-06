import { useMemo, useState } from "react";

export function useEditableRow<T extends { id?: number }>(initialData: T[]) {
    const [data, setData] = useState<T[]>(initialData);
    const [draftRow, setDraftRow] = useState<T | null>(null);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);

    const tableData = useMemo(() => {
        if (!editingRowId || !draftRow) return data;
        return data.map((row) => (row.id === editingRowId ? draftRow : row));
    }, [data, editingRowId, draftRow]);

    const updateData = (rowIndex: number, columnId: string, value: unknown) => {
        setDraftRow((old) => (old ? { ...old, [columnId]: value } : old));
    };

    const onEdit = (rowId: number) => {
        const row = data.find((r) => r.id === rowId);
        if (!row) return;

        setDraftRow(structuredClone(row));
        setEditingRowId(rowId);
    };

    const onSave = () => {
        if (!draftRow || !editingRowId) return;

        setData((old) =>
            old.map((row) => (row.id === editingRowId ? draftRow : row)),
        );

        onCancel();
    };

    const onCancel = () => {
        setDraftRow(null);
        setEditingRowId(null);
    };

    return {
        tableData,
        rawData: data,
        setData,
        editingRowId,
        onEdit,
        onSave,
        onCancel,
        updateData,
    };
}
