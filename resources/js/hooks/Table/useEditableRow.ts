import { useCallback, useMemo, useState } from "react";
import { NestedKeyOf, NestedKeyOfValue } from "@/types/nestedKeyOfTypes";
import { set } from "radash";

type IdType = number | null;
type Errors<T> = { [K in NestedKeyOf<T>]?: string | null };

interface UseEditableRowProps<T extends { id: IdType }> {
    initialData: T[];
    createEmptyRow: () => T;
    getRowId?: (row: T) => IdType;
}

export function useEditableRow<T extends { id: number }>({
    initialData,
    createEmptyRow,
    getRowId = (row) => row.id,
}: UseEditableRowProps<T>) {
    const [data, setData] = useState<T[]>(initialData);
    const [draftRow, setDraftRow] = useState<T | null>(null);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors<T>>({});
    const [isNewRow, setIsNewRow] = useState(false);
    const isEditing = editingRowId !== null;

    const tableData = useMemo(() => {
        if (editingRowId === null || !draftRow) return data;

        return data.map((row) =>
            getRowId(row) === editingRowId ? draftRow : row,
        );
    }, [data, editingRowId, draftRow]);

    const onAdd = () => {
        if (isEditing) return;

        const newRow = createEmptyRow();

        setErrors({});
        setData((old) => [...old, newRow]);
        setDraftRow(newRow);
        setEditingRowId(getRowId(newRow));
        setIsNewRow(true);
    };

    const updateData = <K extends NestedKeyOf<T>>(
        field: K,
        value: NestedKeyOfValue<T, K>,
    ) => {
        setDraftRow((old) => {
            if (!old) return old;
            return set(structuredClone(old), field, value);
        });
    };

    const setFieldError = <K extends NestedKeyOf<T>>(
        field: K,
        error: string | null,
    ) => {
        setErrors((old) => ({ ...old, [field]: error }));
    };

    const hasErrors = Object.values(errors).some(
        (e) => e !== null && e !== undefined,
    );

    const onEdit = (rowId: IdType) => {
        if (isEditing) return;

        const row = data.find((r) => r.id === rowId);
        if (!row) return;

        setErrors({});
        setDraftRow(structuredClone(row));
        setEditingRowId(rowId);
        setIsNewRow(false);
    };

    const onSave = useCallback(() => {
        if (!draftRow || editingRowId === null || hasErrors) return;

        setData((old) =>
            old.map((row) => (getRowId(row) === editingRowId ? draftRow : row)),
        );

        setErrors({});
        setDraftRow(null);
        setEditingRowId(null);
        setEditingColumnId(null);
        setIsNewRow(false);
    }, [draftRow, editingRowId, hasErrors, getRowId]);

    const onCancel = () => {
        if (isNewRow && editingRowId !== null) {
            setData((old) =>
                old.filter((row) => getRowId(row) !== editingRowId),
            );
        }

        setErrors({});
        setDraftRow(null);
        setEditingRowId(null);
        setEditingColumnId(null);
        setIsNewRow(false);
    };

    const onDelete = (rowId: number) => {
        setData((rows) => rows.filter((row) => getRowId(row) !== rowId));
    };

    return {
        tableData,
        rawData: data,
        setData,
        editingRowId,
        editingColumnId,
        isEditing,
        errors,
        hasErrors,
        onAdd,
        onEdit,
        onSave,
        onCancel,
        updateData,
        onDelete,
        setFieldError,
        setEditingColumnId,
    };
}
