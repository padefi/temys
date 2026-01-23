import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Ruler, RulerDimensionLine } from "lucide-react";
import {  useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "./InmuebleSchema"
function Caracteristicas() {
     const {
    register,
    formState: { errors },
  } = useFormContext<InmuebleSchemaType>();
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RulerDimensionLine className="h-4 w-4" />
                        Características de la propiedad
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Ruler className="h-4 w-4" />
                                Superficie Cubierta (m²)
                            </Label>
                            <Input id="areaCubierta" type="number" placeholder="0"  {...register("superficie_cubierta", { required: true })} />
                            {errors.superficie_cubierta && <p style={{ color: 'red' }}>{errors.superficie_cubierta.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Ruler className="h-4 w-4" />
                                Superficie Libre (m²)
                            </Label>
                            <Input id="areaLibre" type="number" placeholder="0" min="0"   {...register("superficie_libre", { required: true })} />
                            {errors.superficie_libre && <p style={{ color: 'red' }}>{errors.superficie_libre.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Ruler className="h-4 w-4" />
                                Superficie Total (m²)
                            </Label>
                            <Input id="areaTotal" type="number" placeholder="0" min="0"  {...register("superficie_total", { required: true })} />
                            {errors.superficie_total && <p style={{ color: 'red' }}>{errors.superficie_total.message}</p>}
                        </div>

                    </div>
                </CardContent>
            </Card>
        </>
    )
}


export default Caracteristicas;