import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { InmuebleFormData } from "./inmueble";
import { DatePicker } from "@/Pages/Patrimonio/Inmuebles/components/DatePicker";
import { Textarea } from "@/Components/ui/textarea";




export default function ContratoEscritura() {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext<InmuebleFormData>();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                <div>
                    <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Tipo de contrato</h2>
                    <p className="text-sm text-muted-foreground">Aquí podés cargar datos sobre la escritura del inmueble.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="num_escritura" className="text-secondary font-semibold uppercase text-xs">
                        Número de escritura *
                    </Label>
                    <Input
                        id="num_escritura"
                        {...register("num_escritura", { required: true })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Ingrese el número de partida"
                        required
                    />
                    {errors.num_escritura?.message && (
                        <p className="text-red-500">{String(errors.num_escritura.message)}</p>
                    )}

                </div>

                <div className="space-y-2">
                    <Label htmlFor="fecha_escritura" className="text-secondary font-semibold uppercase text-xs">
                        Fecha Escritura *
                    </Label>
                    <div className="space-y-2">
                        <Controller
                            name="fecha_escritura"
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
                        {errors.fecha_escritura && (
                            <p className="text-red-500 text-sm">{String(errors.fecha_escritura.message)}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fecha_inscripcion" className="text-secondary font-semibold uppercase text-xs">
                        Fecha de incripcion *
                    </Label>
                    <div className="space-y-2">
                        <Controller
                            name="fecha_inscripcion"
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
                        {errors.fecha_inscripcion && (
                            <p className="text-red-500 text-sm">{String(errors.fecha_inscripcion.message)}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="folio" className="text-secondary font-semibold uppercase text-xs">
                        Folio
                    </Label>
                    <Input
                        id="folio"
                        {...register("folio", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        Tomo
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="observacion" className="text-secondary font-semibold uppercase text-xs">
                        observacion *
                    </Label>
                    <Textarea
                        id="observacion"
                        placeholder="Agregue observaciones sobre el contrato o el inmueble..."
                        className="border-2 border-secondary bg-input text-foreground h-24"
                        {...register("observacion")}
                    />
                    {errors.observacion && (
                        <p className="text-red-500 text-sm">{String(errors.observacion.message)}</p>
                    )}

                </div>




            </div>

            <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Nomeclatura castral</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        CIRCUNSCRIPCIÓN
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        SECCIÓN
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        MANZANA
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        PARCELA
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        POLIGONO
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        ZONA
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        PARTIDA
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tomo" className="text-secondary font-semibold uppercase text-xs">
                        VALOR FISCAL
                    </Label>
                    <Input
                        id="tomo"
                        {...register("tomo", { required: "El nombre es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Nombre comercial o fantasía"
                    />
                </div>
            </div>
        </div>
    );
}