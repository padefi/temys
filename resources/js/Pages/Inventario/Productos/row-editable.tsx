import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";

type RowEditableType = "text" | "number" | "select" | "boolean" | "email" | "date";

interface RowEditableProps {
  value: any;
  type: RowEditableType;
  columnId: string;
  selectData?: { id: number; nombre: string }[];
  onChange: (columnId: any, value: any) => void;
}

export const RowEditable = ({ value, type, columnId, selectData = [], onChange }: RowEditableProps) => {
  switch (type) {
    case "select":
      return (
        <Select
            value={String(value ?? "")}
            onValueChange={(val) => onChange(columnId, val ? parseInt(val) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {selectData.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={columnId}
            checked={!!value}
            onCheckedChange={(checked) => onChange(columnId, !!checked)}
          />
          <Label htmlFor={columnId}>{value ? "Sí" : "No"}</Label>
        </div>
      );

    case "number":
        return (
            <Input
            type="number"
            value={value ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onChange(columnId, val === "" ? null : parseFloat(val));
            }}
          />
        );

    case "text":
    default:
      return (
        <Input
        type="text"
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(e) => onChange(columnId, e.target.value)}
        />
      );
  }
};
