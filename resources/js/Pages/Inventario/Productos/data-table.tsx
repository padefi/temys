import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, CellContext } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Producto } from "./page";
import { toast } from "sonner";
import axios from "axios";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { RowEditable } from "./row-editable";
import { Footer } from "./footer";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { route } from 'ziggy-js';

interface DataTableProps {
  columns: ColumnDef<Producto>[];
  data: Producto[];
  links: links;
  meta: meta;
  modelos: { id: number; nombre: string }[];
  subcategorias: { id: number; nombre: string }[];
  newProduct: boolean;
  setNewProduct: (val: boolean) => void;
  editingNewIndex: number | null;
  cancelCreate: () => void;
  editingIndex: number | null;
  setEditingIndex: (val: number | null) => void;
}

export function DataTable({
  columns: initialColumns,
  data,
  links,
  meta,
  modelos,
  subcategorias,
  newProduct,
  setNewProduct,
  editingNewIndex,
  cancelCreate,
  editingIndex,
  setEditingIndex
}: DataTableProps) {
  const { params, updateParams, isLoading } = useDataTableParams();
  const [tableData, setTableData] = useState<Producto[]>(data);
  const footerRef = useRef<{ goToPage: (p: string | null) => void }>(null);
  const editRef = useRef<Partial<Producto>>({});
  const [editData, setEditData] = useState<Partial<Producto>>({});

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    if (newProduct && footerRef.current) {
      footerRef.current.goToPage(links.last);
    }
  }, [newProduct]);

  useEffect(() => {
    if (editingNewIndex !== null) {
      setEditingIndex(editingNewIndex);
      editRef.current = {}; // iniciar vacío
    }
  }, [editingNewIndex]);

  const handleUpdate = useCallback((updated: Producto) => {
    setTableData(prev =>
      prev.map(p => (p.id === updated.id || (newProduct && p.id === 0) ? updated : p))
    );
  }, [newProduct]);

  const handleSave = useCallback(async (producto: Producto) => {
    const payload = {
      ...producto,
      ...editData,
      referencia: String(editData.referencia ?? ''),
      cod_barras: String(editData.cod_barras ?? ''),
    };
  
    try {
      const response = newProduct
        ? await axios.post(route('productosInventario.store'), payload)
        : await axios.put(route('productosInventario.update', producto.id), payload);
  
      const updatedProduct = response.data.producto;
  
      setTableData(prev =>
        newProduct
          ? [...prev.filter(p => p.id !== 0), updatedProduct]
          : prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
      );
  
      toast.success(response.data.message || "Producto guardado correctamente");
      setEditingIndex(null);
      setNewProduct(false);
      setEditData({});
    } catch (error) {
      toast.error("Error al guardar producto");
    }
  }, [newProduct, editData]);

  /* const handleSave = useCallback(async (producto: Producto) => {
    const payload = {
        ...producto,
        ...editRef.current,
        referencia: String(producto.referencia ?? ''),
        cod_barras: String(producto.cod_barras ?? ''),
    };

    try {
        const response = newProduct
          ? await axios.post(route('productosInventario.store'), payload)
          : await axios.put(route('productosInventario.update', producto.id), payload);
    
        const updatedProduct = response.data.producto;
    
        setTableData(prev =>
          newProduct
            ? [...prev.filter(p => p.id !== 0), updatedProduct]
            : prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    
        toast.success(response.data.message || "Producto guardado correctamente");
        setEditingIndex(null);
        setNewProduct(false);
        editRef.current = {};
      } catch (error) {
        toast.error("Error al guardar producto");
      }
    }, [newProduct]); */

  const handleCancel = () => {
    if (newProduct) cancelCreate();
    setEditingIndex(null);
    editRef.current = {};
  };

  const handleChange = (columnId: keyof Producto, value: any) => {
    setEditData(prev => ({
      ...prev,
      [columnId]: value,
    }));
  };

  /* const handleChange = (columnId: keyof Producto, value: string | boolean | number | null) => {
    editRef.current = {
      ...editRef.current,
      [columnId]: value,
    };
  }; */

  const columns = useMemo(() => {
    return initialColumns.map(col => {
      return {
        ...col,
        cell: ({ getValue, row: { index, original }, column }: CellContext<Producto, any>) => {
          const isEditing = editingIndex === index;
          const value = getValue();

          if (col.id === 'actions') {
            return isEditing ? (
              <div className="flex gap-2">
                <button onClick={() => handleSave(original)} className="text-green-600">Guardar</button>
                <button onClick={handleCancel} className="text-red-600">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => {
                setEditingIndex(index);
                setEditData({ ...original });
                /* editRef.current = { ...original }; */
              }} className="text-blue-600">Editar</button>
            );
          }

          return isEditing ? (
            <RowEditable
              value={editData[column.id as keyof Producto] ?? value}
              type={column.columnDef.meta?.type || 'text'}
              columnId={column.id as keyof Producto}
              selectData={
                col.id === 'modelo_id'
                  ? modelos
                  : col.id === 'subcategoria_id'
                  ? subcategorias
                  : undefined
              }
              onChange={handleChange}
            />
          ) : (
            <span>{typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}</span>
          );
        },
      };
    });
  }, [editingIndex, modelos, subcategorias]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: Object.entries(params.filters).map(([id, value]) => ({ id, value })),
      sorting: params.sort ? [{ id: params.sort.replace('-', ''), desc: params.sort.startsWith('-') }] : [],
    },
    manualFiltering: true,
    manualSorting: true,
    meta: { disabled: editingIndex !== null },
  });

  return (
    <div>
      <div className="rounded-md border">
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
            {tableData.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">No hay productos.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Footer
        ref={footerRef}
        links={links}
        meta={meta}
        updateParams={updateParams}
        isLoading={isLoading}
        disabled={editingIndex !== null}
      />
    </div>
  );
}