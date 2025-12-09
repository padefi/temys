import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { toast } from "sonner";
import { useState } from "react";

export default function Index() {
  const { productos, flash, modulo } = usePage().props as any;
  const [search, setSearch] = useState("");

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.get(route(`productos.index`), { search }, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      router.delete(route('productos.destroy', id), {
        onSuccess: () => toast.success("Producto eliminado correctamente"),
        onError: () => toast.error("Error al eliminar producto"),
      });
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800 capitalize">
      {modulo} / Productos
    </h2>}>
      <Head title={`Productos (${modulo})`} />

      <div className="p-6 space-y-6">
        {flash?.success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">{flash.success}</div>
        )}

        {/* 🔍 Buscador + botón crear */}
        <div className="flex justify-between items-center">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button type="submit">Buscar</Button>
          </form>

          <Button onClick={() => router.visit('productos/create')}>
            Nuevo producto
          </Button>
        </div>

        {/* 📋 Tabla de productos */}
        <div className="border rounded-md overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Subcategoría</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos?.data?.length ? (
                productos.data.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{p.modelo?.descripcion ?? "-"}</TableCell>
                    <TableCell>{p.sub_categoria?.descripcion ?? "-"}</TableCell>
                    <TableCell>{p.peso ?? "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline"
                        onClick={() => router.visit(route(`productos.edit`, p.id))}>
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive"
                        onClick={() => handleDelete(p.id)}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                    No hay productos cargados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 🔢 Paginación simple */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            Mostrando {productos.from} - {productos.to} de {productos.total}
          </div>
          <div className="flex gap-2">
            {productos.links.map((link: any, i: number) => (
              <button
                key={i}
                disabled={!link.url}
                className={`px-3 py-1 rounded ${
                  link.active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => link.url && router.visit(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
