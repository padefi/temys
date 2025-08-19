"use client"

import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useBranchConfig } from '../contexts/active-branch';
import { Branch, PageProps } from '../types/index';
import { router, usePage } from '@inertiajs/react';
import { Hotel } from 'lucide-react';
import { toast } from 'sonner';

export default function BranchSelector() {
    const { branches } = usePage<PageProps>().props;
    const { activeBranch, setActiveBranch, setProcessingBranch } = useBranchConfig();

    const handleBranchChange = async (newBranchId: string) => {
        setProcessingBranch(true);

        router.post(
            route('user.update_branch'), { branch_id: newBranchId },
            {
                // Esto hará que el `Inertia::share` se ejecute nuevamente
                // y la página se actualice con los nuevos módulos y menús.
                // only: ['modules', 'menus', 'active_branch_id'],
                // replace: true,
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setActiveBranch(newBranchId);
                },
                onError: (errors: any) => {
                    toast.error(errors.message);
                    console.error(errors);
                },
                onFinish: () => {
                    setProcessingBranch(false);
                }
            }
        );
    };

    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="branch-selector" className="sr-only">Sucursal</Label>
            <Select value={activeBranch} onValueChange={handleBranchChange}>
                <SelectTrigger
                    id="branch-selector"
                    size="sm"
                    className="justify-start *:data-[slot=select-value]:w-auto border-dotted border-2 border-teal-500/50 focus-visible:border-teal-500/50 focus-visible:ring-0"
                >
                    <Hotel className="text-gray-950" />
                    <span className=" font-bold text-gray-900 hidden sm:block">
                        Sucursal:
                    </span>
                    <span className="text-muted-foreground block sm:hidden">Surcursal</span>
                    <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
                <SelectContent align="end">
                    <SelectGroup>
                        <SelectLabel>Surcursales</SelectLabel>
                        {branches.data.map((branch: Branch) => (
                            <SelectItem key={branch.id} value={String(branch.id)}>
                                {branch.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}