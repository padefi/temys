import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import axios from "axios";


type Almacen = {
    id: number;
    nombre: string;
};
type AlmacenStock = {
    id: number;
    producto_id: number;
    nombre: string;
    nombre_producto: string;
    cantidad_actual: number
};

type Producto = {
    id: number;
    nombre: string;
};

type StockItem = {
    id: number;
    producto: Producto;
    almacen: Almacen;
    cantidad_actual: number;
    stock_minimo: number;
};

interface SolicitarStockProps {
    open: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    productos: StockItem[];

}

type SelectedProduct = {
    producto: StockItem;
    cantidad: number;
};

export const SolicitarStock: React.FC<SolicitarStockProps> = ({
    open,
    onClose,
    productos
}) => {

    const [almacenes, setAlmacenes] = useState<AlmacenStock[]>([]);
    const [almacenProveedor, setAlmacenProveedor] = useState("");
    const [prioridad, setPrioridad] = useState("Alta");
    const [motivo, setMotivo] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<SelectedProduct[]>([]);

    const [erroresCantidad, setErroresCantidad] = useState<Record<number, string>>({});


    useEffect(() => {
        const selectedProductoIds = selectedItems.map((item) => item.producto.producto.id);

        if (selectedProductoIds.length === 0) {
            setAlmacenes([]);
            return;
        }

        axios
            .get("/stock-producto-almacen", {
                params: { productos: selectedProductoIds },
            })
            .then((res) => setAlmacenes(res.data))
            .catch((err) => console.error("Error al cargar almacenes", err));
    }, [selectedItems]);



    const toggleProducto = (item: StockItem) => {
        setSelectedItems((prev) => {
            const exists = prev.find((p) => p.producto.id === item.id);
            if (exists) {
                return prev.filter((p) => p.producto.id !== item.id);
            } else {
                return [...prev, { producto: item, cantidad: 1 }];
            }
        });
    };

    const updateCantidad = (id: number, value: number) => {
        setSelectedItems((prev) =>
            prev.map((item) =>
                item.producto.id === id
                    ? { ...item, cantidad: value }
                    : item
            )
        );
    };

    const handleSubmit = async () => {
        if (!almacenProveedor || selectedItems.length === 0) return;
        setLoading(true);
 
        try {
            const payload = selectedItems.map((item) => ({
                producto_id: item.producto.producto.id,
                almacen_solicitante_id: item.producto.almacen.id,
                almacen_proveedor_id: parseInt(almacenProveedor),
                cantidad: item.cantidad,
                prioridad,
                motivo
            }));

            await axios.post("/solicitar-stock/multiple", { solicitudes: payload });

            onClose(false);
            setSelectedItems([]);
            setMotivo("");
            setAlmacenProveedor("");
        } catch (error) {
            console.error("Error al enviar solicitudes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!w-[1000px] !max-w-none">
                <DialogHeader>
                    <DialogTitle>Solicitar Stock a Otro Almacén</DialogTitle>
                    <DialogDescription>
                        Selecciona los productos que necesitas solicitar por bajo o sin stock.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {productos.map((item) => {
                        const isSelected = selectedItems.find((p) => p.producto.id === item.id);

                        return (
                            <div key={item.id} className="p-4 border rounded-md bg-gray-50 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Label className="font-semibold">{item.producto.nombre}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Stock actual: <strong>{item.cantidad_actual}</strong> | Mínimo:
                                            <strong>{item.stock_minimo}</strong> | Almacén:
                                            {item.almacen.nombre}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={item.stock_minimo}
                                            disabled={!isSelected}                                         
                                            className="w-[120px]"
                                            placeholder="Cantidad"
                                            value={isSelected?.cantidad || ""}
                                            onChange={(e) => {
                                                const valor = parseInt(e.target.value || "0", 10);
                                                const maximo = item.stock_minimo;

                                                if (valor > maximo) {
                                                    setErroresCantidad((prev) => ({
                                                        ...prev,
                                                        [item.id]: `No puedes solicitar más de ${maximo}`,
                                                    }));
                                                    updateCantidad(item.id, maximo);
                                                } else if (valor <= 0) {
                                                    setErroresCantidad((prev) => ({
                                                        ...prev,
                                                        [item.id]: "La cantidad debe ser mayor a 0",
                                                    }));
                                                    updateCantidad(item.id, valor);
                                                } else {
                                                    setErroresCantidad((prev) => {
                                                        const updated = { ...prev };
                                                        delete updated[item.id];
                                                        return updated;
                                                    });
                                                    updateCantidad(item.id, valor);
                                                }
                                            }}
                                        />
                                        {erroresCantidad[item.id] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {erroresCantidad[item.id]}
                                            </p>
                                        )}


                                        <input
                                            type="checkbox"
                                            checked={!!isSelected}
                                            onChange={() => toggleProducto(item)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label>Almacén proveedor</Label>
                            <Select onValueChange={setAlmacenProveedor} value={almacenProveedor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {almacenes.length === 0 ? (
                                        <div className="px-4 py-2 text-sm text-muted-foreground">No se encontraron almacenes disponibles</div>
                                    ) : (
                                        almacenes.map((almacen) => (
                                            <SelectItem
                                                key={`${almacen.producto_id}-${almacen.id}`}
                                                value={`${almacen.id}`}
                                                className="py-3 flex flex-col items-start space-y-1"
                                            >
                                                <span className="text-sm font-medium">🏢 {almacen.nombre}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {almacen.nombre_producto} — {almacen.cantidad_actual} disponibles
                                                </span>
                                            </SelectItem>

                                        ))

                                    )}

                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Prioridad</Label>
                            <Select defaultValue={prioridad} onValueChange={setPrioridad}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Baja">Baja</SelectItem>
                                    <SelectItem value="Media">Media</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Justificación</Label>
                        <Textarea
                            placeholder="Motivo de la solicitud..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-emerald-500 hover:bg-emerald-600"
                        disabled={
                            loading ||
                            !almacenProveedor ||
                            selectedItems.length === 0 ||
                            selectedItems.some((item) => item.cantidad <= 0)
                        }
                    >
                        {loading ? "Enviando..." : "Enviar Solicitudes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
