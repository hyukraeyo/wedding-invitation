import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    icon?: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isCompleted?: boolean;
}

export const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children, isCompleted = false }: AccordionItemProps) => {
    return (
        <div className="bg-white rounded-xl mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className={`text-forest-green ${isOpen ? 'opacity-100' : 'opacity-70'}`} />}
                    <span className={`font-medium text-gray-800 ${isOpen ? 'text-forest-green font-semibold' : ''}`}>{title}</span>
                    {isCompleted && !isOpen && <CheckCircle2 size={16} className="text-forest-green/60 ml-2" />}
                </div>
                {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            {isOpen && (
                <div className="px-5 pb-6 pt-1 border-t border-gray-100/50 animate-in fade-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};
