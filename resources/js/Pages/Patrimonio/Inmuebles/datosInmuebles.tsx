import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useFormContext } from "react-hook-form";
import { InmuebleFormData } from "@/types/Inmuebles"; 

import { ContactoInmueble } from "./contactoInmueble";
import { DomicilioInmueble } from "./domicilioInmueble";





export function DatosInmuebles() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<InmuebleFormData>();

    const estado = watch("estado_id") ?? "";
    const tipoInmueble = watch("tipo_inmueble_id") ?? "";
    const tipoOcupacion = watch("tipo_ocupacion_id") ?? "";

    return (
        <Card className="border-4 border-secondary bg-card bg-gray-400">
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                    {/*  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
                        1
                    </div> */}
                    <div>
                        <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Información Básica</h2>
                        <p className="text-sm text-muted-foreground">Datos identificatorios del inmueble</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="num_partida" className="text-secondary font-semibold uppercase text-xs">
                            Número de Partida *
                        </Label>
                        <Input
                            id="num_partida"
                            {...register("num_partida", { required: true })}

                            className="w-full border-2 border-secondary bg-input text-foreground h-12"
                            placeholder="Ingrese el número de partida"
                            required
                        />
                        {errors.num_partida?.message && (
                            <p className="text-red-500">{String(errors.num_partida.message)}</p>
                        )}

                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estado_id" className="text-secondary font-semibold uppercase text-xs">
                            Estado *
                        </Label>

                        <Select
                            value={estado}
                            onValueChange={(val) => setValue("estado_id", val, { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full border-2 border-secondary bg-input text-foreground h-12">
                                <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Activo</SelectItem>
                                <SelectItem value="2">Inactivo</SelectItem>
                                <SelectItem value="3">En Mantenimiento</SelectItem>
                                <SelectItem value="4">En Venta</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.estado_id && (
                            <p className="text-red-500 text-sm">{errors.estado_id.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nombre_completo" className="text-secondary font-semibold uppercase text-xs">
                            Nombre Completo *
                        </Label>
                        <Input
                            id="nombre_completo"
                            {...register("nombre_completo", { required: "El nombre es obligatorio" })}

                            className="w-full border-2 border-secondary bg-input text-foreground h-12"
                            placeholder="Nombre completo del inmueble"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nombre_fantasia" className="text-secondary font-semibold uppercase text-xs">
                            Nombre Fantasía
                        </Label>
                        <Input
                            id="nombre_fantasia"
                            {...register("nombre_fantasia", { required: "El nombre es obligatorio" })}

                            className="w-full border-2 border-secondary bg-input text-foreground h-12"
                            placeholder="Nombre comercial o fantasía"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo_inmueble_id" className="text-secondary font-semibold uppercase text-xs">
                            Tipo inmuebles *
                        </Label>

                        <Select
                            value={tipoInmueble}
                            onValueChange={(val) => setValue("tipo_inmueble_id", val, { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full border-2 border-secondary bg-input text-foreground h-12">
                                <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Campo</SelectItem>
                                <SelectItem value="2">Campo baldio</SelectItem>
                                <SelectItem value="3">Campo con mejoras</SelectItem>
                                <SelectItem value="4">Campo a la calle</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.estado_id && (
                            <p className="text-red-500 text-sm">{errors.estado_id.message as string}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo_ocupacion_id" className="text-secondary font-semibold uppercase text-xs">
                            Tipo inmuebles *
                        </Label>

                        <Select
                            value={tipoOcupacion}
                            onValueChange={(val) => setValue("tipo_ocupacion_id", val, { shouldValidate: true })}
                        >
                            <SelectTrigger className="w-full border-2 border-secondary bg-input text-foreground h-12">
                                <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Alquilado a terceros modo 1</SelectItem>
                                <SelectItem value="2">Alquilado a terceros modo 2</SelectItem>
                                <SelectItem value="3">Alquilado por terceros modo 1</SelectItem>
                                <SelectItem value="4">Alquilado por terceros modo 2</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.estado_id && (
                            <p className="text-red-500 text-sm">{errors.estado_id.message as string}</p>
                        )}
                    </div>
                </div>
            </div>
            <DomicilioInmueble />
            <ContactoInmueble />
        </Card>
    );
}