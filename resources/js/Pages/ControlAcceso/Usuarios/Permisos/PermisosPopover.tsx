import { PropsWithChildren, useEffect, useState } from "react";
import { PopoverDialog, PopoverDialogContent, PopoverDialogTrigger } from "@/Components/ui/popoverDialog"
import { Button } from "@/Components/ui/button";
import { Eye } from "lucide-react";
import { Checkbox } from "@/Components/ui/checkbox"
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";

interface PermisosPopoverProps {
  dataPermission: { sectionName: string; option: string, idOption: number, permissionAssigned: [] };
  loadingPermissions: boolean;
  onClick: () => void;
  onPermissionChange: (option: string) => void;
  disabled: boolean;
}

export function PermisosPopover({ dataPermission, loadingPermissions, onClick, onPermissionChange, disabled }: PropsWithChildren<PermisosPopoverProps>) {  
  return (
    <PopoverDialog modal={false}>
      <PopoverDialogTrigger asChild>
        <Button
          className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
          variant="ghost"
          disabled={disabled}
          onClick={onClick}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Eye className="w-6! h-6! text-cyan-400" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver permisos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </PopoverDialogTrigger>
      <PopoverDialogContent onPointerDown={e => e.stopPropagation()}>
        {loadingPermissions ? (
          <div className="flex flex-col gap-4 py-4">
            <Skeleton className="h-4 w-[240px]" />
            <Skeleton className="h-4 w-[240px]" />
            <Skeleton className="h-[50px] w-[240px] rounded-xl" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <h4 className="font-medium leading-none">{dataPermission.sectionName}</h4>
              <p className="text-sm text-muted-foreground">{dataPermission.option}</p>
            </div>
            <div className="flex flex-col font-semibold">
              <div className="flex flex-row justify-between">
                <div id="create" className="flex flex-col items-center">
                  <label>Crear</label>
                  <Checkbox id="create" onCheckedChange={() => onPermissionChange('create')}
                    checked={!!dataPermission.permissionAssigned.find((item: any) => item.name === 'create')} />
                </div>

                <div id="update" className="flex flex-col items-center">
                  <label>Modificar</label>
                  <Checkbox id="update" onCheckedChange={() => onPermissionChange('update')}
                    checked={!!dataPermission.permissionAssigned.find((item: any) => item.name === 'update')} />
                </div>

                <div id="confirm" className="flex flex-col items-center">
                  <label>Confirmar</label>
                  <Checkbox id="confirm" onCheckedChange={() => onPermissionChange('confirm')}
                    checked={!!dataPermission.permissionAssigned.find((item: any) => item.name === 'confirm')} />
                </div>
              </div>

              <div className="flex flex-row justify-center gap-6">
                <div id="avoid" className="flex flex-col items-center">
                  <label>Anular</label>
                  <Checkbox id="avoid" onCheckedChange={() => onPermissionChange('avoid')}
                    checked={!!dataPermission.permissionAssigned.find((item: any) => item.name === 'avoid')} />
                </div>

                <div id="restore" className="flex flex-col items-center">
                  <label>Restaurar</label>
                  <Checkbox id="restore" onCheckedChange={() => onPermissionChange('restore')}
                    checked={!!dataPermission.permissionAssigned.find((item: any) => item.name === 'restore')} />
                </div>
              </div>
            </div>
          </div>
        )}
      </PopoverDialogContent>
    </PopoverDialog>
  )
}