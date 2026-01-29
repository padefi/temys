import { Label } from "@/Components/ui/label";
import { useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "../../Schema/InmuebleSchema";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";


function Comodato() {
   const {
    register,
    formState: { errors },
  } = useFormContext<InmuebleSchemaType>();
    return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label>Fecha de contratación</Label>
        <Input type="date" {...register("fecha_contrato")} />
        {errors.fecha_contrato && (<p className="text-red-500 text-sm">{errors.fecha_contrato.message}</p>)}
      </div>

      <div className="space-y-2">
        <Label>Fecha inicio</Label>
        <Input type="date" {...register("fecha_inicio")} />
        {errors.fecha_inicio && ( <p className="text-red-500 text-sm"> {errors.fecha_inicio.message} </p>)}
      </div>

      <div className="space-y-2">
        <Label>Fecha de finalización</Label>
        <Input type="date" {...register("fecha_fin")} />
        {errors.fecha_fin && (<p className="text-red-500 text-sm">{errors.fecha_fin.message} </p> )}
      </div>

      <div className="space-y-2 sm:col-span-3">
        <Label>Observación</Label>
        <Textarea rows={3} className="resize-none" {...register("observacion")} />
        {errors.observacion && ( <p className="text-red-500 text-sm"> {errors.observacion.message} </p> )}
      </div>
    </div>
  );

}

export default Comodato