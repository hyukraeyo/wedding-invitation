import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface AccordionItemProps {
    title: string;
    icon?: React.ElementType;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isCompleted?: boolean;
    badge?: string;
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children, isCompleted = false, badge }: AccordionItemProps) => {
    const { theme } = useInvitationStore();
    const accentColor = theme.accentColor;
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && containerRef.current) {
            // Small delay to ensure the accordion transition has started/layout updated
            const timer = setTimeout(() => {
                containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [isOpen]);

    return (
        <div
            ref={containerRef}
            className={`rounded-2xl mb-4 border transition-all duration-500 bg-white ${isOpen
                ? 'shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] ring-1'
                : 'shadow-[0_4px_12px_rgba(0,0,0,0.02)] border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]'
                }`}
            style={isOpen ? {
                borderColor: hexToRgba(accentColor, 0.2),
                boxShadow: `0 20px 40px -12px rgba(0,0,0,0.06), 0 0 0 1px ${hexToRgba(accentColor, 0.05)}`
            } : {}}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left transition-colors relative"
            >
                <div className="flex items-center gap-3.5">
                    {Icon && (
                        <div
                            className={`p-2 rounded-xl transition-all duration-500 ${isOpen ? 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]' : 'bg-gray-50 text-gray-400'}`}
                            style={isOpen ? {
                                backgroundColor: hexToRgba(accentColor, 0.05),
                                color: accentColor
                            } : {}}
                        >
                            <Icon size={18} />
                        </div>
                    )}
                    <div className="flex flex-row items-center gap-2">
                        <span className={`text-[15px] transition-all duration-300 font-bold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                            {title}
                        </span>
                        {badge && (
                            <span className="text-[10px] text-yellow-600 font-black tracking-tight bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">
                                {badge}
                            </span>
                        )}
                    </div>
                    {isCompleted && (
                        <div
                            className="flex items-center justify-center w-5 h-5 rounded-full ml-1"
                            style={{
                                backgroundColor: accentColor,
                                boxShadow: `0 4px 12px ${hexToRgba(accentColor, 0.3)}`
                            }}
                        >
                            <Check size={10} className="text-white" strokeWidth={5} />
                        </div>
                    )}
                </div>
                <div
                    className={`p-1.5 rounded-lg transition-all duration-500 ${isOpen ? 'bg-gray-50' : 'text-gray-300'}`}
                    style={isOpen ? { color: accentColor } : {}}
                >
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
