import React, { useState } from "react";
import { Inertia } from '@inertiajs/inertia'
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

type EditPageProps = {
    auth: {
            user: {
                id: number
                name: string
                email: string
            }
        },
    producto: {
        id: number;
        nombre: string;
        descripcion: string;
        cod_barras: string;
    };
};

export default function Edit() {
  const { producto } = usePage<EditPageProps>().props;

  const [form, setForm] = useState({
    nombre: producto.nombre || "",
    descripcion: producto.descripcion || "",
    cod_barras: producto.cod_barras || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Inertia.put(`/productos/${producto.id}`, form);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Editar Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="cod_barras">Código de Barras</Label>
            <Input
              id="cod_barras"
              name="cod_barras"
              value={form.cod_barras}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Actualizar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
