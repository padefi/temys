import { AnimatePresence, motion } from "framer-motion";
import { ErrorMessage } from "../ui/error-message";

export function AnimatedError({ error }: { error: string | null }) {
    return (
        <AnimatePresence initial={false}>
            {error && (
                <motion.div
                    key="error-message"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                >
                    <ErrorMessage>{error}</ErrorMessage>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
