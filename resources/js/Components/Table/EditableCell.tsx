import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { EditableColumnMeta } from "./editableTypes";
import { runValidation } from "@/utils/validateFunctions";

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
    if (!updateData) return null;

    const initialValue = getValue();
    const meta = column.columnDef.meta as EditableColumnMeta | undefined;
    const rules = meta?.rules;
    const inputType = meta?.inputType ?? "text";

    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    if (!isEditing) {
        return <span>{meta?.format ? meta.format(initialValue) : String(initialValue ?? "")}</span>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const finalValue = inputType === "number" ? Number(newValue) : newValue;
        const validationError = runValidation(finalValue, rules);
        console.log(newValue);

        setError(validationError);
        setValue(newValue);
    };

    const handleBlur = () => {
        if (error) return;

        const finalValue = inputType === "number" ? Number(value) : value;
        updateData(row.index, column.id, finalValue);
    };

    return (
        <div className="flex flex-col gap-1">
            <input
                type={inputType}
                value={value as any}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`border px-2 py-1 rounded w-full ${error ? "border-red-500" : ""}`}
            />

            {error && (
                <span className="text-xs text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}
