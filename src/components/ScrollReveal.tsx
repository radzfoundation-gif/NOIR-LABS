import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    mode?: "fade-up" | "fade-in" | "scale-up" | "slide-right" | "slide-left";
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
    once?: boolean;
}

const variants: Record<string, Variants> = {
    "fade-up": {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    },
    "fade-in": {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    "scale-up": {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    },
    "slide-right": {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    },
    "slide-left": {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    },
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    width = "fit-content",
    mode = "fade-up",
    delay = 0,
    duration = 0.5,
    className = "",
    threshold = 0.2,
    once = true
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: once, amount: threshold });

    return (
        <motion.div
            ref={ref}
            variants={variants[mode]}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};
