import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { usePermissions } from "@/composables/permissions";
import { Plus } from "lucide-react";
import { StockTable } from "./StockTable";
import { StockItem } from "./Types";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Props {
    stockFiltrado: StockItem[];
    stocks: {
        data: StockItem[];
    };
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export function CardTable({
    stockFiltrado,
    stocks,
    currentPage,
    setCurrentPage

}: Props) {
    const { hasSubmenuPermission } = usePermissions();
    const itemsPerPage = 10;
    const [editedRows, setEditedRows] = useState<Record<number, number>>({})
    const totalPages = Math.ceil(stockFiltrado.length / itemsPerPage);


    const handleAplicarTodo = async () => {
        const dataRows = Object.entries(editedRows).map(([id, cantidad]) => ({
            id: Number(id),
            cantidad_contada: cantidad,
        }));

        try {
            const response = await axios.post("/actualizar-cantidad-contadas-masivo", {
                data: dataRows,
            });
            const data = await response.data;
            toast.success(data.message);
            setEditedRows({});

        } catch (error: any) {
            toast.error(error.response.data.message)
            console.error("Error al aplicar todo:", error);
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Inventario de Productos</CardTitle>
                    <CardDescription>Lista completa de productos con información de stock y ubicación</CardDescription>
                </div>
                <div>
                    {hasSubmenuPermission('inventarioFisico', 'update') &&
                        <Button size="sm" variant="outline" onClick={handleAplicarTodo} className="text-xs" disabled={Object.keys(editedRows).length === 0} >
                            <Plus className="h-3 w-3 mr-1" /> Aplicar todo
                        </Button> 
                        }
                </div>
            </CardHeader>
            <CardContent>
                <StockTable stockFiltrado={stockFiltrado} stocks={stocks} editedRows={editedRows} setEditedRows={setEditedRows} ></StockTable>

                {/* Controles de paginación */}
                <div className="flex justify-between items-center mt-4 px-4">
                    <div className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</div>
                    <div className="space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} >
                            Anterior
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

    )

}
