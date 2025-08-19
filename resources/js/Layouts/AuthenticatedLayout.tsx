import { Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Button } from '@/Components/ui/button';
import { House, MenuIcon } from 'lucide-react';
import { ReactNode, PropsWithChildren, useEffect } from 'react';
import { Toaster } from '@/Components/ui/sonner';
import { formatString } from '@/utils/formatterFunctions';
import { AnimatePresence, motion } from "framer-motion";
import { useModuleConfig } from '@/contexts/active-module';
import { ActiveBranchProvider } from '@/contexts/active-branch';
import { toast } from 'sonner';
import BranchSelector from '@/Components/BranchSelector';
import UserNav from '@/Components/UserNav';
import ModuleNav from '@/Components/ModuleNav';
import { FlashMessage } from '@/types';

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
    flash: FlashMessage;
};

export default function Authenticated({ children }: PropsWithChildren<AuthenticatedProps>) {
    const { menus, flash } = usePage<PageProps>().props;
    const { activeModule } = useModuleConfig();

    const modulo = menus.modulo;
    const menusList = menus.menus || { data: [] };

    useEffect(() => {
        if (flash?.message) {
            toast[flash.type || 'info'](flash.message);
        }
    }, [flash]);

    return (
        <ActiveBranchProvider>
            <div className="min-h-screen bg-gray-100">
                <nav className="border-b border-gray-100 bg-white flex py-0.5">
                    {/* Menubar para desktop */}
                    {activeModule && modulo &&
                        <>
                            <Menubar className="hidden md:flex md:flex-row rounded-none border-b border-none shadow-none">
                                <ModuleNav />
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
                        </>
                    }

                    <div className="ml-auto mr-4 flex items-center gap-10">
                        <BranchSelector />
                        <UserNav />
                    </div>
                </nav>
                <main>
                    <AnimatePresence>
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
                <Toaster position="top-right" expand={true} richColors />
            </div >
        </ActiveBranchProvider>
    );
};
