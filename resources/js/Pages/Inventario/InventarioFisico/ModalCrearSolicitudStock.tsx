import { Button } from "@/Components/ui/button";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader} from "@/components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

type Almacen = {
    id: number;
    nombre: string;
};

interface SolicitarStockProps {
    solicitudDialogOpen: boolean;
    setsolicitudDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProduct: any; 
}

export const SolicitarStock: React.FC<SolicitarStockProps> = ({
    solicitudDialogOpen,
    setsolicitudDialogOpen,
    selectedProduct,
}) => {
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [almacenProveedor, setAlmacenProveedor] = useState("");
    const [cantidad, setCantidad] = useState(0);
    const [prioridad, setPrioridad] = useState("Alta");
    const [motivo, setMotivo] = useState("");
    const [loading, setLoading] = useState(false);
    //console.log(selectedProduct.producto.id)

    const handleSubmit = async () => {
        try {
            setLoading(true);
            

            await axios.post("/solicitar-stock", {
                producto_id: selectedProduct.producto.id,
                almacen_solicitante_id: selectedProduct.almacen.id,
                almacen_proovedor_id: parseInt(almacenProveedor),
                cantidad: cantidad,
                prioridad,
                motivo,
            });

            setsolicitudDialogOpen(false);
           
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
           
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        axios
            .get("/inventario/almacenes")
            .then((res) => setAlmacenes(res.data.data))
            .catch((err) => console.error("Error al cargar almacenes", err));
    }, []);

    return (
        <Dialog open={solicitudDialogOpen} onOpenChange={setsolicitudDialogOpen} >
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Solicitar Stock a Otro Almacén</DialogTitle>
                    <DialogDescription> Solicita stock de {selectedProduct?.producto.nombre} desde otros almacenes autorizados</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">Stock Bajo Detectado</span>
                        </div>

                        <div className="text-sm text-red-700">
                            <div className="font-medium">
                                {selectedProduct?.producto.nombre}
                            </div>
                            <div>
                                Stock actual:<span className="font-bold">{selectedProduct?.cantidad_actual}</span>| Mínimo:
                                <span className="font-bold">{selectedProduct?.stock_minimo}</span>
                            </div>
                            <div>
                                Almacén: {selectedProduct?.almacen.nombre}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Almacén solicitante</Label>
                            <Input type="text" value={selectedProduct?.almacen.nombre} disabled className="bg-gray-100 cursor-not-allowed"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Almacén proveedor</Label>
                            <Select onValueChange={(value) => setAlmacenProveedor(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {almacenes.map((almacen) => (
                                        <SelectItem key={almacen.id} value={almacen.id.toString()} >
                                            {almacen.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Cantidad solicitada</Label>
                            <Input  type="number" placeholder="0" value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value, 10)) } />
                        </div>
                        <div className="space-y-2">
                            <Label>Prioridad</Label>
                            <Select defaultValue={prioridad} onValueChange={setPrioridad} >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baja">Baja</SelectItem>
                                    <SelectItem value="Media">
                                        Media
                                    </SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Justificación</Label>
                        <Textarea placeholder="Motivo de la solicitud..." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setsolicitudDialogOpen(false)} >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-emerald-500 hover:bg-emerald-600"
                        disabled={loading || !almacenProveedor || cantidad <=0}
                    >
                         {loading ? "Enviando..." : "Enviar Solicitud"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
