import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useFormContext } from "react-hook-form";
import { InmuebleFormData } from "@/types/Inmuebles";


interface Provincia {
    id: number;
    nombre: string;
}

interface Localidad {
    id: number;
    nombre: string;
}

interface Calle {
    id: number;
    nombre: string;
}



export function DomicilioInmueble() {
    const { register, watch, setValue, formState: { errors } } = useFormContext<InmuebleFormData>();


    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [localidades, setLocalidades] = useState<Localidad[]>([]);
    const [calles, setCalles] = useState<Calle[]>([]);

    const provincia = watch("provincia_id");
    const localidad = watch("localidad_id");

    // Cargar provincias al montar
    useEffect(() => {
        axios.get("/provincias").then((res) => setProvincias(res.data));
    }, []);

    // Cargar localidades cuando cambia la provincia
    useEffect(() => {
        if (provincia) {
            axios.get(`/localidades/${provincia}`).then((res) => setLocalidades(res.data));
            setValue("localidad_id", ""); // limpiar selección anterior
            setValue("calle_id", "");
            setCalles([]);
        }
    }, [provincia]);



    // Cargar calles cuando cambia la localidad
    useEffect(() => {
        if (localidad) {
            axios.get(`/calles/${localidad}`).then((res) => setCalles(res.data));
            setValue("calle_id", "");
        }
    }, [localidad]);

 
    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide border-b-2 border-border pb-4">
                Domicilio del Inmueble
            </h2>


            <div className="space-y-2">
                <Label htmlFor="provincia_id" className="text-secondary font-semibold uppercase text-xs">
                    Provincia *
                </Label>
                <Select
                    value={provincia || ""}
                    onValueChange={(val) => setValue("provincia_id", val, { shouldValidate: true })}
                >
                    <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                        <SelectValue placeholder="Seleccione la provincia" />
                    </SelectTrigger>
                    <SelectContent>
                        {provincias.map((prov) => (
                            <SelectItem key={prov.id} value={prov.id.toString()}>
                                {prov.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.provincia_id && <p className="text-red-500 text-sm">Seleccione una provincia</p>}
            </div>


            <div className="space-y-2">
                <Label htmlFor="localidad_id" className="text-secondary font-semibold uppercase text-xs">
                    Localidad *
                </Label>
                <Select
                    value={localidad || ""}
                    onValueChange={(val) => setValue("localidad_id", val, { shouldValidate: true })}
                    disabled={!provincia}
                >
                    <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                        <SelectValue placeholder="Seleccione la localidad" />
                    </SelectTrigger>
                    <SelectContent>
                        {localidades.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>
                                {loc.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.localidad_id && <p className="text-red-500 text-sm">Seleccione una localidad</p>}
            </div>


            <div className="space-y-2">
                <Label htmlFor="calle_id" className="text-secondary font-semibold uppercase text-xs">
                    Calle *
                </Label>
                <Select
                    value={watch("calle_id") || ""}
                    onValueChange={(val) => setValue("calle_id", val, { shouldValidate: true })}
                    disabled={!localidad}
                >
                    <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                        <SelectValue placeholder="Seleccione la calle" />
                    </SelectTrigger>
                    <SelectContent>
                        {calles.map((calle) => (
                            <SelectItem key={calle.id} value={calle.id.toString()}>
                                {calle.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.calle_id && <p className="text-red-500 text-sm">Seleccione una calle</p>}
            </div>
        </div>
    );
}
