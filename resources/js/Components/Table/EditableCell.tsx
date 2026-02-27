import { Column, Getter, Row, Table } from "@tanstack/react-table";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { EditableColumnMeta } from "./editableTypes";
import { runValidation } from "@/utils/validateFunctions";
import { AnimatedError } from "../AnimatedMotion/AnimatedError";
import { FloatingLabelInput } from "../ui/floating-label-input";
import { NestedKeyOf, NestedKeyOfValue } from "@/types/nestedKeyOfTypes";
import SingleSearchableSelect from "../SingleSelectSearchable";

type EditableCellProps<TData, TValue> = {
    getValue: Getter<TValue>;
    row: Row<TData>;
    column: Column<TData>;
    table: Table<TData>;
    isEditing: boolean;
};

export function EditableCell<TData, TValue extends string | number>({
    getValue,
    row,
    column,
    table,
    isEditing,
}: EditableCellProps<TData, TValue>) {
    const initialValue = getValue();
    const [value, setValue] = useState(String(initialValue ?? ""));
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateData = table.options.meta?.updateData;
    const setFieldError = table.options.meta?.setFieldError;
    const setEditingColumnId = table.options.meta?.setEditingColumnId;
    const editingColumnId = table.options.meta?.editingColumnId;

    const meta = column.columnDef.meta as EditableColumnMeta<TValue> | undefined;
    const { inputType, rules, options = [] } = meta ?? {};

    useEffect(() => {
        const rawValue = String(initialValue ?? "");
        setValue(rawValue);

        const parsedValue = inputType === "number" ? Number(rawValue) : rawValue;
        const validationError = runValidation(parsedValue as TValue, rules);

        setError(validationError);
    }, [initialValue]);

    useEffect(() => {
        if (!isEditing) return;
        if (editingColumnId !== column.id) return;

        inputRef.current?.focus();
    }, [isEditing, editingColumnId]);

    if (!isEditing) {
        return (
            <span>
                {meta?.format ? meta.format(initialValue) : String(initialValue ?? "")}
            </span>
        );
    }

    const handleChangeSelect = (id: string) => {
        const fieldPath = column.id as NestedKeyOf<TData>;
        updateData?.(fieldPath, id as NestedKeyOfValue<TData, typeof fieldPath>);
    };

    if (isEditing && inputType === "select") {
        return (
            <div className="grid items-center [&_button]:w-full">
                <SingleSearchableSelect
                    value={value}
                    options={options}
                    onChange={handleChangeSelect}
                />
            </div>
        );
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const parsedValue = inputType === "number" ? Number(rawValue) : rawValue;
        const validationError = runValidation(parsedValue as TValue, rules);

        setError(validationError);
        setValue(rawValue);

        const fieldPath = column.id as NestedKeyOf<TData>;

        setFieldError?.(fieldPath, validationError);
        updateData?.(fieldPath, parsedValue as NestedKeyOfValue<TData, typeof fieldPath>);
    };

    return (
        <div className="grid items-center">
            <FloatingLabelInput
                ref={inputRef}
                id={column.id}
                label={column.id}
                type={inputType}
                className="text-sm"
                autoComplete="off"
                variant={error ? "error" : "underline"}
                value={(value)}
                onChange={handleChange}
                onFocus={() => setEditingColumnId?.(column.id)}
            />
            <AnimatedError error={error} />
        </div>
    );
}
