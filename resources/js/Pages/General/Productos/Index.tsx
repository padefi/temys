import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Producto, FlashMessages } from "@/types/Producto";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog";

import Form from "./Form"; // el formulario que mostraste

type ProductosPageProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  productos: Producto[];
  flash: FlashMessages;
};

export default function ProductosIndex() {
  const { productos } = usePage<ProductosPageProps>().props;

  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const eliminarProducto = (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      router.delete(`/productos/${id}`);
    }
  };

  // Función para manejar submit del formulario (crear o editar)
  const handleSubmit = (data: any) => {
    if (productoEditar) {
      // Editar
      router.put(`/productos/${productoEditar.id}`, data, {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      // Crear
      router.post(`/productos`, data, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  // Abrir modal para nuevo producto
  const abrirNuevo = () => {
    setProductoEditar(null);
    setModalOpen(true);
  };

  // Abrir modal para editar producto existente
  const abrirEditar = (producto: Producto) => {
    setProductoEditar(producto);
    setModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lista de Productos</h1><Button onClick={abrirNuevo} className="mb-4">Nuevo Producto</Button>
      <Table>
        <TableCaption>Listado de productos registrados.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Código de Barras</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((p: Producto) => (
            <TableRow key={p.id} className="hover:bg-gray-50">
              <TableCell>{p.nombre}</TableCell>
              <TableCell>{p.descripcion}</TableCell>
              <TableCell>{p.cod_barras}</TableCell>
              <TableCell className="flex justify-center gap-2">
                <Button size="sm" variant="outline" onClick={() => abrirEditar(p)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => eliminarProducto(p.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>



      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg sm:mx-auto p-6">
          <DialogTitle>{productoEditar ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <Form producto={productoEditar} onSubmit={handleSubmit} />
          <DialogClose asChild>
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cerrar</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
