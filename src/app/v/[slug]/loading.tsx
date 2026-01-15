import React from 'react';
import { Banana } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background p-4">
            <div className="relative">
                {/* Rotating Banana Icon */}
                <Banana className="h-12 w-12 text-primary animate-spin" />
            </div>

            {/* Subtle floating background elements */}
            <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}
