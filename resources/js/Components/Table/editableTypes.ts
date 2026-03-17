import { Option } from "../SingleSelectSearchable";

export type ValidationRule<T = unknown> = (value: T) => true | string;

export type EditableColumnMeta<TValue = unknown, T = unknown> = {
    inputType?: "text" | "number" | "select";
    format?: (value: TValue) => React.ReactNode;
    rules?: ValidationRule<TValue>[];
    options?: Option[];
};
