import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedEditableProps {
    isEditing: boolean;
    identity: string;
    children: ReactNode;
}

export function AnimatedEditableRow({ isEditing, identity, children }: AnimatedEditableProps) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={`${identity}_${isEditing ? "editing" : "view"}`}
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                exit={{ rotateX: 90 }}
                transition={{ duration: 0.2 }}
            // className={cell.column.columnDef.id === 'acciones' ? 'w-33.75 whitespace-nowrap' : ''}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}