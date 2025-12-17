import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

import { Bath, Bed, Car, DollarSign, Ruler } from "lucide-react";

function Caracteristicas(){
    return ( 
        <>
        {/* Precio y Características */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
         {/* //   {contractType === "temporal" ? "Características" : "Precio y Características"} */}
          </CardTitle>
          <CardDescription>
     {/*        {contractType === "temporal"
              ? "Características de la propiedad"
              : "Detalles económicos y características de la propiedad"} */}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="area" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Superficie (m²)
              </Label>
              <Input id="area" type="number" placeholder="0" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Dormitorios
              </Label>
              <Input id="bedrooms" type="number" placeholder="0" min="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Baños
              </Label>
              <Input id="bathrooms" type="number" placeholder="0" min="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parking" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Cocheras
              </Label>
              <Input id="parking" type="number" placeholder="0" min="0" />
            </div>
          </div>
        </CardContent>
      </Card>
        </>
    )
}


export default Caracteristicas;