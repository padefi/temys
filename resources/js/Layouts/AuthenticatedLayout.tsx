import { Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Button } from '@/Components/ui/button';
import { ChevronDown, ChevronsRight, House, MenuIcon } from 'lucide-react';
import { ReactNode, PropsWithChildren } from 'react';
import { usePermissions } from '@/composables/permissions';
import { Toaster } from '@/Components/ui/sonner';
import { formatString } from '@/utils/formatterFunctions';

type Submenu = {
    name: string;
    key: string;
};

type Menu = {
    name: string;
    key: string;
    id: number;
    submenus?: Submenu[];
};

type AuthenticatedProps = {
    header?: ReactNode;
    children?: ReactNode;
};

type PageProps = InertiaPageProps & {
    menus: {
        modulo: string;
        menus: {
            data: Menu[];
        };
    };
};

export default function Authenticated({ children }: PropsWithChildren<AuthenticatedProps>) {
    const { menus } = usePage<PageProps>().props;
    const { userAuth } = usePermissions();

    const modulo = menus.modulo;
    const menusList = menus.menus || { data: [] };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white flex">

                {/* Menubar para desktop */}
                <Menubar className="hidden md:flex md:flex-row rounded-none border-b border-none shadow-none">
                    <Link
                        href={route('welcome')}
                        className="text-center font-semibold text-gray-700 hover:text-emerald-600 transition"
                    >
                        <House className="w-5 h-5" />
                    </Link>
                    <div className='font-bold flex items-center gap-2 ml-2'>
                        <span>{formatString(modulo)}</span>
                        <ChevronsRight className="h-4 w-4" />
                    </div>
                    <div className='flex font-semibold'>
                        {menusList.data && menusList.data.length > 0 && (
                            menusList.data.map((menu, index) => (
                                menu.submenus && menu.submenus.length > 0 ? (
                                    <MenubarMenu key={index + menu.name}>
                                        <MenubarTrigger className='lg:text-base! text-[15px]!'>{menu.name}</MenubarTrigger>
                                        <MenubarContent className="hidden md:flex md:flex-col">
                                            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
                                                {menu.submenus.map((submenu, subIndex) => (
                                                    <MenubarItem key={subIndex + submenu.name} asChild>
                                                        {route().has(submenu.key) ? (
                                                            <Link href={route(submenu.key)} className="cursor-pointer lg:text-base! text-[15px]!">{submenu.name}</Link>
                                                        ) : (
                                                            <span className="lg:text-base! text-[15px]!">{submenu.name}</span>
                                                        )}
                                                    </MenubarItem>
                                                ))}
                                            </div>
                                        </MenubarContent>
                                    </MenubarMenu>
                                ) : (
                                    <MenubarMenu key={index + menu.name}>
                                        <MenubarTrigger asChild>
                                            {route().has(modulo + '.' + menu.key) ? (
                                                <Link href={route(modulo + '.' + menu.key)} className="cursor-pointer lg:text-base! text-[15px]!">{menu.name}</Link>
                                            ) : (
                                                <span className="lg:text-base! text-[15px]!">{menu.name}</span>
                                            )}
                                        </MenubarTrigger>
                                    </MenubarMenu>
                                )
                            ))
                        )}
                    </div>
                </Menubar>

                {/* DropdownMenu para mobile */}
                <div className="flex items-center justify-between md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <MenuIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <span className='font-bold'>{formatString(modulo)}</span>
                        <DropdownMenuContent className="w-56">
                            <div className='px-2'>
                                <Link
                                    href={route('welcome')}
                                    className="text-center font-semibold text-gray-700 hover:text-emerald-600 transition"
                                >
                                    <House className="w-5 h-5" />
                                </Link>
                            </div>
                            {menusList.data && menusList.data.length > 0 && (
                                menusList.data.map((menu, index) => (
                                    menu.submenus && menu.submenus.length > 0 ? (
                                        <DropdownMenuSub key={index + menu.name}>
                                            <DropdownMenuSubTrigger>{menu.name}</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <div className="max-h-[calc(100vh-5rem)] overflow-y-auto">
                                                        {menu.submenus.map((submenu, subIndex) => (
                                                            <DropdownMenuItem key={subIndex + submenu.name} asChild>
                                                                {route().has(submenu.key) ? (
                                                                    <Link href={route(submenu.key)} className="cursor-pointer">{submenu.name}</Link>
                                                                ) : (
                                                                    <span>{submenu.name}</span>
                                                                )}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </div>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    ) : (
                                        <DropdownMenuItem key={index + menu.name} asChild>
                                            {route().has(modulo + '.' + menu.key) ? (
                                                <Link href={route(modulo + '.' + menu.key)} className="cursor-pointer">{menu.name}</Link>
                                            ) : (
                                                <span>{menu.name}</span>
                                            )}
                                        </DropdownMenuItem>
                                    )
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="ml-auto mr-4 flex items-center">
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
            <main>{children}</main>
            <Toaster position="top-right" expand={true} richColors />
        </div >
    );
};
