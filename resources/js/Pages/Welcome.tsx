import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AnimatePresence, motion } from "framer-motion";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useModuleConfig } from '@/contexts/active-module';

type Module = {
    name: string;
    key: string;
};

type PageProps = InertiaPageProps & {
    modules: {
        data: Array<Module>;
    }
};

export default function Welcome() {
    const { modules } = usePage<PageProps>().props;
    const { setActiveModule } = useModuleConfig();    

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <AnimatePresence>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-6">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {modules.data && modules.data.length > 0 ? (
                                <motion.div
                                    key="modules"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                >
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
                                                        onClick={() => setActiveModule(module.key)}
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
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="without-modules"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                >
                                    <span className="text-center font-semibold text-gray-500">
                                        No hay módulos disponibles
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </AnimatePresence>
        </AuthenticatedLayout >
    );
}
