import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import type { Inmueble } from "@/types/Patrimonio/Inmuebles"

interface DatosGeneralesTabProps {
  inmueble: Inmueble
}

export function DatosGeneralesTab({ inmueble }: DatosGeneralesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Nombre del Inmueble
          </Label>
          <Input
            value={inmueble.nombres_inmueble.nombre_completo}
            readOnly
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Partida Inmobiliaria
          </Label>
          <Input
            value={inmueble.num_partida}
            readOnly
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Tipo de Propiedad
          </Label>
          <Select value={inmueble.tipo_inmueble_nombre} disabled>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={inmueble.tipo_inmueble_nombre}>
                {inmueble.tipo_inmueble_nombre}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Superficie Cubierta (M²)
          </Label>
          <Input
            value={inmueble.superficie.cubierta.toString()}
            readOnly
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Superficie Libre (M²)
          </Label>
          <Input
            value={inmueble.superficie.libre.toString()}
            readOnly
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Estado Administrativo
          </Label>
          <Select value={inmueble.estado} disabled>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={inmueble.estado}>{inmueble.estado}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Última modificación: {new Date(inmueble.creacion.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })} hs.
        </p>
        <div className="flex gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button style={{ backgroundColor: "#10b981", color: "white" }}>
            Actualizar Información
          </Button>
        </div>
      </div>
    </div>
  )
}