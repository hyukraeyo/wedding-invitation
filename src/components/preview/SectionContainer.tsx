import React from 'react';
import ScrollReveal from './ScrollReveal';

interface SectionContainerProps {
    children: React.ReactNode;
    className?: string;
    /** 
     * Optional id for scroll navigation
     */
    id?: string | undefined;
}

/**
 * Common wrapper for preview sections to provide consistent padding and layout.
 * Includes ScrollReveal animation by default.
 */
export default function SectionContainer({ children, className = "", id }: SectionContainerProps) {
    return (
        <ScrollReveal id={id}>
            <section
                className={`py-20 px-8 sm:px-10 flex flex-col relative items-center ${className}`}
            >
                {/* Max width to keep content focused on larger mobile screens/desktops */}
                <div className="w-full max-w-screen-sm">
                    {children}
                </div>
            </section>
        </ScrollReveal>
    );
}
