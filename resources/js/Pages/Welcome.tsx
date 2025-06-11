import { usePermissions } from '@/composables/permissions';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

type Module = {
    name: string;
    key: string;
};

type PageProps = InertiaPageProps & {
    modules: {
        data: Array<Module>;
    };
};

export default function Welcome() {
    const { modules } = usePage<PageProps>().props;
    const { userAuth } = usePermissions();

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Dashboard" />

            <nav className="border-b border-gray-100 bg-white flex">
                <div className="hidden my-2 ml-auto mr-4 sm:flex sm:items-center">
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
                                <Link method="post" href={route('logout')} className='cursor-pointer'>Cerrar sesión</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav >

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {modules.data && modules.data.length > 0 && (
                                <div
                                    className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {modules.data.map((module: Module) => (
                                        <div
                                            key={module.key}
                                            className="flex flex-col items-center justify-between bg-gray-50 rounded-lg shadow hover:shadow-md transition p-4 aspect-square"
                                        >
                                            <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-teal-500/50 text-emerald-600 text-2xl">
                                                {/* Espacio para el icono */}
                                            </div>
                                            {route().has(module.key) ? (
                                                <Link
                                                    href={route(module.key)}
                                                    className="mt-auto text-center font-semibold text-gray-700 hover:text-emerald-600 transition"
                                                >
                                                    {module.name}
                                                </Link>
                                            ) : (
                                                <span className="mt-auto text-center font-semibold text-gray-500">{module.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
