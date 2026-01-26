import { Checkbox } from "@/Components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MovimientosItem } from "@/types/Inventario/Reportes/HistorialMovimiento"; 
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Footer } from "@/Pages/UserModulePanel/footer";

interface MovimientosTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  links: links;
  meta: meta;
  editingIndex: number | null;
  setEditingIndex: (val: number | null) => void;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
}



export default function HistorialMovimientosTable<TData extends MovimientosItem, TValue>({
  columns: initialColumns,
  data: initialData,
  links,
  meta, selected, setSelected }: MovimientosTableProps<TData, TValue>) {
  const { params, updateParams, isLoading } = useDataTableParams();
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [tableData, setTableData] = useState<TData[]>(initialData);

  useEffect(() => {
    setTableData(initialData);
  }, [initialData]);


  const columns = useMemo(() => {
    return initialColumns.map(col => {
      return {
        ...col,
      }
    });
  }, [initialColumns]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      rowSelection: selected.reduce((acc, id) => {
        const rowIndex = tableData.findIndex((item) => item.id === id);
        if (rowIndex !== -1) acc[rowIndex] = true;
        return acc;
      }, {} as Record<string, boolean>),
      columnFilters: Object.entries(params.filters).map(([id, value]) => ({ id, value })),
      sorting: params.sort ? [{ id: params.sort.replace("-", ""), desc: params.sort.startsWith("-") }] : [],
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === "function" ? updater(table.getState().rowSelection) : updater;
      const newSelectedIds = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((key) => tableData[parseInt(key)].id);
      setSelected(newSelectedIds);
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader className="sticky-header">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="text-center">
          {isLoading ? (
            <DataTableSkeleton columnCount={9} rowCount={5} showHeaders={false} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Footer links={links} meta={meta} updateParams={updateParams} isLoading={isLoading} />

    </>
  );
}