import { ColumnDef } from "@tanstack/react-table";
import { Producto } from "./page";
import { DataTableColumnHeader } from "./column-header";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
      label: string;
      type?: "number" | "boolean" | "text" | "email" | "select" | "date";
    }
}

export const columns: ColumnDef<Producto>[] = [
  {
    id: "nombre",
    accessorKey: "nombre",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    meta: { label: "nombre", type: "text" },
  },
  {
    id: "descripcion",
    accessorKey: "descripcion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
    meta: { label: "descripción", type: "text" },
  },
  {
    id: "modelo_id",
    accessorKey: "modelo_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Modelo" />,
    meta: { label: "modelo", type: "select" },
  },
  {
    id: "subcategoria_id",
    accessorKey: "subcategoria_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subcategoría" />,
    meta: { label: "subcategoría", type: "select" },
  },
  {
    id: "peso",
    accessorKey: "peso",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Peso" />,
    meta: { label: "peso", type: "number" },
  },
  {
    id: "alto",
    accessorKey: "alto",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Alto" />,
    meta: { label: "alto", type: "number" },
  },
  {
    id: "ancho",
    accessorKey: "ancho",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ancho" />,
    meta: { label: "ancho", type: "number" },
  },
  {
    id: "volumen",
    accessorKey: "volumen",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Volumen" />,
    meta: { label: "volumen", type: "number" },
  },
  {
    id: "profundidad",
    accessorKey: "profundidad",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Profundidad" />,
    meta: { label: "profundidad", type: "number" },
  },
  {
    id: "cod_barras",
    accessorKey: "cod_barras",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código de barras" />,
    meta: { label: "código de barras", type: "text" },
  },
  {
    id: "referencia",
    accessorKey: "referencia",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Referencia" />,
    meta: { label: "referencia", type: "text" },
  },
  {
    id: "es_inventario",
    accessorKey: "es_inventario",
    header: ({ column }) => <DataTableColumnHeader column={column} title="¿Inventario?" />,
    meta: { label: "inventario", type: "boolean" },
  },
  {
    id: "es_patrimonio",
    accessorKey: "es_patrimonio",
    header: ({ column }) => <DataTableColumnHeader column={column} title="¿Patrimonio?" />,
    meta: { label: "patrimonio", type: "boolean" },
  },
  {
    id: "actions",
    enableSorting: false,
    enableColumnFilter: false,
    header: "Acciones",
  },
];
