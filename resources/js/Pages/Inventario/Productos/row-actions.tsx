import { Button } from "@/Components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface RowActionsProps {
  onEdit: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const RowActions = ({ onEdit, onDelete, disabled }: RowActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={onEdit} disabled={disabled}>
        <Pencil className="w-4 h-4 text-blue-500" />
      </Button>
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete} disabled={disabled}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      )}
    </div>
  );
};
