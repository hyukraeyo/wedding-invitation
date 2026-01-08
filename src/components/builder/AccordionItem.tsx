import React from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    icon?: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isCompleted?: boolean;
    badge?: string;
}

export const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children, isCompleted = false, badge }: AccordionItemProps) => {
    return (
        <div className={`rounded-2xl mb-4 border transition-all duration-500 ${isOpen
            ? 'bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] border-forest-green/20 ring-1 ring-forest-green/5'
            : 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]'
            }`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left transition-colors relative"
            >
                <div className="flex items-center gap-3.5">
                    {Icon && (
                        <div className={`p-2 rounded-xl transition-all duration-500 ${isOpen ? 'bg-forest-green/5 text-forest-green shadow-[inset_0_0_0_1px_rgba(74,93,69,0.1)]' : 'bg-gray-50 text-gray-400'}`}>
                            <Icon size={18} />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className={`text-[15px] transition-all duration-300 font-bold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                            {title}
                        </span>
                        {badge && (
                            <span className="text-[10px] text-yellow-600 font-black mt-0.5 tracking-tight">
                                {badge}
                            </span>
                        )}
                    </div>
                    {isCompleted && (
                        <div className="flex items-center justify-center w-5 h-5 bg-forest-green/90 rounded-full shadow-lg shadow-forest-green/10 ml-1">
                            <Check size={10} className="text-white" strokeWidth={5} />
                        </div>
                    )}
                </div>
                <div className={`p-1.5 rounded-lg transition-all duration-500 ${isOpen ? 'bg-gray-50 text-forest-green' : 'text-gray-300'}`}>
                    <ChevronDown size={16} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="px-5 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-500 ease-out">
                    <div className="h-[1px] bg-gray-50 mb-6 mx-1" />
                    {children}
                </div>
            )}
        </div>
    );
};
