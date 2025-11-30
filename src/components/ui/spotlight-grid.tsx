"use client";

import { useEffect, useRef, ReactNode } from "react";

type SpotlightGridProps = {
    children: ReactNode;
    className?: string;
};

export function SpotlightGrid({ children, className = "" }: SpotlightGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!gridRef.current || !spotlightRef.current) return;

            const rect = gridRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spotlightRef.current.style.setProperty('--mouse-x', `${x}px`);
            spotlightRef.current.style.setProperty('--mouse-y', `${y}px`);
        };

        const grid = gridRef.current;
        if (grid) {
            grid.addEventListener('mousemove', handleMouseMove);
            return () => grid.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return (
        <div ref={gridRef} className={`spotlight-container ${className}`}>
            <div ref={spotlightRef} className="spotlight" />
            {children}
        </div>
    );
}
