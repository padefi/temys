import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { router } from "@inertiajs/react";

export default function Create() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cod_barras: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("/productos", form);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Crear Producto</CardTitle>
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
          <Button type="submit">Guardar</Button>
        </form>
      </CardContent>
    </Card>
  );
}
