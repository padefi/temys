import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { FileText } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "../Schema/InmuebleSchema"
import { useEffect, useState } from "react";
import Escritura from "./TipoInmueble/Escritura";
import Alquiler from "./TipoInmueble/Alquiler";
import Comodato from "./TipoInmueble/Comodato";
import axios from "axios";


type tipoContratoItem = {
    value: string;
    label: string;
};

function TiposDeContratos() {
    const {
        formState: { errors}, control, watch
    } = useFormContext<InmuebleSchemaType>();

    const contractType = watch("tipo_contrato");
    const [tipoContrato, setTipoContrato] = useState<tipoContratoItem[]>([]);

    useEffect(() => {
        axios.get('/patrimonio/inmuebles/tipos-contrato')
            .then(response => {
                const data = response.data.map(
                    (tipo: { id: number; descripcion: string }) => ({
                        value: String(tipo.id),
                        label: tipo.descripcion,
                    })
                );
                setTipoContrato(data);
            });
    }, []);


    const contratoSeleccionado = tipoContrato.find(
        tipo => Number(tipo.value) === contractType
    );


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Tipo de Contrato
                </CardTitle>
                <CardDescription>Seleccione el tipo de operación</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="contract-type">Operación</Label>
                    <Controller
                        name="tipo_contrato"
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
                                    {tipoContrato.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {contratoSeleccionado?.label === "Alquiler" && <Alquiler />}
                {contratoSeleccionado?.label === "Escritura" && <Escritura />}
                {contratoSeleccionado?.label === "Comodato" && <Comodato />}
            </CardContent>
        </Card>
    );
}

export default TiposDeContratos