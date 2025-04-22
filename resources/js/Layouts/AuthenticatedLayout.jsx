import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '@/Components/ui/button';
import { ChevronDown, MenuIcon } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { modules } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white flex">

                {/* DropdownMenu */}
                <div className="flex items-center justify-between px-2 md:hidden">
                    <DropdownMenu className="flex items-center justify-between px-2 md:hidden">
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <MenuIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            {modules && modules.data.length > 0 && (
                                modules.data.map((module, index) => (
                                    <DropdownMenuGroup key={index + module.name}>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>{module.name}</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {module.menus && module.menus.length > 0 ? (
                                                        module.menus.map((menu, indexMenu) => (
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
                                )))}
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
                            {user.name}
                            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={route('profile.edit')}>Perfil</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link method="post" href={route('logout')}>Log Out</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav >
            {
                header && (
                    <header className="bg-white shadow-sm">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )
            }

            <main>{children}</main>
        </div >
    );
}
