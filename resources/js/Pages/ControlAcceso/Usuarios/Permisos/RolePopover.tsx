import { PropsWithChildren, useEffect, useState } from "react";
import { PopoverDialog, PopoverDialogContent, PopoverDialogTrigger } from "@/Components/ui/popoverDialog"
import { Button } from "@/Components/ui/button";
import { UserRound } from "lucide-react";
import { Skeleton } from "@/Components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";

interface Role {
  id: number;
  name: string;
}

interface RolePopoverProps {
  dataRole: { sectionName: string; option: string, idOption: number, roles: Role[], roleAssigned: string };
  loadingRole: boolean;
  onClick: () => void;
  onRoleChange: (option: string) => void;
}

export function RolePopover({ dataRole, loadingRole, onClick, onRoleChange }: PropsWithChildren<RolePopoverProps>) {   
  return (
    <PopoverDialog modal={false}>
      <PopoverDialogTrigger asChild>
        <Button
          className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
          variant="ghost"
          onClick={onClick}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <UserRound className="w-6! h-6! text-amber-500" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Asignar rol</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </PopoverDialogTrigger>
      <PopoverDialogContent onPointerDown={e => e.stopPropagation()}>
        {loadingRole ? (
          <div className="flex flex-col gap-2 py-2">
            <Skeleton className="h-4 w-[240px]" />
            <Skeleton className="h-4 w-[240px]" />
            <Skeleton className="h-[30px] w-[240px] rounded-xl" />
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <h4 className="font-medium leading-none">{dataRole.sectionName}</h4>
              <p className="text-sm text-muted-foreground">{dataRole.option}</p>
            </div>
            <div className="flex justify-center">
              <Select onValueChange={onRoleChange} defaultValue={dataRole.roleAssigned ? dataRole.roleAssigned.toUpperCase() : undefined}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Selecione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>ROLES</SelectLabel>
                    {dataRole.roles.map((role, index) => (
                      <SelectItem
                        key={index}
                        value={role.name.toUpperCase()}
                      >
                        {role.name.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverDialogContent>
    </PopoverDialog >
  )
}