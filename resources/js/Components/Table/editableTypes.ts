export type ValidationRule = (value: unknown) => true | string;

export type EditableColumnMeta = {
    inputType?: "text" | "number";
    format?: (value: unknown) => React.ReactNode;
    rules?: ValidationRule[];
};
