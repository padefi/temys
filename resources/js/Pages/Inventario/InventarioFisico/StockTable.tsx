import {Table,TableBody} from "@/Components/ui/table";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import React, { useEffect, useState } from "react";
import { StockTableHeader } from "./StockTableHeader";
import { StockTableRow } from "./StockTableRow";
import { StockItem } from "./Types";
import { useSortedAndPaginatedStock } from "./useSortedAndPaginatedStock";
interface Props {
  stockFiltrado: StockItem[];
  stocks: {
    data: StockItem[];
  };
  editedRows: Record<number, number>;
  setEditedRows: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export function StockTable({
  stockFiltrado,
  stocks,
  editedRows,
  setEditedRows
}: Props) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState<StockItem[]>([]);
  const {
    paginatedStock,
    sortColumn,
    sortDirection,
    handleSort,
  } = useSortedAndPaginatedStock(stockFiltrado, itemsPerPage, currentPage);

  const getStockStatus = (actual: any, minimo: any) => {
    if (actual === 0) return { status: "Sin stock", color: "destructive" };
    if (actual <= minimo) return { status: "Stock bajo", color: "custom" };
    if (actual <= minimo * 1.5)
      return { status: "Stock medio", color: "warning" };
    return { status: "Stock normal", color: "success" };
  };

  useEffect(() => {
    setStock(stocks.data);
    setIsLoading(false)
  }, [stocks]);

  return (
    <Table>
      <StockTableHeader sortColumn={sortColumn} sortDirection={sortDirection} handleSort={handleSort}></StockTableHeader>
      <TableBody className="text-center">
        {isLoading ? (
          <DataTableSkeleton columnCount={6} rowCount={5} showHeaders={false}></DataTableSkeleton>
        ) : (
          paginatedStock.map((item: StockItem , index: number) => {
            const stockStatus = getStockStatus(item.cantidad_actual, item.stock_minimo);        
            return (
              <StockTableRow  key={item.id} item={item} index={index} stock={stock} setStock={setStock} stockStatus={stockStatus} editedRows={editedRows} setEditedRows={setEditedRows}></StockTableRow>             
            )
          })
        )}
      </TableBody>
    </Table>

  )

}
