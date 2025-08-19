"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

const DEFAULT_MODULE = ""

type ModuleContextType = {
    activeModule: string
    setActiveModule: (Module: string) => void
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined)

export function ActiveModuleProvider({
    children,
    initialModule,
}: {
    children: ReactNode
    initialModule?: string
}) {
    const [activeModule, setActiveModule] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const storedBranch = localStorage.getItem('activeModule');
            if (storedBranch) {
                return storedBranch;
            }
        }

        return initialModule || DEFAULT_MODULE;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeModule', activeModule);
        }

        if (activeModule === '') {
            localStorage.removeItem('activeModule');
        }

        Array.from(document.body.classList)
            .filter((className) => className.startsWith("module-"))
            .forEach((className) => {
                document.body.classList.remove(className)
            })
        document.body.classList.add(`module-${activeModule}`)
        if (activeModule.endsWith("-scaled")) {
            document.body.classList.add("module-scaled")
        }
    }, [activeModule]);

    return (
        <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
            {children}
        </ModuleContext.Provider>
    );
}

export function useModuleConfig() {
    const context = useContext(ModuleContext)
    if (context === undefined) {
        throw new Error("useModuleConfig must be used within an ActiveModuleProvider")
    }
    return context
}