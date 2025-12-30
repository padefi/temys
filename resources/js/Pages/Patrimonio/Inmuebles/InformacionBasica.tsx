import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Building2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { inmuebleSchema ,InmuebleSchemaType} from "./InmuebleSchema"

function InformacionBasica() {
  const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(inmuebleSchema),
    });

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
                            <Input id="num_partida" {...register("num_partida", { required: true })}  type="number" placeholder="18-1-C-123-01-002" min="1" required />
                            {errors.num_partida && <p style={{ color: 'red' }}>{errors.num_partida.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Propiedad</Label>
                            <Select {...register("tipo_ocupacion_id", { required: true })}>
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="casa">Casa</SelectItem>
                                    <SelectItem value="departamento">Departamento</SelectItem>
                                    <SelectItem value="terreno">Terreno</SelectItem>
                                    <SelectItem value="local">Local Comercial</SelectItem>
                                    <SelectItem value="oficina">Oficina</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipo_ocupacion_id && <p style={{ color: 'red' }}>{errors.tipo_ocupacion_id.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Estado</Label>
                            <Select {...register("tipo_inmueble_id", { required: true })}>
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="alquilado">Alquilado</SelectItem>
                                    <SelectItem value="baja">Baja</SelectItem>
                                    <SelectItem value="desocupado">Desocupado</SelectItem>
                                    <SelectItem value="donado">Donado</SelectItem>
                                    <SelectItem value="vendido">Vendido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="min-nights">Nombre Fantasía</Label>
                            <Input id="min-nights" placeholder="Nombre de fantasía"  {...register("nombre_fantasia", { required: true })} />
                              {errors.nombre_fantasia && <p style={{ color: 'red' }}>{errors.nombre_fantasia.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input placeholder="Nombre Completo"  {...register("nombre_completo", { required: true })}  />
                             {errors.nombre_completo && <p style={{ color: 'red' }}>{errors.nombre_completo.message}</p>}
                        </div>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="type">Tipo de Ocupación</Label>
                            <Select {...register("tipo_ocupacion_id", { required: true })}>
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">T1</SelectItem>
                                    <SelectItem value="2">T2</SelectItem>
                                    <SelectItem value="3">T3</SelectItem>
                                    <SelectItem value="4">T4</SelectItem>
                                    <SelectItem value="5">T5</SelectItem>
                                    <SelectItem value="6">T6</SelectItem>
                                </SelectContent>
                            </Select>
                             {errors.tipo_ocupacion_id && <p style={{ color: 'red' }}>{errors.tipo_ocupacion_id.message}</p>}
                        </div>

                    </div>

                </CardContent>
            </Card>
        </>


    )
}

export default InformacionBasica;