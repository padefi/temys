import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

import type { StepId } from "../utils/proveedorWizard";

type NavStep = { id: StepId; label: string };

type Props = {
  steps: NavStep[];
  currentId: StepId;
  currentIndex: number;

  canGoToStep: (id: StepId) => boolean;
  onGoTo: (id: StepId) => void;

  stepState: (index: number, id: StepId) => { isCompleted: boolean; isActive: boolean; isError: boolean };
};

const IncompleteBadge = () => (
  <span className="mt-0.5 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
    Incompleto
  </span>
);

export default function WizardNav({ steps, currentIndex, stepState, canGoToStep, onGoTo }: Props) {
  return (
    <div className="border-b bg-muted/20 shrink-0">
      <div className="px-4 sm:px-6 py-3 sm:py-4 overflow-x-auto">
        <div className="min-w-[900px] max-w-[1100px] mx-auto">
          <div className="flex items-center">
            {steps.map((s, index) => {
              const { isCompleted, isActive, isError } = stepState(index, s.id);

              const circleClass = isError
                ? "bg-red-600 text-white ring-2 ring-red-200 cursor-pointer"
                : isCompleted
                ? "bg-green-600 text-white ring-2 ring-green-200 cursor-pointer"
                : isActive
                ? "bg-foreground text-background ring-2 ring-foreground/20 cursor-pointer"
                : "bg-gray-200 text-gray-700 cursor-pointer";

              const labelClass = isActive
                ? "text-foreground font-semibold"
                : isCompleted
                ? "text-foreground/80"
                : "text-muted-foreground";

              const lineClass = index < currentIndex ? "bg-green-600" : "bg-gray-300";

              return (
                <div key={s.id} className="flex-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => onGoTo(s.id)}
                    disabled={!canGoToStep(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 min-w-[92px] transition-opacity",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold",
                        "transition-all duration-300",
                        circleClass,
                        isActive ? "scale-[1.03]" : "scale-100"
                      )}
                    >
                      {isError ? <X className="h-4 w-4" /> : isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className={cn("text-[11px] leading-tight text-center transition-colors", labelClass)}>
                        {s.label}
                      </div>
                      {isError && !isActive && <IncompleteBadge />}
                    </div>
                  </button>

                  {index < steps.length - 1 && (
                    <div className="flex-1 px-3">
                      <div className={cn("h-[2px] w-full rounded transition-colors duration-300", lineClass)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}