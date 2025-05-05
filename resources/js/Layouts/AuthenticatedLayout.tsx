import { Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/Components/ui/menubar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Button } from '@/Components/ui/button';
import { ChevronDown, MenuIcon } from 'lucide-react';
import { ReactNode, Fragment, PropsWithChildren } from 'react';
import { usePermissions } from '@/composables/permissions';
import { Toaster } from '@/Components/ui/sonner';

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

type Module = {
    name: string;
    key: string;
    menus?: Menu[];
};

type AuthenticatedProps = {
    header?: ReactNode;
    children?: ReactNode;
};

type PageProps = InertiaPageProps & {
    modules: {
        data: Array<Module>;
    };
};

export default function Authenticated({ children }: PropsWithChildren<AuthenticatedProps>) {
    const { modules } = usePage<PageProps>().props;
    const { userAuth } = usePermissions();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white flex">

                {/* DropdownMenu */}
                <div className="flex items-center justify-between px-2 md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <MenuIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {modules.data && modules.data.length > 0 && (
                                modules.data.map((module, index) => (
                                    <DropdownMenuGroup key={index + module.name}>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>{module.name}</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {module.menus && module.menus.length > 0 ? (
                                                        module.menus.map((menu) => (
                                                            menu.submenus && menu.submenus.length > 0 ? (
                                                                menu.submenus.map((submenu, index) => (
                                                                    <DropdownMenuItem key={index + submenu.name} asChild>
                                                                        <Link href={route(submenu.key)}>{submenu.name}</Link>
                                                                    </DropdownMenuItem>
                                                                ))
                                                            ) : (
                                                                <DropdownMenuItem key={menu.id + menu.name}>
                                                                    <Link href={route(module.key + '.' + menu.key)}>{menu.name}</Link>
                                                                </DropdownMenuItem>
                                                            )
                                                        ))
                                                    ) : (
                                                        <DropdownMenuItem className="italic">No hay menús disponibles</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* MenuBar */}
                <Menubar className="hidden md:flex md:flex-row rounded-none border-b border-none shadow-none">
                    {modules && modules.data.length > 0 && (
                        modules.data.map((module, index) => (
                            <MenubarMenu key={index + module.name}>
                                <MenubarTrigger>{module.name}</MenubarTrigger>
                                <MenubarContent className="hidden md:flex md:flex-col">
                                    {module.menus && module.menus.length > 0 ? (
                                        module.menus.map((menu, indexMenu) => (
                                            <Fragment key={indexMenu + menu.name}>
                                                {menu.submenus && menu.submenus.length > 0 ? (
                                                    <MenubarSub>
                                                        <MenubarSubTrigger>{menu.name}</MenubarSubTrigger>
                                                        <MenubarSubContent>
                                                            {menu.submenus.map((submenu, index) => (
                                                                <MenubarItem key={index + submenu.name} asChild>
                                                                    <Link href={route(submenu.key)}>{submenu.name}</Link>
                                                                </MenubarItem>
                                                            ))}
                                                        </MenubarSubContent>
                                                    </MenubarSub>
                                                ) : (
                                                    <MenubarItem key={menu.id + menu.name}>
                                                        <Link href={route(module.key + '.' + menu.key)}>{menu.name}</Link>
                                                    </MenubarItem>
                                                )}
                                            </Fragment>
                                        ))
                                    ) : (
                                        <MenubarItem className="italic">No hay menús disponibles</MenubarItem>
                                    )}
                                </MenubarContent>
                            </MenubarMenu>
                        ))

                    )}
                </Menubar>

                <div className="hidden ml-auto mr-4 sm:flex sm:items-center">
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
                                <Link method="post" href={route('logout')} className='cursor-pointer'>Log Out</Link>
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
