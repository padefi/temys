import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';
import { getStockColumns } from './Columns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { AjusteSeleccionado } from '@/types/Inventario/Operaciones/InventarioFisico/Ajustes';
import { StockInventarioItem } from "@/types/Inventario/Operaciones/InventarioFisico/Stock"; 
import { usePermissions } from '@/composables/permissions';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { AjusteInventarioModal } from './modals/ModalConfirmarAjuste';
import { Footer } from '@/Pages/UserModulePanel/footer';
import { links } from '@/types/links';
import { meta } from '@/types/meta';
import { useDataTableParams } from '@/hooks/useDataTableParams';
import { DataTableSkeleton } from '@/Components/Table/AnimatedRows/DataTableSkeleton';

interface Props {
  data: StockInventarioItem[];
  links: links;
  meta: meta;
  setStock: React.Dispatch<React.SetStateAction<StockInventarioItem[]>>;
}

export function StockTable({
  data,
  links,
  meta,
  setStock,

}: Props) {
  const { params, updateParams, isLoading } = useDataTableParams();
  const { hasSubmenuPermission, hasRole } = usePermissions();
  const [ajusteSeleccionado, setAjusteSeleccionado] = useState<AjusteSeleccionado | null>(null);
  const [isModalOpenInventario, setIsModalOpenInventario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: number, field: string }[]>([]);
  const handleCellClick = (id: number, field: string) => {


    if (!editingCell.some(cell => cell.id === id && cell.field === field)) {
      setEditingCell([...editingCell, { id, field }]);
    }
  };



  const handleInputChange = (value: number, id: number, field: keyof StockInventarioItem) => {
    setStock(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
    setIsEditing(true)

  };

  /* 
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      id: number,
      field: keyof StockInventarioItem
    ) => {
      setIsEditing(true)
  
      const value = e.target.value;
      if (!/^\d+$/.test(value)) {
        toast.error("Solo se permiten números");
        return;
      }
      const num = Number(value);
      if (num === 0) {
        toast.error("El número no puede ser 0");
        return;
  
      }
      setStock(prev =>
        prev.map(item => item.id === id ? { ...item, [field]: num } : item)
      );
  
    };
   */


  const calculaDiferencia = (aMano: number, contada: number) => {
    if (contada > 0) {
      return (contada ?? aMano) - aMano;
    }
  };

  const handleAplicarFila = async (id: number) => {
    const row = data.find(item => item.id === id);

    if (!row) return;
    try {
      const response = await axios.post(`/actualizar-cantidad-contadas/${id}`, {
        cantidad_contada: row.cantidad_contada,
        motivo: 'Ajuste manual individual',
      });
      toast.success(response.data.message);

      setEditingCell([]);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Error al aplicar fila:", error);
    }
  };

  const handleLimpiarFila = (id: number) => {
    setStock(prev =>
      prev.map(item => item.id === id ? { ...item, cantidad_contada: 0 } : item)
    );

    setEditingCell(prev => prev.filter(cell => cell.id !== id));
  };


  const getStockStatus = (actual: any, minimo: any) => {
    if (actual === 0) return { status: "Sin stock", color: "destructive" };
    if (actual <= minimo) return { status: "Stock bajo", color: "custom" };
    if (actual <= minimo * 1.5)
      return { status: "Stock medio", color: "warning" };
    return { status: "Stock normal", color: "success" };
  };


  const columns = getStockColumns({
    editingCell,
    handleInputChange,
    handleCellClick,
    isEditing,
    setAjusteSeleccionado,
    setIsModalOpenInventario,
    hasSubmenuPermission,
    hasRole,
    calculaDiferencia,
    getStockStatus,
    handleAplicarFila,
    handleLimpiarFila
  });

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="text-center">
          {isLoading ? (
            <DataTableSkeleton columnCount={9} rowCount={5} showHeaders={false} />
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))) : (<TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>)}
        </TableBody>
      </Table>

      <Footer links={links} meta={meta} updateParams={updateParams} isLoading={isLoading} />

      {isModalOpenInventario && ajusteSeleccionado && (

        <AjusteInventarioModal
          isOpen={isModalOpenInventario}
          onClose={() => setIsModalOpenInventario(false)}
          idAjuste={ajusteSeleccionado.ajusteId}
          productoId={ajusteSeleccionado.productoId}
          onApprove={() => setIsModalOpenInventario(false)}
          onReject={() => setIsModalOpenInventario(false)}
        />
      )}
    </>
  );
}
