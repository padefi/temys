import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

type ProductoFormProps = {
  producto?: any;
  onSubmit: (data: any) => void;
};

export default function Form({ producto, onSubmit }: ProductoFormProps) {
  const { data, setData, post, put, errors, processing } = useForm({
    nombre: producto?.nombre || "",
    descripcion: producto?.descripcion || "",
    modelo_id: producto?.modelo_id || "",
    subcategoria_id: producto?.subcategoria_id || "",
    peso: producto?.peso || "",
    alto: producto?.alto || "",
    ancho: producto?.ancho || "",
    volumen: producto?.volumen || "",
    profundidad: producto?.profundidad || "",
    cod_barras: producto?.cod_barras || "",
    es_inventario: producto?.es_inventario || false,
    es_patrimonio: producto?.es_patrimonio || false,
    referencia: producto?.referencia || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Nombre *</label>
        <input
          type="text"
          value={data.nombre}
          onChange={(e) => setData("nombre", e.target.value)}
          className="border px-2 py-1 w-full"
        />
        {errors.nombre && <p className="text-red-500">{errors.nombre}</p>}
      </div>

      <div>
        <label>Descripción</label>
        <textarea
          value={data.descripcion}
          onChange={(e) => setData("descripcion", e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Modelo ID</label>
          <input
            type="number"
            value={data.modelo_id}
            onChange={(e) => setData("modelo_id", e.target.value)}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Subcategoría ID</label>
          <input
            type="number"
            value={data.subcategoria_id}
            onChange={(e) => setData("subcategoria_id", e.target.value)}
            className="border px-2 py-1 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Peso</label>
          <input
            type="number"
            step="0.01"
            value={data.peso}
            onChange={(e) => setData("peso", e.target.value)}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Alto</label>
          <input
            type="number"
            step="0.01"
            value={data.alto}
            onChange={(e) => setData("alto", e.target.value)}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label>Ancho</label>
          <input
            type="number"
            step="0.01"
            value={data.ancho}
            onChange={(e) => setData("ancho", e.target.value)}
            className="border px-2 py-1 w-full"
          />
        </div>
      </div>

      <div>
        <label>Código de barras</label>
        <input
          type="text"
          value={data.cod_barras}
          onChange={(e) => setData("cod_barras", e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <div className="flex gap-4">
        <label>
          <input
            type="checkbox"
            checked={data.es_inventario}
            onChange={(e) => setData("es_inventario", e.target.checked)}
          />{" "}
          Es Inventario
        </label>
        <label>
          <input
            type="checkbox"
            checked={data.es_patrimonio}
            onChange={(e) => setData("es_patrimonio", e.target.checked)}
          />{" "}
          Es Patrimonio
        </label>
      </div>

      <div>
        <label>Referencia</label>
        <input
          type="text"
          value={data.referencia}
          onChange={(e) => setData("referencia", e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={processing}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </form>
  );
}
