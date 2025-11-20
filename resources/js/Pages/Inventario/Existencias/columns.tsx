import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { Pencil, History } from "lucide-react";
import { DataTableColumnHeader } from "./column-header";
import { ExtendedExistenciasItem } from "@/types/Inventario/Reportes/Existencias"; 
import { Dispatch, SetStateAction } from "react";

interface GetColumnsProps {
  setIdProducto: Dispatch<SetStateAction<number | undefined>>;
  setAjusteDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleOpenWithFilter: (idProducto: number) => void;
}

export const getColumns = ({
  setIdProducto,
  setAjusteDialogOpen,
  handleOpenWithFilter,
}: GetColumnsProps): ColumnDef<ExtendedExistenciasItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
      header: ({column,table})=>{
      const disabled =(table.options.meta as {disabled:boolean})?.disabled || false;
      return(
        <DataTableColumnHeader
        column={column}
          title="Producto"
          disabled={disabled}
          className="justify-center font-bold min-w-[90px]"
          isVisible={true}
        />
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("nombre")}</div>,
  },
  {
    accessorKey: "categoria",
    header: ({column,table})=>{
      const disabled =(table.options.meta as {disabled:boolean})?.disabled || false;
      return(
        <DataTableColumnHeader
        column={column}
          title="Categoria del producto"
          disabled={disabled}
          className="justify-center font-bold min-w-[90px]"
          isVisible={true}
        />
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("categoria")}</div>,
  },
  {
    accessorKey: "cantidad_actual",
    header: ({ column, table }) => {
      const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
      return (
        <DataTableColumnHeader
          column={column}
          title="Existencia actual"
          disabled={disabled}
          className="justify-center font-bold min-w-[90px]"
          isVisible={false}
        />
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-center flex items-center justify-center gap-2">
          {item.cantidad_actual}
          {(item.cantidad_contada == 0 || item.cantidad_contada == null) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (item.producto_id) {
                  setIdProducto(item.producto_id);
                  setAjusteDialogOpen(true);
                }
              }}
            >
              <Pencil className="w-4 h-4 text-amber-500" />
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stockDisponible",
    header: "Existencia utilizable",
    cell: ({ row }) => <div className="text-center">{row.getValue("stockDisponible")}</div>,
  },
  {
    accessorKey: "entrada",
    header: "Entrante",
    cell: ({ row }) => <div className="text-center">{row.getValue("entrada")}</div>,
  },
  {
    accessorKey: "salida",
    header: "Saliente",
    cell: ({ row }) => <div className="text-center">{row.getValue("salida")}</div>,
  },
  {
    accessorKey: "stockEstimado",
    header: "Existencia estimada",
    cell: ({ row }) => <div className="text-center">{row.getValue("stockEstimado")}</div>,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10"
            onClick={() => handleOpenWithFilter(item.producto_id)}
          >
            <History className="h-4 w-4" /> Historial
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
