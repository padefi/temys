import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { FileText } from "lucide-react";
import {useFormContext } from "react-hook-form"
import {  InmuebleSchemaType } from "./InmuebleSchema"
import { useState } from "react";
import Escritura from "./Escritura";
import Alquiler from "./Alquiler";
import Comodato from "./Comodato";

function TiposDeContratos() {
   const {
    register,
    formState: { errors },
  } = useFormContext<InmuebleSchemaType>();
    const [contractType, setContractType] = useState<string>("")
    return (
        <>
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
                        <Select required value={contractType} onValueChange={setContractType}>
                            <SelectTrigger id="contract-type">
                                <SelectValue placeholder="Seleccionar tipo de contrato" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="comodato">Comodato</SelectItem>
                                <SelectItem value="alquiler">Alquiler</SelectItem>
                                <SelectItem value="escritura">Escritura</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {contractType === "alquiler" && (
                        <Alquiler></Alquiler>
                    )}

                    {contractType === "escritura" && (
                        <Escritura></Escritura>
                    )}

                    {contractType === "comodato" && (
                        <Comodato></Comodato>
                    )}
                </CardContent>
            </Card>

        </>
    )
}

export default TiposDeContratos