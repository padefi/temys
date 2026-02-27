import { RowData } from "@tanstack/react-table";
import { EditableColumnMeta } from "./editableTypes";

type UpdateDataFn<TData> = <K extends NestedKeyOf<TData>>(
    field: K,
    value: NestedKeyOfValue<TData, K>,
) => void;

type SetFieldErrorFn<TData> = <K extends NestedKeyOf<TData>>(
    field: K,
    error: string | null,
) => void;

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData?: UpdateDataFn<TData>;
        setFieldError?: SetFieldErrorFn<TData>;
        setEditingColumnId?: (columnId: string | null) => void;
        editingRowId?: number | null;
        editingColumnId?: string | null;
        hasErrors?: boolean;
    }

    interface ColumnMeta<
        TData extends RowData,
        TValue,
    > extends EditableColumnMeta<TValue> {}
}
