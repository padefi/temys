import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { EntregaItem } from "../EntregasManagement";
import axios from "axios";
import { router } from "@inertiajs/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: EntregaItem | null;
    setMotivo: React.Dispatch<React.SetStateAction<string>>;
    motivo: string
}

export default function CancelarEntrega({
    isOpen,
    onClose,
    request,
    setMotivo,
    motivo

}: ModalProps) {
    const handleClose = () => {
        onClose();
    };
    function Cancelar(id: any) {
        axios.post(route('entregas.cancelar', id), { motivo })
            .then(() => {
                handleClose();
                router.reload({ only: ['ordenEntregas'] });
            })
    }
    return (
        <Dialog open={isOpen} onOpenChange={handleClose} >
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Cancelar orden #{request?.id}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p>¿Estás seguro de que querés cancelar esta orden?</p>
                    <Textarea
                        placeholder="Motivo de la cancelación"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="destructive"
                        className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                        onClick={() => {
                            Cancelar(request?.id)
                        }}
                        disabled={!motivo.trim()} >
                        Confirmar Cancelación
                    </Button>
                    <Button
                        onClick={() => onClose()}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-3 py-4 cursor-pointer focus:outline-none focus:shadow-outline"
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
