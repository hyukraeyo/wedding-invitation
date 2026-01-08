import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option<T> {
    label: string;
    value: T;
}

interface BuilderSelectProps<T> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
    labelClassName?: string;
}

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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left bg-gray-50
                    ${isOpen ? 'border-forest-green bg-white ring-4 ring-forest-green/5' : 'border-gray-100 hover:border-gray-200 hover:bg-white'}`}
            >
                <span className={`text-[14px] font-bold ${selectedOption ? 'text-gray-900' : 'text-gray-300'} ${labelClassName}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-forest-green' : 'text-gray-400'}`} />
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
                                            ? 'text-forest-green font-bold bg-forest-green/[0.06]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]'}`}
                                >
                                    <span>{option.label}</span>
                                    {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-forest-green shadow-[0_0_8px_rgba(74,93,69,0.4)]" />
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
