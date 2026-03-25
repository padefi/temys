import Swal from "sweetalert2";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  mode: "create" | "edit";
  footerShadow: boolean;
  isFirst: boolean;
  isLast: boolean;
  processing: boolean;
  canNext: boolean;
  canSave: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function WizardFooter({
  mode,
  footerShadow,
  isFirst,
  isLast,
  processing,
  canNext,
  canSave,
  onPrev,
  onNext,
  onSubmit,
  onCancel,
}: Props) {
  const isEdit = mode === "edit";

  const actionLabel = isEdit ? "Editar Proveedor" : "Guardar Proveedor";
  const actionLoadingLabel = isEdit ? "Editando..." : "Guardando...";
  const swalTitle = isEdit ? "¿Editar proveedor?" : "¿Guardar proveedor?";
  const swalText = isEdit
    ? "Se actualizarán los datos cargados del proveedor."
    : "Se guardarán los datos cargados del proveedor.";
  const swalConfirmText = isEdit ? "Sí, editar" : "Sí, guardar";

  const handleConfirmSubmit = async () => {
    if (!canSave || processing) return;

    const modalEl = document.getElementById("proveedores-wizard-modal");

    const result = await Swal.fire({
      title: swalTitle,
      text: swalText,
      icon: "question",
      target: modalEl ?? undefined,
      backdrop: true,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: swalConfirmText,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    onSubmit();
  };

  return (
    <div
      className={cn(
        "border-t bg-background px-6 sm:px-8 py-4 shrink-0 sticky bottom-0 z-10 transition-shadow duration-300",
        footerShadow ? "shadow-[0_-10px_25px_rgba(0,0,0,0.18)]" : ""
      )}
    >
      <div className="w-full flex justify-end gap-3 sm:gap-4">
        <Button variant="outline" type="button" className="cursor-pointer" onClick={onCancel}>
          Cancelar
        </Button>

        <Button variant="outline" type="button" className="cursor-pointer" onClick={onPrev} disabled={isFirst}>
          Anterior
        </Button>

        {!isLast ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canNext || processing}
            className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleConfirmSubmit}
            disabled={!canSave || processing}
            className={cn("text-white", canSave ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "")}
          >
            {processing ? actionLoadingLabel : actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}