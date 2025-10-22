import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { AjusteSeleccionado, StockInventarioItem } from "@/types/Inventario";
import { createColumnHelper } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { BrushCleaning, Clock10, Pencil, Save } from "lucide-react";

interface StockColumnProps {
  editingCell: { rowId: number; field: string } | null;
  handleCellClick: (id: number, field: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, id: number, field: keyof StockInventarioItem) => void;
  handleInputBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setAjusteSeleccionado: React.Dispatch<React.SetStateAction<AjusteSeleccionado | null>>;
  setIsModalOpenInventario: React.Dispatch<React.SetStateAction<boolean>>;
  hasSubmenuPermission: (menu: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  calculaDiferencia: (aMano: number, contada: number) => number | undefined;
  getStockStatus: (actual: number, minimo: number) => { status: string; color: string };
  editedRows: Record<number, number>;
  handleAplicarFila: (id: number) => void;
  handleLimpiarFila: (id: number) => void;
}



export const getStockColumns = ({
  editingCell,
  handleCellClick,
  handleInputChange,
  handleInputBlur,
  inputRef,
  setAjusteSeleccionado,
  setIsModalOpenInventario,
  hasSubmenuPermission,
  hasRole,
  calculaDiferencia,
  getStockStatus,
  editedRows,
  handleAplicarFila,
  handleLimpiarFila
}: StockColumnProps) => {
  const columnHelper = createColumnHelper<StockInventarioItem>();

  return [
    columnHelper.accessor(row => row.producto, {
      id: 'producto',
      header: 'Producto',
      cell: info => info.getValue()
    }),
    columnHelper.accessor(row => row.almacen, {
      id: 'almacen',
      header: 'Almacén',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('cantidad_actual', {
      header: 'Cantidad actual',
      cell: info => (
        <div className="flex items-center justify-center gap-2 font-mono">
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.display({
      id: 'cantidad_contada',
      header: 'Cantidad contada',
      cell: info => {
        const item = info.row.original;
        const isEditing = editingCell?.rowId === item.id && editingCell?.field === 'cantidad_contada';

        return (
          <div className="py-3 px-4 relative flex justify-center">
            {isEditing ? (
              <AnimatePresence initial={false} mode="popLayout">
                <input
                  ref={inputRef}
                  type="text"
                  onChange={(e) => handleInputChange(e, item.id, "cantidad_contada")}
                  onBlur={handleInputBlur}
                  disabled={
                    item.estado_ajuste === "nuevo" ||
                    !hasSubmenuPermission("inventarioFisico", "update")
                  }
                  className={`w-24 p-1 border border-neutral-200 rounded-md ${item.estado_ajuste === "nuevo" ||
                      !hasSubmenuPermission("inventarioFisico", "update")
                      ? "bg-neutral-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none"
                      : "focus:ring-2 focus:ring-neutral-300"
                    }`}
                />
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center gap-1 rounded-md w-24 h-9">
                {item.cantidad_contada !== 0 && item.cantidad_contada != null ? (
                  <span>{item.cantidad_contada}</span>
                ) : (
                  item.estado_ajuste !== "nuevo" &&
                  hasSubmenuPermission("inventarioFisico", "update") && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          initial={false}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCellClick(item.id, "cantidad_contada")}
                        >
                          <Pencil className="color: text-amber-500" />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Agregar cantidad</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                )}

                {item.estado_ajuste === "nuevo" &&
                  hasSubmenuPermission("inventarioFisico", "confirm") &&
                  hasRole("admin") && (
                    <span
                      className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.ajuste_id) {
                          setAjusteSeleccionado({
                            ajusteId: item.ajuste_id,
                            productoId: item.productoId,
                          });
                          setIsModalOpenInventario(true);
                        }
                      }}
                    >
                      <Clock10 className="inline h-4 w-4 mr-1" />
                      Pendiente
                    </span>
                  )}
              </div>
            )}
          </div>
        );
      }
    }),
    columnHelper.display({
      id: 'diferencia',
      header: 'Diferencia',
      cell: info => {
        const item = info.row.original;
        const diff = calculaDiferencia(item.cantidad_actual, item.cantidad_contada);
        const color =
          diff! > 0 ? 'text-green-600' :
            diff! < 0 ? 'text-red-600' :
              'text-gray-500';

        return <span className={`py-3 px-4 font-medium ${color}`}>{diff}</span>;
      }
    }),
    columnHelper.display({
      id: 'estado',
      header: 'Estado',
      cell: (info) => {
        const row = info.row.original; // tu objeto StockInventarioItem
        const stockStatus = getStockStatus(row.cantidad_actual, row.stock_minimo);

        return (
          <Badge variant={stockStatus.color as any}>
            {stockStatus.status}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => {
        const item = info.row.original;
        return editedRows[item.id] !== undefined ? (
          hasSubmenuPermission('inventarioFisico', 'update') && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAplicarFila(item.id)}
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" /> Aplicar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleLimpiarFila(item.id)}
                className="text-xs"
              >
                <BrushCleaning className="h-3 w-3 mr-1" /> Limpiar
              </Button>
            </div>
          )
        ) : (
          <span className="text-muted-foreground text-xs"></span>
        );
      }
    })
  ];
};
