"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/Components/ui/button" 
import { Dialog ,  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,} from "@/Components/ui/dialog"

import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
/* import { useToast } from "@/hooks/use-toast" */
import { Loader2 } from "lucide-react"

interface OrdenCompraFormData {
  origen_id: string
  descripcion: string
  estado: string
}

export function OrdenCompraModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
/*   const { toast } = useToast() */

  const [formData, setFormData] = useState<OrdenCompraFormData>({
    origen_id: "",
    descripcion: "",
    estado: "pendiente",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/ordenes-compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error al crear la orden de compra")
      }

      const data = await response.json()

   /*    toast({
        title: "Orden de compra creada",
        description: "La orden de compra se ha creado exitosamente.",
      }) */

      // Resetear formulario y cerrar modal
      setFormData({
        origen_id: "",
        descripcion: "",
        estado: "pendiente",
      })
      setOpen(false)
    } catch (error) {
/*       toast({
        title: "Error",
        description: "Hubo un problema al crear la orden de compra.",
        variant: "destructive",
      }) */
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">Nueva Orden de Compra</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Orden de Compra</DialogTitle>
            <DialogDescription>Completa los datos para crear una nueva orden de compra.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
 {/*            <div className="grid gap-2">
              <Label htmlFor="origen_id">
                ID de Origen <span className="text-destructive">*</span>
              </Label>
              <Input
                id="origen_id"
                type="text"
                placeholder="Ej: ORG-001"
                value={formData.origen_id}
                onChange={(e) => setFormData({ ...formData, origen_id: e.target.value })}
                required
              />
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe la orden de compra..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                required
              />
            </div>

{/*             <div className="grid gap-2">
              <Label htmlFor="estado">
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Orden"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
