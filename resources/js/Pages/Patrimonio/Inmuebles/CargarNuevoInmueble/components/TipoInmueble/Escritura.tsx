import { Label } from "@/Components/ui/label";
import { useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "../../Schema/InmuebleSchema";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Separator } from "@/Components/ui/separator";





function Escritura() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InmuebleSchemaType>();
    return (
        <>
        <div className="mb-8">

            <Separator className="my-4" />
            <span className="font-semibold">Escritura</span>
        </div>

            <div className="grid gap-4 sm:grid-cols-3">

                {/*  ESCRITURA */}
         
                   <div className="space-y-2">
                    <Label htmlFor="min-nights">Numero de escritura</Label>
                    <Input id="min-nights" type="number" placeholder="1" min="1" {...register("num_escritura", { required: true })} />
                    {errors.num_escritura && <p style={{ color: 'red' }}>{errors.num_escritura.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="max-nights">Fecha de escritura</Label>
                    <Input type="date" className="pl-9" {...register("fecha_escritura", { required: true })}></Input>
                    {errors.fecha_escritura && <p style={{ color: 'red' }}>{errors.fecha_escritura.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price-per-night">Fecha de inscripción</Label>
                    <Input type="date" className="pl-9" {...register("fecha_inscripcion", { required: true })}></Input>
                    {errors.fecha_inscripcion && <p style={{ color: 'red' }}>{errors.fecha_inscripcion.message}</p>}
                </div>


                <div className="space-y-2">
                    <Label htmlFor="max-nights">Folio</Label>
                    <Input type="number" className="pl-9" {...register("folio", { required: true })}></Input>
                    {errors.folio && <p style={{ color: 'red' }}>{errors.folio.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price-per-night">Tomo</Label>
                    <Input type="number" className="pl-9" {...register("tomo", { required: true })}></Input>
                    {errors.tomo && <p style={{ color: 'red' }}>{errors.tomo.message}</p>}
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
            <div className="mb-8">
                <Separator className="my-4" />
                <span className="font-semibold"> Nomeclatura castral</span>
            </div>
 {/* NOMECLATURA CASTRAL           */    }
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Circunscripción</Label>
                    <Input type="text" placeholder="0" {...register("circunscripcion", { required: true })} />
                    {errors.circunscripcion && <p style={{ color: 'red' }}>{errors.circunscripcion.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Sección</Label>
                    <Input  type="text" placeholder="0" {...register("seccion", { required: true })} />
                    {errors.seccion && <p style={{ color: 'red' }}>{errors.seccion.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Manzana</Label>
                    <Input  type="text" placeholder="0" {...register("manzana", { required: true })} />
                    {errors.manzana && <p style={{ color: 'red' }}>{errors.manzana.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Parcela</Label>
                    <Input  type="text" placeholder="0" {...register("parcela", { required: true })} />
                    {errors.parcela && <p style={{ color: 'red' }}>{errors.parcela.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Poligono</Label>
                    <Input  type="text" placeholder="0" {...register("poligono", { required: true })} />
                    {errors.poligono && <p style={{ color: 'red' }}>{errors.poligono.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Zona</Label>
                    <Input  type="text" placeholder="0" {...register("zona", { required: true })} />
                    {errors.zona && <p style={{ color: 'red' }}>{errors.zona.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Partida</Label>
                    <Input  type="text" placeholder="0" {...register("partida", { required: true })} />
                    {errors.partida && <p style={{ color: 'red' }}>{errors.partida.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cleaning-fee">Valor Fiscal</Label>
                    <Input  type="text" placeholder="0" {...register("valuacion_fiscal", { required: true })} />
                    {errors.valuacion_fiscal && <p style={{ color: 'red' }}>{errors.valuacion_fiscal.message}</p>}
                </div>
            </div> 

        
        </>
    )

}

export default Escritura