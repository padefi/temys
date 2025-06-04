import { PropsWithChildren } from "react";
import { PopoverDialog, PopoverDialogContent, PopoverDialogTrigger } from "@/Components/ui/popoverDialog"
import { Button } from "@/Components/ui/button";
import { MinusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";

interface ConfirmPopoverProps {
  seccion: string,
  opcion: string,
  onClick: () => void;
}

export function ConfirmPopover({ seccion, opcion, onClick }: PropsWithChildren<ConfirmPopoverProps>) {
  return (
    <PopoverDialog modal={false}>
      <PopoverDialogTrigger asChild>
        <Button
          className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(199,0,54,0.5)]"
          variant="ghost">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <MinusCircle className="w-6! h-6! text-red-400" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quitar {seccion}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </PopoverDialogTrigger>
      <PopoverDialogContent onPointerDown={e => e.stopPropagation()}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium py-2 cursor-default">¿Está seguro de quitar el acceso al <b className="text-base">{seccion}</b> <b className="text-red-500 text-base">{opcion}</b>?</p>
          </div>
          <Button variant="destructive" onClick={onClick}>Quitar acceso</Button>
        </div>
      </PopoverDialogContent>
    </PopoverDialog>
  )
}