import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { inmuebleSchema, InmuebleSchemaType } from "./InmuebleSchema"


function Ubicacion() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(inmuebleSchema),
    });
    return (
        <>
            {/* Ubicación */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Ubicación
                    </CardTitle>
                    <CardDescription>Dirección y localización de la propiedad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Calle</Label>
                            <Input id="calle" placeholder="Calle" {...register("calle_id", { required: true })} />
                            {errors.calle_id && <p style={{ color: 'red' }}>{errors.calle_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Numero</Label>
                            <Input id="numero" placeholder="Numero" {...register("numero", { required: true })} />
                            {errors.numero && <p style={{ color: 'red' }}>{errors.numero.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label>Piso</Label>
                            <Input id="piso" placeholder="Piso" {...register("piso")} />
                            {errors.piso && <p style={{ color: 'red' }}>{errors.piso.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label>Departamento</Label>
                            <Input id="departamento" placeholder="Departamento" {...register("departamento")} />
                            {errors.departamento && <p style={{ color: 'red' }}>{errors.departamento.message}</p>}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Localidad</Label>
                            <Input id="localidad" placeholder="Localidad" {...register("localidad_id", { required: true })} />
                            {errors.localidad_id && <p style={{ color: 'red' }}>{errors.localidad_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Provincia/Estado</Label>
                            <Input id="provincia" placeholder="Provincia" {...register("provincia_id", { required: true })} />
                            {errors.provincia_id && <p style={{ color: 'red' }}>{errors.provincia_id.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Código Postal</Label>
                            <Input id="postal" placeholder="0000" {...register("codigo_postal", { required: true })} />
                            {errors.codigo_postal && <p style={{ color: 'red' }}>{errors.codigo_postal.message}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
export default Ubicacion;