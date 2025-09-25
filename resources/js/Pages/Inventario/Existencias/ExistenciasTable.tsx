import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { Footer } from "@/Pages/UserModulePanel/footer";
import { ExistenciaModal } from "./modals/ModalAjusteExistencia";
import { useState, useMemo } from "react";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { router } from "@inertiajs/react";
import { getColumns } from "./columns";
import { ExtendedExistenciasItem } from "@/types/Inventario";
import { ExistenciasItem } from "@/types/Inventario";

interface ExistenciaTableProps {
  data: ExistenciasItem[];
  links: links;
  meta: meta;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function ExistenciasTable({
  data,
  links,
  meta,
  selected,
  setSelected,
}: ExistenciaTableProps) {
  const { params, updateParams, isLoading } = useDataTableParams();
  const [idProducto, setIdProducto] = useState<number>();
  const [ajusteDialogOpen, setAjusteDialogOpen] = useState(false);

  const handleOpenWithFilter = (idProducto: number) => {
    router.visit(`/inventario/historialMoviminto/movimiento/${idProducto}`);
  };

  // Procesar datos
  const processedData = useMemo<ExtendedExistenciasItem[]>(() => {
    return data.map((item) => {
      const entrada = item.entrada || 0;
      const salida = item.salida || 0;
      const stockDisponible = item.cantidad_actual - (item.estadoEntregas === "pendiente" ? salida : 0);
      const stockEstimado = stockDisponible - salida + entrada;
      return { ...item, entrada, salida, stockDisponible, stockEstimado };
    });
  }, [data]);

  const columns = useMemo(
    () => getColumns({ setIdProducto, setAjusteDialogOpen, handleOpenWithFilter }),
    []
  );

  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      rowSelection: selected.reduce((acc, id) => {
        const rowIndex = processedData.findIndex((item) => item.id === id);
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
        .map((key) => processedData[parseInt(key)].id);
      setSelected(newSelectedIds);
    },
    getCoreRowModel: getCoreRowModel(),
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

      {ajusteDialogOpen && idProducto && (
        <ExistenciaModal isOpen={ajusteDialogOpen} onClose={() => setAjusteDialogOpen(false)} idProducto={idProducto} />
      )}
    </>
  );
}
