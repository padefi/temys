import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSkeletonProps {
    bodyKey: string;
    children: ReactNode;
}

export function AnimatedTableBody({ bodyKey, children }: AnimatedSkeletonProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.tbody
                key={bodyKey}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
            >
                {children}
            </motion.tbody>
        </AnimatePresence>
    );
}