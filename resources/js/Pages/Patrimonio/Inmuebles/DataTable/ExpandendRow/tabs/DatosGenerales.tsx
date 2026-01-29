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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
        <h1 className="col-span-3 text-start font-bold">CONTACTOS</h1>
        {inmueble.contactos.map((contacto) => (
          <div key={contacto.id} className="contents">
            <div className="space-y-2">
              <Label className="text-xs  uppercase tracking-wide">
                Tipo de contacto
              </Label>
              <Input
                value={contacto.tipo_contacto.descripcion ?? ''}
                readOnly
                className="bg-background"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs  uppercase tracking-wide">
                Contacto
              </Label>
              <Input
                value={contacto.contacto ?? ''}
                readOnly
                className="bg-background"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs  uppercase tracking-wide">
                Descripción
              </Label>
              <Input
                value={contacto.descripcion ?? ''}
                readOnly
                className="bg-background"
                disabled
              />
            </div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
        <h1 className="col-span-3 text-start font-bold">DOMICILIO</h1>
        <div className="space-y-2">
          <Label className="text-xs  uppercase tracking-wide">
            Provincia
          </Label>
          <Input
            value={inmueble.nombres_inmueble.nombre_completo}
            readOnly
            className="bg-background"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs  uppercase tracking-wide">
            Localidad
          </Label>
          <Input
            value={inmueble.num_partida}
            readOnly
            className="bg-background"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide">
            Calle
          </Label>
          <Input
            value={inmueble.num_partida}
            readOnly
            className="bg-background"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs  uppercase tracking-wide">
            Altura
          </Label>
          <Input
            value={inmueble.num_partida}
            readOnly
            className="bg-background"
            disabled
          />
        </div>


      </div>

      {/*   <div className="flex items-center justify-between pt-4 border-t">
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
      </div> */}
    </div>
  )
}