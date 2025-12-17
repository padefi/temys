import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { FileText } from "lucide-react";

function TipoContrato(){
    return(
        <>
        {/* Tipo de Contrato */}
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
            <Select required /* value={contractType} onValueChange={setContractType} */>
              <SelectTrigger id="contract-type">
                <SelectValue placeholder="Seleccionar tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="alquiler">Alquiler</SelectItem>
                <SelectItem value="temporal">Alquiler Temporal</SelectItem>
              </SelectContent>
            </Select>
          </div>
{/* 
          {contractType === "alquiler" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">Duración Mínima del Contrato</Label>
                <Select required>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                    <SelectItem value="36">36 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenses">Gastos Mensuales</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="expenses" type="number" placeholder="0" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">Depósito en Garantía</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="deposit" type="number" placeholder="0" className="pl-9" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="available-from">Disponible Desde</Label>
                <Input id="available-from" type="date" required />
              </div>
            </div>
          )}

          {contractType === "temporal" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-nights">Mínimo de Noches</Label>
                <Input id="min-nights" type="number" placeholder="1" min="1" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-nights">Máximo de Noches</Label>
                <Input id="max-nights" type="number" placeholder="30" min="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-per-night">Precio por Noche</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="price-per-night" type="number" placeholder="0" className="pl-9" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaning-fee">Tarifa de Limpieza</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="cleaning-fee" type="number" placeholder="0" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="amenities">Servicios Incluidos</Label>
                <Textarea
                  id="amenities"
                  placeholder="WiFi, aire acondicionado, TV, ropa de cama, toallas, etc."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {contractType === "venta" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title-status">Estado del Título</Label>
                <Select required>
                  <SelectTrigger id="title-status">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="libre">Libre de Deuda</SelectItem>
                    <SelectItem value="hipoteca">Con Hipoteca</SelectItem>
                    <SelectItem value="tramite">En Trámite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property-age">Antigüedad de la Propiedad</Label>
                <Input id="property-age" type="number" placeholder="Años" min="0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxes">Impuestos Anuales</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="taxes" type="number" placeholder="0" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="possession">Posesión</Label>
                <Select required>
                  <SelectTrigger id="possession">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inmediata">Inmediata</SelectItem>
                    <SelectItem value="30dias">30 días</SelectItem>
                    <SelectItem value="60dias">60 días</SelectItem>
                    <SelectItem value="90dias">90 días</SelectItem>
                    <SelectItem value="aconvenir">A Convenir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
        
        </>
    )
}

export default TipoContrato