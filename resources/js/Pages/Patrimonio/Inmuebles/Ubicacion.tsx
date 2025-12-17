import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { MapPin } from "lucide-react";

function Ubicacion() {
    return (
        <>
            {/* Ubicación */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Ubicación
                    </CardTitle>
                    <CardDescription>Dirección y localización de la propiedad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" placeholder="Calle y número" required />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input id="city" placeholder="Ciudad" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="province">Provincia/Estado</Label>
                            <Input id="province" placeholder="Provincia" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postal">Código Postal</Label>
                            <Input id="postal" placeholder="0000" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
export default Ubicacion;