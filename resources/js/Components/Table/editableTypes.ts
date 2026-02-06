export type EditableColumnMeta = {
    inputType?: "text" | "number";
    format?: (value: unknown) => React.ReactNode;
};
