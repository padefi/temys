"use client"

import { Link } from '@inertiajs/react';
import { ChevronsRight, House } from 'lucide-react';
import { formatString } from '@/utils/formatterFunctions';
import { useModuleConfig } from '@/contexts/active-module';

export default function ModuleNav() {
    const { activeModule, setActiveModule } = useModuleConfig();

    return (
        <div className="flex items-center gap-2">
            <Link
                onClick={() => setActiveModule('')}
                href={route('welcome')}
                className="text-center font-semibold text-gray-700 hover:text-emerald-600 transition"
            >
                <House className="w-5 h-5" />
            </Link>
            <div className='font-bold flex items-center gap-2 ml-2'>
                <span>{formatString(activeModule)}</span>
                <ChevronsRight className="h-4 w-4" />
            </div>
        </div>
    );
}