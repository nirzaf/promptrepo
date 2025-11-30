"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!bgRef.current) return;

            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 100;
            const y = (clientY / window.innerHeight) * 100;

            bgRef.current.style.setProperty('--mouse-x', `${x}%`);
            bgRef.current.style.setProperty('--mouse-y', `${y}%`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="dynamic-bg" ref={bgRef}>
            <div className="mesh-gradient" />
            <div
                className="mesh-gradient"
                style={{
                    animation: 'mesh-gradient-alt 25s ease infinite',
                    opacity: 0.5
                }}
            />
        </div>
    );
}
