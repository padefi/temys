import { Button } from "@/Components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { usePermissions } from "@/composables/permissions";
import { ArrowDownWideNarrow, ArrowUpDown, ArrowUpNarrowWide } from "lucide-react";
import { StockItem } from "./Types";

interface Props {
  sortColumn: keyof StockItem | null;
  sortDirection: "asc" | "desc" | null;
  handleSort: (column: keyof StockItem) => void;
}

export function StockTableHeader({
  sortColumn,
  sortDirection,
  handleSort,
}: Props) {
  const { hasSubmenuPermission } = usePermissions();
  
  return (
    <TableHeader className="sticky-header"> 
      <TableRow>
        <TableHead className="text-center">Producto</TableHead>
        <TableHead className="text-center">Almacén Origen</TableHead>
        <TableHead className="text-center">
          <Button
            variant="ghost"
            className="w-full justify-center uppercase cursor-pointer select-none"
            onClick={() => handleSort("cantidad_actual")}
          >
            <span className="inline-flex items-center gap-1">
              Stock Actual
              {sortColumn === "cantidad_actual" ? (
                sortDirection === "asc" ? (
                  <ArrowUpNarrowWide className="ml-1 h-4 w-4 animate-bounce" />
                ) : (
                  <ArrowDownWideNarrow className="ml-1 h-4 w-4 animate-bounce" />
                )
              ) : (
                <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
              )}
            </span>
          </Button>
        </TableHead>

        {hasSubmenuPermission("inventarioFisico", "update") &&
          hasSubmenuPermission("inventarioFisico", "create") && (
            <>
              <TableHead className="text-center">Cantidades contadas</TableHead>
              <TableHead className="text-center">Diferencias</TableHead>
            </>
          )}

        <TableHead className="text-center">Estado</TableHead>
        <TableHead className="text-center">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}
