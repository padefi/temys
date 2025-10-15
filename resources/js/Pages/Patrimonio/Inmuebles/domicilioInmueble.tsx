import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useFormContext } from "react-hook-form";
import { InmuebleFormData } from "./Inmueble";


export function DomicilioInmueble() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<InmuebleFormData>();
    const provincia = watch("provincia") ?? "";
    const localidad = watch("localidad") ?? "";
    const calle = watch("calle") ?? "";

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                {/*     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
                        2
                    </div> */}
                <div>
                    <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Domicilio del Inmueble</h2>
                    <p className="text-sm text-muted-foreground">Ubicación física del inmueble</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="provincia" className="text-secondary font-semibold uppercase text-xs">
                    Provincia *
                </Label>
                <Select
                    value={provincia}
                    onValueChange={(val) => setValue("provincia", val, { shouldValidate: true })} 
                    
                    {...register("provincia", { required: true })}
                >
                    <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                        <SelectValue placeholder="Seleccione la provincia" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                        <SelectItem value="CABA">Ciudad Autónoma de Buenos Aires</SelectItem>
                        <SelectItem value="Catamarca">Catamarca</SelectItem>
                        <SelectItem value="Chaco">Chaco</SelectItem>
                        <SelectItem value="Chubut">Chubut</SelectItem>
                        <SelectItem value="Córdoba">Córdoba</SelectItem>
                        <SelectItem value="Corrientes">Corrientes</SelectItem>
                        <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                        <SelectItem value="Formosa">Formosa</SelectItem>
                        <SelectItem value="Jujuy">Jujuy</SelectItem>
                        <SelectItem value="La Pampa">La Pampa</SelectItem>
                        <SelectItem value="La Rioja">La Rioja</SelectItem>
                        <SelectItem value="Mendoza">Mendoza</SelectItem>
                        <SelectItem value="Misiones">Misiones</SelectItem>
                        <SelectItem value="Neuquén">Neuquén</SelectItem>
                        <SelectItem value="Río Negro">Río Negro</SelectItem>
                        <SelectItem value="Salta">Salta</SelectItem>
                        <SelectItem value="San Juan">San Juan</SelectItem>
                        <SelectItem value="San Luis">San Luis</SelectItem>
                        <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                        <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                        <SelectItem value="Santiago del Estero">Santiago del Estero</SelectItem>
                        <SelectItem value="Tierra del Fuego">Tierra del Fuego</SelectItem>
                        <SelectItem value="Tucumán">Tucumán</SelectItem>
                    </SelectContent>
                </Select>

                {errors.provincia && (
                    <p className="text-red-500 text-sm">{errors.provincia.message as string}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="calle" className="text-secondary font-semibold uppercase text-xs">
                        Calle *
                    </Label>
                    <Select
                        value={calle}
                        onValueChange={(val) => setValue("calle", val, { shouldValidate: true })}
                        
                    >
                        <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                            <SelectValue placeholder="Seleccione la provincia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                            <SelectItem value="CABA">Ciudad Autónoma de Buenos Aires</SelectItem>
                            <SelectItem value="Catamarca">Catamarca</SelectItem>
                            <SelectItem value="Chaco">Chaco</SelectItem>
                            <SelectItem value="Chubut">Chubut</SelectItem>
                            <SelectItem value="Córdoba">Córdoba</SelectItem>
                            <SelectItem value="Corrientes">Corrientes</SelectItem>
                            <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                            <SelectItem value="Formosa">Formosa</SelectItem>
                            <SelectItem value="Jujuy">Jujuy</SelectItem>
                            <SelectItem value="La Pampa">La Pampa</SelectItem>
                            <SelectItem value="La Rioja">La Rioja</SelectItem>
                            <SelectItem value="Mendoza">Mendoza</SelectItem>
                            <SelectItem value="Misiones">Misiones</SelectItem>
                            <SelectItem value="Neuquén">Neuquén</SelectItem>
                            <SelectItem value="Río Negro">Río Negro</SelectItem>
                            <SelectItem value="Salta">Salta</SelectItem>
                            <SelectItem value="San Juan">San Juan</SelectItem>
                            <SelectItem value="San Luis">San Luis</SelectItem>
                            <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                            <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                            <SelectItem value="Santiago del Estero">Santiago del Estero</SelectItem>
                            <SelectItem value="Tierra del Fuego">Tierra del Fuego</SelectItem>
                            <SelectItem value="Tucumán">Tucumán</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.calle && (
                        <p className="text-red-500 text-sm">{errors.calle.message as string}</p>
                    )}
                </div>


                <div className="space-y-2">
                    <Label htmlFor="localidad" className="text-secondary font-semibold uppercase text-xs">
                        Localidad / Ciudad *
                    </Label>
                    <Select
                        value={localidad}
                        onValueChange={(val) => setValue("localidad", val, { shouldValidate: true })}
                        
                    >
                        <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                            <SelectValue placeholder="Seleccione la provincia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                            <SelectItem value="CABA">Ciudad Autónoma de Buenos Aires</SelectItem>
                            <SelectItem value="Catamarca">Catamarca</SelectItem>
                            <SelectItem value="Chaco">Chaco</SelectItem>
                            <SelectItem value="Chubut">Chubut</SelectItem>
                            <SelectItem value="Córdoba">Córdoba</SelectItem>
                            <SelectItem value="Corrientes">Corrientes</SelectItem>
                            <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                            <SelectItem value="Formosa">Formosa</SelectItem>
                            <SelectItem value="Jujuy">Jujuy</SelectItem>
                            <SelectItem value="La Pampa">La Pampa</SelectItem>
                            <SelectItem value="La Rioja">La Rioja</SelectItem>
                            <SelectItem value="Mendoza">Mendoza</SelectItem>
                            <SelectItem value="Misiones">Misiones</SelectItem>
                            <SelectItem value="Neuquén">Neuquén</SelectItem>
                            <SelectItem value="Río Negro">Río Negro</SelectItem>
                            <SelectItem value="Salta">Salta</SelectItem>
                            <SelectItem value="San Juan">San Juan</SelectItem>
                            <SelectItem value="San Luis">San Luis</SelectItem>
                            <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                            <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                            <SelectItem value="Santiago del Estero">Santiago del Estero</SelectItem>
                            <SelectItem value="Tierra del Fuego">Tierra del Fuego</SelectItem>
                            <SelectItem value="Tucumán">Tucumán</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.localidad && (
                        <p className="text-red-500 text-sm">{errors.localidad.message as string}</p>
                    )}

                </div>

                <div className="space-y-2">
                    <Label htmlFor="numero" className="text-secondary font-semibold uppercase text-xs">
                        Número *
                    </Label>
                    <Input
                        id="numero"
                        {...register("numero", { required: "El numero es obligatorio" })}

                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Número"
                        required
                    />

                    {errors.numero?.message && (
                        <p className="text-red-500">{String(errors.numero.message)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="codigo_postal" className="text-secondary font-semibold uppercase text-xs">
                        Código Postal
                    </Label>
                    <Input
                        id="codigo_postal"
                        {...register("codigo_postal", { required: "El numero es obligatorio" })}
                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Ej: 1234"
                    />

                    {errors.codigo_postal?.message && (
                        <p className="text-red-500">{String(errors.codigo_postal.message)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="piso" className="text-secondary font-semibold uppercase text-xs">
                        Piso
                    </Label>
                    <Input
                        id="piso"
                        {...register("piso", { required: "El numero es obligatorio" })}
                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Ej: 3° A"
                    />
                    {errors.piso?.message && (
                        <p className="text-red-500">{String(errors.piso.message)}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="Departamento" className="text-secondary font-semibold uppercase text-xs">
                        Departamento
                    </Label>
                    <Input
                        id="departamento"
                        {...register("departamento", { required: "El numero es obligatorio" })}
                        className="border-2 border-secondary bg-input text-foreground h-12"
                        placeholder="Ej: 3° A"
                    />
                    {errors.departamento?.message && (
                        <p className="text-red-500">{String(errors.departamento.message)}</p>
                    )}
                </div>
            </div>

        </div>
    );
}