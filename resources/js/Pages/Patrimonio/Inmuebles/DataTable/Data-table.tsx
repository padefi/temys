import { useState, useEffect, useMemo, Fragment } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
} from "@tanstack/react-table"
import type { Inmueble } from "@/types/Patrimonio/Inmuebles"
import { ExpandedRowContent } from "./ExpandendRow/ExpandendRowContent" 
import { Footer } from "@/Pages/UserModulePanel/footer"
import { useDataTableParams } from "@/hooks/useDataTableParams"

interface InmueblesTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  links?: any
  meta?: any
}

export default function DataTable<TData extends Inmueble, TValue>({
  columns: initialColumns,
  data: initialData,
  links,
  meta,
}: InmueblesTableProps<TData, TValue>) {
   const { params, updateParams, isLoading } = useDataTableParams();
  const [tableData, setTableData] = useState<TData[]>(initialData)
  const [expanded, setExpanded] = useState<ExpandedState>({})

  useEffect(() => {
    setTableData(initialData)
  }, [initialData])

  const columns = useMemo(() => {
    const expandColumn: ColumnDef<TData, TValue> = {
      id: "expand",
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" style={{ color: "#10b981" }} />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ),
      enableSorting: false,
    }
    return [expandColumn, ...initialColumns]
  }, [initialColumns])

  const table = useReactTable({
    data: tableData,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("cursor-pointer transition-colors", row.getIsExpanded() && "bg-muted/50")}
                  onClick={() => row.toggleExpanded()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      onClick={(e) => cell.column.id === "actions" && e.stopPropagation()}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                      <ExpandedRowContent row={row} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
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
    </div>
  )
}