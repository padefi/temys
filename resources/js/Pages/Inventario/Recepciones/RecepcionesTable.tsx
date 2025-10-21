import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { RecepcionesItem } from "./RecepcionesManagement";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { useMemo } from "react";
import { getColumns } from "./Columns";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";

interface RecepcionTableProps {
  data: RecepcionesItem[];
  links: links;
  meta: meta;
}

export default function RecepcionesTable({
  data,
  links,
  meta,
}: RecepcionTableProps) {
  const { params, updateParams, isLoading } = useDataTableParams();


  const columns = useMemo(
    () => getColumns(),
    []
  );

  const table = useReactTable({
    data: data,
    columns,

    enableRowSelection: true,

    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });



  return (
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
  );
}
