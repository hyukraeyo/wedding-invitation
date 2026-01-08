import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface BuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const BuilderModal = ({ isOpen, onClose, title, children, className = "" }: BuilderModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={twMerge(
                "relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300",
                className
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};
