import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Building2 } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "./InmuebleSchema"
import { useEffect, useState } from "react"
import axios from "axios"


type select = {
    value: string;
    label: string;
};

function InformacionBasica() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<InmuebleSchemaType>();

    const [tipoInmueble, setTipoInmueble] = useState<select[]>([]);
    const [seccional, setSeccional] = useState<select[]>([]);
    const [tipoOcupacion, setTipoOcupacion] = useState<select[]>([]);
    const [tipoEstados, setTipoEstados] = useState<select[]>([]);
    useEffect(() => {
        Promise.all([
            axios.get('/patrimonio/inmuebles/tipos-inmuebles'),
            axios.get('/patrimonio/inmuebles/tipos-ocupacion'),
            axios.get('/patrimonio/inmuebles/estados'),
            axios.get('/patrimonio/inmuebles/branches'),
        ])
            .then(([inmuebleRes, ocupacionRes, estadosRes,seccionalRes]) => {
                setTipoInmueble(
                    inmuebleRes.data.map((item: any) => ({
                        value: String(item.id),
                        label: item.descripcion,
                    }))
                );

                setTipoOcupacion(
                    ocupacionRes.data.map((item: any) => ({
                        value: String(item.id),
                        label: item.descripcion,
                    }))
                );

                setTipoEstados(
                    estadosRes.data.map((item: any) => ({
                        value: String(item.id),
                        label: item.descripcion,
                    }))
                );
                setSeccional(
                    seccionalRes.data.map((item: any) => ({
                        value: String(item.id),
                        label: item.name,
                    }))
                );
            })
            .catch(error => {
                console.error('Error cargando selects', error);
            });
    }, []);

console.log(seccional)
    return (
        <>
            {/* Información Básica */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Información Básica
                    </CardTitle>
                    <CardDescription>Datos generales de la propiedad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="num_partida">Numero de Partida</Label>
                            <Input id="num_partida" {...register("num_partida", { required: true })} type="number" placeholder="18-1-C-123-01-002" min="1" />
                            {errors.num_partida && <p style={{ color: 'red' }}>{errors.num_partida.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Seccional</Label>
                            <Controller
                                name="id_seccionales"
                                control={control}
                                rules={{ required: "Campo obligatorio" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar Seccional" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {seccional.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Propiedad</Label>
                            <Controller
                                name="tipo_inmueble_id"
                                control={control}
                                rules={{ required: "Campo obligatorio" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {tipoInmueble.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Estado</Label>
                            <Controller
                                name="estado_id"
                                control={control}
                                rules={{ required: "Campo obligatorio" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {tipoEstados.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="min-nights">Nombre Fantasía</Label>
                            <Input id="min-nights" placeholder="Nombre de fantasía"  {...register("nombre_fantasia", { required: true })} type="text" />
                            {errors.nombre_fantasia && <p style={{ color: 'red' }}>{errors.nombre_fantasia.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input placeholder="Nombre Completo"  {...register("nombre_completo", { required: true })} type="text" />
                            {errors.nombre_completo && <p style={{ color: 'red' }}>{errors.nombre_completo.message}</p>}
                        </div>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="type">Tipo de Ocupación</Label>
                            <Controller
                                name="tipo_ocupacion_id"
                                control={control}
                                rules={{ required: "Campo obligatorio" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {tipoOcupacion.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.tipo_ocupacion_id && <p style={{ color: 'red' }}>{errors.tipo_ocupacion_id.message}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>


    )
}

export default InformacionBasica;