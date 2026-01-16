import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "./InmuebleSchema"
import { useEffect, useState } from "react";
import Escritura from "./Escritura";
import Alquiler from "./Alquiler";
import Comodato from "./Comodato";
import axios from "axios";


type tipoContratoItem = {
    value: string;
    label: string;
};

function TiposDeContratos() {
  const {
    formState: { errors },
  } = useFormContext<InmuebleSchemaType>();

  const [contractType, setContractType] = useState<string>("");
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
    tipo => tipo.value === contractType
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

          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger id="contract-type">
              <SelectValue placeholder="Seleccionar tipo de contrato" />
            </SelectTrigger>

            <SelectContent>
              {tipoContrato.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {contratoSeleccionado?.label === "Alquiler" && <Alquiler />}
        {contratoSeleccionado?.label === "Escritura" && <Escritura />}
        {contratoSeleccionado?.label === "Comodato" && <Comodato />}
      </CardContent>
    </Card>
  );
}

export default TiposDeContratos