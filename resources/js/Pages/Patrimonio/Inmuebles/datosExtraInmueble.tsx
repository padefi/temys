import Checkbox from "@/Components/Checkbox";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { useFormContext } from "react-hook-form";
import { InmuebleFormData } from "@/types/Inmuebles";

import { Button } from "@/Components/ui/button";
import ContratoEscritura from "./ContratoEscritura";
import ContratoAlquierComodato from "./ContratoAlquilerComodato";




export function DatosExtraInmueble() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<InmuebleFormData>();
    const tipoContrato = watch("tipo_contrato") || "";

    const superficieCubierta=watch('superficie_cubierta')
    const superficieLibre=watch('superficie_libre')
    const superficieTotal=watch('superficie_total')


    return (
        <>
            <Card className="border-4 border-secondary bg-card bg-gray-400">
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                        {/*   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
                            4
                        </div> */}
                        <div>
                            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Medidas y Superficies</h2>
                            <p className="text-sm text-muted-foreground">Especifique las dimensiones en metros cuadrados</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="superficie_cubierta" className="text-secondary font-semibold uppercase text-xs">
                                Superficie Cubierta (m²)
                                {!superficieCubierta && <span className="text-red-500"> *</span>}
                            </Label>
                            <Input
                                id="superficie_cubierta"
                                type="number"
                                step="0.01"
                                {...register("superficie_cubierta", { required: true })}
                                className="w-full border-2 border-secondary bg-input text-foreground h-12"
                                placeholder="0.00"

                            />
                            {errors.superficie_cubierta?.message && (
                                <p className="text-red-500">{String(errors.superficie_cubierta.message)}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="superficie_libre" className="text-secondary font-semibold uppercase text-xs">
                                Superficie Libre (m²)
                                 {!superficieLibre && <span className="text-red-500"> *</span>}
                            </Label>
                            <Input
                                id="superficie_libre"
                                {...register("superficie_libre", { required: true })}
                                type="number"
                                step="0.01"

                                className="w-full border-2 border-secondary bg-input text-foreground h-12"
                                placeholder="0.00"

                            />
                            {errors.superficie_libre?.message && (
                                <p className="text-red-500">{String(errors.superficie_libre.message)}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="superficie_total" className="text-secondary font-semibold uppercase text-xs">
                                Superficie Total (m²)
                                 {!superficieTotal && <span className="text-red-500"> *</span>}
                            </Label>
                            <Input
                                id="superficie_total"
                                {...register("superficie_total", { required: true })}
                                type="number"
                                step="0.01"
                                className="w-full border-2 border-secondary bg-input text-foreground h-12"
                                placeholder="0.00"

                            />
                            {errors.superficie_total?.message && (
                                <p className="text-red-500">{String(errors.superficie_total.message)}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-muted border-2 border-border p-4 rounded">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Nota:</span> La superficie total debe ser igual a la suma de
                            la superficie cubierta y libre.
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-border">

                        <div>
                            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Clasificación</h2>
                            <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                        </div>
                    </div>

                    <div>
                        <RadioGroup
                            value={watch("tipo_contrato") || ""}
                            onValueChange={(value) => setValue("tipo_contrato", value)}
                            className="space-y-3 flex justify-around "
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="escritura" id="r1" />
                                <Label htmlFor="r1">Escritura</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="alquiler" id="r2" />
                                <Label htmlFor="r2">Alquiler</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="comodato" id="r3" />
                                <Label htmlFor="r3">Comodato</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {tipoContrato === "escritura" && (
                    <ContratoEscritura></ContratoEscritura>
                )}

                {tipoContrato === "alquiler" && (
                    <ContratoAlquierComodato tipoContrato={tipoContrato}></ContratoAlquierComodato>
                )}

                {tipoContrato === "comodato" && (
                    <ContratoAlquierComodato tipoContrato={tipoContrato}></ContratoAlquierComodato>
                )}

            </Card>
        </>

    );
}
