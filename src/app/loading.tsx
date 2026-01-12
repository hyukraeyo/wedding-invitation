import React from 'react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background p-4">
            <div className="relative mb-8">
                {/* Premium Spinner */}
                <div className="h-12 w-12 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border border-primary/10" />
            </div>

            <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-serif tracking-widest text-primary animate-pulse uppercase">
                    Loading
                </h2>
                <div className="h-[1px] w-12 bg-primary/30" />
                <p className="text-xs text-muted-foreground/60 font-light">
                    Wedding Invitation Studio
                </p>
            </div>

            {/* Subtle floating background elements */}
            <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}
