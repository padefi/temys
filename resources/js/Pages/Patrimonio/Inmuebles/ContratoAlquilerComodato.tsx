import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "./components/DatePicker";
import { InmuebleFormData } from "@/types/Inmuebles"; 
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

type ContratoAlquilerProps = {
  tipoContrato: string
}


export default function ContratoAlquierComodato({ tipoContrato }: ContratoAlquilerProps) {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext<InmuebleFormData>();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                <div>
                    <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Tipo de contrato</h2>
                     <p className="text-sm text-muted-foreground"> Aquí podés cargar datos sobre el {tipoContrato} del inmueble. </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                <div className="space-y-2">
                    <Label htmlFor="fecha_contrato" className="text-secondary font-semibold uppercase text-xs">
                        FECHA CONTRATO *
                    </Label>
                    <div className="space-y-2">
                        <Controller
                            name="fecha_contrato"
                            control={control}
                            rules={{ required: "Debe seleccionar una fecha" }}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Seleccionar fecha"
                                />
                            )}
                        />
                        {errors.fecha_contrato && (
                            <p className="text-red-500 text-sm">{String(errors.fecha_contrato.message)}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fecha_inicio" className="text-secondary font-semibold uppercase text-xs">
                        FECHA INICIO *
                    </Label>
                    <div className="space-y-2">
                        <Controller
                            name="fecha_inicio"
                            control={control}
                            rules={{ required: "Debe seleccionar una fecha" }}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Seleccionar fecha"
                                />
                            )}
                        />
                        {errors.fecha_inicio && (
                            <p className="text-red-500 text-sm">{String(errors.fecha_inicio.message)}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fecha_fin" className="text-secondary font-semibold uppercase text-xs">
                        FECHA FINALIZACIÓN *
                    </Label>
                    <div className="space-y-2">
                        <Controller
                            name="fecha_fin"
                            control={control}
                            rules={{ required: "Debe seleccionar una fecha" }}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Seleccionar fecha"
                                />
                            )}
                        />
                        {errors.fecha_fin && (
                            <p className="text-red-500 text-sm">{String(errors.fecha_fin.message)}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="importe" className="text-secondary font-semibold uppercase text-xs">
                        IMPORTE
                    </Label>
                    <Input
                        id="importe"
                        {...register("importe", { required: "El nombre es obligatorio" })}

                        className="w-full border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="importe"
                    />
                </div>


                <div className="space-y-2">
                    <Label htmlFor="observacion" className="text-secondary font-semibold uppercase text-xs">
                        observacion *
                    </Label>
                    <Textarea
                        id="observacion"
                        placeholder="Agregue observaciones sobre el contrato o el inmueble..."
                        className="w-full border-2 border-secondary bg-input text-foreground h-24"
                        {...register("observacion")}
                    />
                    {errors.observacion && (
                        <p className="text-red-500 text-sm">{String(errors.observacion.message)}</p>
                    )}

                </div>




            </div>
        </div>
    )
}