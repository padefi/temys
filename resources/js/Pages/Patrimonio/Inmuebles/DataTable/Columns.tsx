"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CalendarDays, Eye, FileText, Pencil } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import type { Inmueble } from "@/types/Patrimonio/Inmuebles"
import { DataTableColumnHeader } from "./column-header"

export const columns: ColumnDef<Inmueble>[] = [
  {
    accessorKey: "num_inmueble",
    header: "N° inmueble",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("num_inmueble")}</div>
    ),
  },
  {
    accessorKey: "nombre_seccional",
    header: "Seccional",
    cell: ({ row }) => (
      row.getValue("nombre_seccional")
    ),
  },
  {
    accessorKey: "num_partida",
    header: ({ column, table }) => {
      const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
      return (
        <DataTableColumnHeader
          column={column}
          title="Partida"
          disabled={disabled}
          className="justify-center font-bold min-w-[90px]"
          isVisible={true}
        />
      )
    },

    cell: ({ row }) => (
      row.getValue("num_partida")
    ),
  },
  {
    id: "nombres_inmueble",
    header: ({ column, table }) => {
      const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
      return (
        <DataTableColumnHeader
          column={column}
          title="Nombre"
          disabled={disabled}
          className="justify-center font-bold min-w-[90px]"
          isVisible={true}
        />
      )
    },

    cell: ({ row }) => {
      const nombres = row.original.nombres_inmueble

      return (
        <div>
          <div className="font-medium"><span>Completo: </span>{nombres.nombre_completo}</div>
          <div className="text-xs text-muted-foreground">
            <span>Fantasia: </span>
            {nombres.nombre_fantasia}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string
      const isActivo = estado.toLowerCase() === "activo"

      return (
        <Badge
          variant={isActivo ? "default" : "secondary"}
          style={{
            backgroundColor: isActivo ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
            color: isActivo ? "#059669" : "#d97706"
          }}
        >
          {estado}
        </Badge>
      )
    },
  },
  {
    accessorKey: "tipo_inmueble_nombre",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("tipo_inmueble_nombre")}</div>
    ),
  },
  {
    accessorKey: "tipo_ocupacion_nombre",
    header: "Ocupación",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("tipo_ocupacion_nombre")}</div>
    ),
  },
  {
    id: "superficie",
    header: "Superficie",
    cell: ({ row }) => {
      const superficie = row.original.superficie

      return (
        <>
          <div className="text-center text-sm">
            <span className="font-semibold">C: {superficie.cubierta}</span>
            <span className="text-muted-foreground"> m²</span>
          </div>
          <div className="text-center text-sm">
            <span className="font-semibold">L: {superficie.libre}</span>
            <span className="text-muted-foreground"> m²</span>
          </div>
          <div className="text-center text-sm">
            <span className="font-semibold">T: {superficie.total}</span>
            <span className="text-muted-foreground"> m²</span>
          </div>
        </>
      )
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/*      <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: "#0d9488" }}
              title="Ver más info"
            >
              <Eye className="h-4 w-4" />
            </Button> */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            style={{ color: "#f59e0b" }}
            title="Modificar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {/*  <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: "#dc2626" }}
              title="Documentación"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: "#0284c7" }}
              title="Impuestos/Servicios"
            >
              <CalendarDays className="h-4 w-4" />
            </Button> */}
        </div>
      )
    },
    enableSorting: false,
  },
]
