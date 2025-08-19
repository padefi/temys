"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { usePermissions } from '@/composables/permissions';
import { Link } from '@inertiajs/react';
import { useBranchConfig } from '@/contexts/active-branch';
import { useModuleConfig } from '@/contexts/active-module';

export default function UserNav() {
    const { userAuth } = usePermissions();
    const { setActiveBranch } = useBranchConfig();
    const { setActiveModule } = useModuleConfig();

    return (
        <div className="flex items-center">
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 ring-0 focus:outline-none focus:ring-0 group"
                >
                    {userAuth.name}
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href={route('profile.edit')}>Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link onClick={() => { setActiveBranch(''), setActiveModule('')}} method="post" href={route('logout')} className='cursor-pointer'>Cerrar sesión</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}