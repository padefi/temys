import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';
import { links } from '@/types/links';
import { meta } from '@/types/meta';

export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  modelo_id: number | null;
  subcategoria_id: number | null;
  peso: number | null;
  alto: number | null;
  ancho: number | null;
  volumen: number | null;
  profundidad: number | null;
  cod_barras: string;
  referencia: string;
  es_inventario: boolean;
  es_patrimonio: boolean;
};

import { PageProps as InertiaPageProps } from '@inertiajs/core';

type PageProps = InertiaPageProps & {
  productos: {
    data: Producto[];
    links: links;
    meta: meta;
  };
  modelos: { id: number; nombre: string }[];
  subcategorias: { id: number; nombre: string }[];
};

export default function ProductosPage() {
  const { productos, modelos, subcategorias } = usePage<PageProps>().props;
  const [data, setData] = useState<Producto[]>(productos.data);
  const [newProduct, setNewProduct] = useState(false);
  const [editingNewIndex, setEditingNewIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setData(productos.data); // sincroniza si cambia por navegación
  }, [productos.data]);

  const handleAdd = () => {
    if (data.some(p => p.id === 0)) {
      toast.error("Ya estás creando un producto nuevo");
      return;
    }

    const nuevo: Producto = {
      id: 0,
      nombre: '',
      descripcion: '',
      modelo_id: null,
      subcategoria_id: null,
      peso: 0,
      alto: 0,
      ancho: 0,
      volumen: 0,
      profundidad: 0,
      cod_barras: '',
      referencia: '',
      es_inventario: false,
      es_patrimonio: false,
    };

    setData(prev => [...prev, nuevo]);
    setNewProduct(true);
    setEditingNewIndex(data.length); // apunta al nuevo índice
  };

  const cancelCreate = () => {
    setData(prev => prev.filter(p => p.id !== 0));
    setNewProduct(false);
    setEditingNewIndex(null);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Productos" />
      <div className="mx-auto py-12 max-w-7xl sm:px-6 lg:px-8">
        <div className="bg-white p-6 shadow rounded">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Productos</h1>
            <Button variant="outline" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo producto
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={data}
            links={productos.links}
            meta={productos.meta}
            modelos={modelos}
            subcategorias={subcategorias}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            editingNewIndex={editingNewIndex}
            cancelCreate={cancelCreate}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}