import { useMemo, useState } from "react";
import { StockItem } from "../../../types/Inventario";

export function useSortedAndPaginatedStock(
  stockFiltrado: StockItem[],
  itemsPerPage: number,
  currentPage: number
) {
  const [sortColumn, setSortColumn] = useState<keyof StockItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const sortedStock = useMemo(() => {
    if (!sortColumn || !sortDirection) return stockFiltrado;

    const sorted = [...stockFiltrado].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case "producto":
          aValue = a.producto.nombre.toLowerCase();
          bValue = b.producto.nombre.toLowerCase();
          break;
        case "cantidad_actual":
          aValue = a.cantidad_actual;
          bValue = b.cantidad_actual;
          break;
        case "stock_minimo":
          aValue = a.stock_minimo;
          bValue = b.stock_minimo;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [stockFiltrado, sortColumn, sortDirection]);

  const paginatedStock = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return sortedStock.slice(start, end);
  }, [sortedStock, currentPage, itemsPerPage]);

  const handleSort = (column: keyof StockItem) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
    } else {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    }
  };

  return {
    paginatedStock,
    sortedStock,
    sortColumn,
    sortDirection,
    handleSort,
  };
}
