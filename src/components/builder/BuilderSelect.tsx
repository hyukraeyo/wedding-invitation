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

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
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

    return (
        <div className={`relative flex-1 ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-6 py-4.5 rounded-[24px] shadow-sm border transition-all text-left bg-white
                    ${isOpen ? 'border-forest-green ring-4 ring-forest-green/5' : 'border-gray-100 hover:border-gray-200'}`}
            >
                <span className={`text-[15px] font-serif font-bold ${selectedOption ? 'text-gray-800' : 'text-gray-300'} ${labelClassName}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-forest-green' : 'text-gray-300'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-[240px] overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-5 py-3.5 text-left text-[14px] transition-colors hover:bg-gray-50
                                    ${value === option.value ? 'text-forest-green font-bold bg-forest-green/[0.03]' : 'text-gray-600'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
