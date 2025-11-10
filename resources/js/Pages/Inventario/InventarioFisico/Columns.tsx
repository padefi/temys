import { Badge } from "@/Components/ui/badge";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { AjusteSeleccionado, StockInventarioItem } from "@/types/Inventario";
import { createColumnHelper } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { BrushCleaning, Clock10, Pencil, Save } from "lucide-react";
import { DataTableColumnHeader } from "../Existencias/column-header";
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";

interface StockColumnProps {
  editingCell: { id: number; field: string }[];
  handleCellClick: (id: number, field: string) => void;
  handleInputChange: (
    value: number,
    id: number,
    field: keyof StockInventarioItem
  ) => void;
  isEditing: boolean,
  setAjusteSeleccionado: React.Dispatch<React.SetStateAction<AjusteSeleccionado | null>>;
  setIsModalOpenInventario: React.Dispatch<React.SetStateAction<boolean>>;
  hasSubmenuPermission: (menu: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  calculaDiferencia: (aMano: number, contada: number) => number | undefined;
  getStockStatus: (actual: number, minimo: number) => { status: string; color: string };
  handleAplicarFila: (id: number) => void;
  handleLimpiarFila: (id: number) => void;
}

export const getStockColumns = ({
  editingCell,
  handleCellClick,
  handleInputChange,
  isEditing,
  setAjusteSeleccionado,
  setIsModalOpenInventario,
  hasSubmenuPermission,
  hasRole,
  calculaDiferencia,
  getStockStatus,
  handleAplicarFila,
  handleLimpiarFila
}: StockColumnProps) => {
  const columnHelper = createColumnHelper<StockInventarioItem>();

  return [
    columnHelper.accessor(row => row.producto, {
      id: 'producto',
      header: ({ column, table }) => {
        const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
        return (
          <DataTableColumnHeader
            column={column}
            title="Producto"
            disabled={disabled}
            className="justify-center font-bold min-w-[90px]"
            isVisible={true}
          />
        )
      },

      cell: info => info.getValue()
    }),
    columnHelper.accessor(row => row.almacen, {
      id: 'almacen',
      header: ({ column, table }) => {
        const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
        return (
          <DataTableColumnHeader
            column={column}
            title="Almacén"
            disabled={disabled}
            className="justify-center font-bold min-w-[90px]"
            isVisible={true}
          />
        )
      },

      cell: info => info.getValue()
    }),
    columnHelper.accessor('cantidad_actual', {
      header: ({ column, table }) => {
        const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
        return (
          <DataTableColumnHeader
            column={column}
            title="Cantidad actual"
            disabled={disabled}
            className="justify-center font-bold min-w-[90px]"
            isVisible={false}
          />
        )
      },

      cell: info => (
        <div className="flex items-center justify-center gap-2 font-mono">
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.display({
      id: 'cantidad_contada',
      header: ({ column, table }) => {
        const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
        return (
          <DataTableColumnHeader
            column={column}
            title="Cantidad contada"
            disabled={disabled}
            className="justify-center font-bold min-w-[90px]"
            isVisible={false}
          />
        )
      },

      cell: info => {
        const item = info.row.original;
        const [tempValue, setTempValue] = useState(item.cantidad_contada);

        const isEditing = editingCell?.some(
          cell => cell.id === item.id && cell.field === "cantidad_contada"
        );

        useEffect(() => {
          if (!isEditing) setTempValue(item.cantidad_contada);
        }, [item.cantidad_contada, isEditing]);
        return (
          <div className="py-3 px-4 relative flex justify-center">
            {hasSubmenuPermission('inventarioFisico', 'update') && hasSubmenuPermission('inventarioFisico', 'create') &&
              isEditing ? (
              <AnimatePresence initial={false} mode="popLayout">
                <input
                  type="number"
                  value={tempValue}
                  onChange={e => setTempValue(Number(e.target.value))}
                  onBlur={() => {
                    handleInputChange(tempValue, item.id, "cantidad_contada");
                  }}
                  className="w-24 p-1 border border-neutral-200 rounded-md"
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
            )
            }
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
        const row = info.row.original;
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
        const visible = editingCell?.some(
          cell => cell.id === item.id && cell.field === 'cantidad_contada'
        );
        return (isEditing && visible) && (
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
        ) || (
            <span className="text-muted-foreground text-xs"></span>
          );

      }
    })
  ];
};
