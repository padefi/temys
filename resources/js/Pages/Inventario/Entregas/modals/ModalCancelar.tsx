import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { EntregaItem } from "../EntregasManagement";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: EntregaItem | null;
    setMotivo: React.Dispatch<React.SetStateAction<string>>;
 
    motivo:string
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} /* modal={!modalBloqueado} */>
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
                       /*  disabled={modalBloqueado} */
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="destructive"
                        className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                        onClick={(e) => {
                            e.preventDefault();
                          /*   request?.id && confirmarCancelacion(request.id); */
                        }}
                       /*  disabled={!motivo.trim() || modalBloqueado} */
                    >
                        Confirmar Cancelación
                    </Button>
                    <Button
                        onClick={() => onClose()}
                      /*   disabled={modalBloqueado} */
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-3 py-4 cursor-pointer focus:outline-none focus:shadow-outline"
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}