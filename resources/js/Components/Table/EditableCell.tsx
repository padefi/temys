import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { EditableColumnMeta } from "./editableTypes";

type EditableCellProps<TData> = {
    getValue: () => unknown;
    row: Row<TData>;
    column: Column<TData>;
    table: Table<TData>;
    isEditing: boolean;
};

export function EditableCell<TData>({
    getValue,
    row,
    column,
    table,
    isEditing,
}: EditableCellProps<TData>) {
    const updateData = table.options.meta?.updateData;

    if (!updateData) {
        return null;
    }

    const initialValue = getValue();

    const meta = column.columnDef.meta as EditableColumnMeta | undefined;
    const inputType = meta?.inputType ?? "text";

    if (!isEditing) {
        return <span>{meta?.format ? meta.format(initialValue) : String(initialValue ?? "")}</span>;
    }

    const onBlur = () => {
        updateData(row.index, column.id, inputType === "number" ? Number(value) : value)
    }

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    return (
        <input
            type={inputType}
            value={value as any}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            className="border px-2 py-1 rounded w-full"
        />
    );
}
