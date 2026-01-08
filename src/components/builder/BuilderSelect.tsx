import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

interface Option<T> {
    label: string;
    value: T;
}

interface BuilderSelectProps<T> {
    value: T;
    options: readonly Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
}

// Helper to add opacity to hex colors
const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const BuilderSelect = <T extends string | number>({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    labelClassName = ""
}: BuilderSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const accentColor = useInvitationStore(state => state.theme.accentColor);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleScroll = (event: Event) => {
            // Only close if the scroll happened outside of our container
            if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Active item scroll into view logic
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpen && listRef.current) {
            const activeItem = listRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior: 'instant' });
            }
        }
    }, [isOpen]);

    return (
        <div className={`relative flex-1 ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left bg-white border-gray-200
                    ${isOpen ? 'border-gray-400' : 'hover:border-gray-300 hover:bg-gray-50'}`}
                style={isOpen ? {
                    borderColor: accentColor,
                    boxShadow: `0 0 0 4px ${hexToRgba(accentColor, 0.05)}`
                } : {}}
            >
                <span className={`text-[14px] ${selectedOption ? 'text-gray-900' : 'text-gray-300'} ${labelClassName}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : 'text-gray-400'}`}
                    style={isOpen ? { color: accentColor } : {}}
                />
            </button>

            {isOpen && (
                <div
                    ref={listRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] z-[100] max-h-[280px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300"
                >
                    <div className="py-1.5 px-1.5">
                        {options.map((option, index) => {
                            const isActive = value === option.value;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    data-active={isActive}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-[14px] transition-all
                                        ${isActive
                                            ? 'font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]'}`}
                                    style={isActive ? {
                                        color: accentColor,
                                        backgroundColor: hexToRgba(accentColor, 0.06)
                                    } : {}}
                                >
                                    <span>{option.label}</span>
                                    {isActive && (
                                        <div
                                            className="w-1.5 h-1.5 rounded-full shadow-sm"
                                            style={{
                                                backgroundColor: accentColor,
                                                boxShadow: `0 0 8px ${hexToRgba(accentColor, 0.4)}`
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
