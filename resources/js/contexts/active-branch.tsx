"use client"

import { PageProps } from "@/types"
import { usePage } from "@inertiajs/react"
import { AnimatePresence, motion } from "framer-motion"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type BranchContextType = {
    activeBranch: string
    setActiveBranch: (id: string) => void;
    setProcessingBranch: (processing: boolean) => void
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function ActiveBranchProvider({
    children,
}: {
    children: ReactNode
}) {
    const { active_branch_id = '' } = usePage<PageProps>().props;
    const [activeBranch, setActiveBranch] = useState<string>(active_branch_id || "");
    const [processingBranch, setProcessingBranch] = useState<boolean>(false);

    useEffect(() => {
        setActiveBranch(active_branch_id || "");
    }, [active_branch_id]);

    return (
        <BranchContext.Provider value={{ activeBranch, setActiveBranch, setProcessingBranch }}>
            <AnimatePresence>
                {processingBranch && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
                    >
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                    </motion.div>
                )}

                {children}
            </AnimatePresence>
        </BranchContext.Provider>
    );
}

export function useBranchConfig() {
    const context = useContext(BranchContext)
    if (context === undefined) {
        throw new Error("useBranchConfig must be used within an ActiveBranchProvider")
    }
    return context
}