import { Label } from "@/Components/ui/label";
import { DollarSign } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import { inmuebleSchema, InmuebleSchemaType } from "./InmuebleSchema"
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";



function Alquiler() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InmuebleSchemaType>();
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="duration">Fecha de contratación</Label>
                <Input type="date" className="pl-9" {...register("fecha_contrato", { required: true })}></Input>
                  {errors.fecha_contrato && <p style={{ color: 'red' }}>{errors.fecha_contrato.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="duration">Fecha Inicio</Label>
                <Input type="date" className="pl-9" {...register("fecha_inicio", { required: true })}></Input>
                  {errors.fecha_inicio && <p style={{ color: 'red' }}>{errors.fecha_inicio.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="duration">Fecha de Finalización</Label>
                <Input type="date" className="pl-9" {...register("fecha_fin", { required: true })}></Input>
                  {errors.fecha_fin && <p style={{ color: 'red' }}>{errors.fecha_fin.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="expenses">Importe</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="expenses" type="number" placeholder="0" className="pl-9" {...register("importe", { required: true })}/>
                      {errors.importe && <p style={{ color: 'red' }}>{errors.importe.message}</p>}
                </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="amenities">Observación</Label>
                <Textarea
                    id="amenities"
                    placeholder="WiFi, aire acondicionado, TV, ropa de cama, toallas, etc."
                    rows={3}
                    className="resize-none"
                    {...register("observacion", { required: true })}
                />
                  {errors.observacion && <p style={{ color: 'red' }}>{errors.observacion.message}</p>}
            </div>
        </div>
    )

}

export default Alquiler