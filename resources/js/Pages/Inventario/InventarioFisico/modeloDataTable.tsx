import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';
import { getStockColumns } from './Columns'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { AjusteSeleccionado, StockInventarioItem } from '@/types/Inventario';
import { usePermissions } from '@/composables/permissions';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { AjusteInventarioModal } from './modals/ModalConfirmarAjuste';

interface Props {
  stock: StockInventarioItem[];
  setStock: React.Dispatch<React.SetStateAction<StockInventarioItem[]>>;
  editedRows: Record<number, number>;
  setEditedRows: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export function StockTable({
  stock,
  setStock,
  editedRows,
  setEditedRows
}: Props) {
  const { hasSubmenuPermission, hasRole } = usePermissions();
  const [editingCell, setEditingCell] = useState<{ rowId: number; field: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ajusteSeleccionado, setAjusteSeleccionado] = useState<AjusteSeleccionado | null>(null);
  const [isModalOpenInventario, setIsModalOpenInventario] = useState(false);

  const handleCellClick = (id: number, field: string) => {
    setEditingCell({ rowId: id, field });
  };


  console.log(stock)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: keyof StockInventarioItem
  ) => {
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
    setEditedRows(prev => ({ ...prev, [id]: num }));
  };

  const handleInputBlur = () => {
    if (editingCell) {
      const editedItem = stock.find(item => item.id === editingCell.rowId);
      if (!editedItem) return;
    }
  };

  const calculaDiferencia = (aMano: number, contada: number) => {
    if (contada > 0) {
      return (contada ?? aMano) - aMano;
    }
  };

  const handleAplicarFila = async (id: number) => {
    const row = stock.find(item => item.id === id);
    if (!row) return;
    try {
      const response = await axios.post(`/actualizar-cantidad-contadas/${id}`, {
        cantidad_contada: row.cantidad_contada,
        motivo: 'Ajuste manual individual',
      });
      toast.success(response.data.message);
      const updated = { ...editedRows };
      delete updated[id];
      setEditedRows(updated);
      setEditingCell(null);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error("Error al aplicar fila:", error);
    }
  };

  const handleLimpiarFila = (id: number) => {
    setStock(prev =>
      prev.map(item => item.id === id ? { ...item, cantidad_contada: 0 } : item)
    );
    const updated = { ...editedRows };
    delete updated[id];
    setEditedRows(updated);
    setEditingCell(null);
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
  });

  const table = useReactTable({
    data: stock,
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
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
