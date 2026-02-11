import { Column, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { EditableColumnMeta } from "./editableTypes";
import { runValidation } from "@/utils/validateFunctions";
import { AnimatedError } from "../AnimatedMotion/AnimatedError";
import { FloatingLabelInput } from "../ui/floating-label-input";

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
        setValue(initialValue);
    }, [initialValue]);

    if (!isEditing) {
        return (
            <span>
                {meta?.format
                    ? meta.format(initialValue)
                    : String(initialValue ?? "")}
            </span>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const finalValue = inputType === "number" ? Number(newValue) : newValue;
        const validationError = runValidation(finalValue, rules);

        setError(validationError);
        setValue(newValue);
    };

    return (
        <div className="grid items-center">
            <FloatingLabelInput
                id={column.id.toString()}
                label={column.id}
                type={inputType}
                className="text-sm"
                autoComplete="off"
                variant={error ? "error" : "underline"}
                value={value as any}
                onChange={handleChange}
            />
            <AnimatedError error={error} />
        </div>
    );
}
