import React, { useId } from 'react';

interface BuilderCheckboxProps {
    id?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

export function BuilderCheckbox({ id, checked, onChange, children, className = '' }: BuilderCheckboxProps) {
    const internalId = useId();
    const generatedId = id || internalId;

    return (
        <label
            htmlFor={generatedId}
            className={`flex items-center gap-2.5 cursor-pointer group select-none ${className}`}
        >
            <div className="relative flex items-center justify-center">
                <input
                    id={generatedId}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div
                    className={`
                        w-[18px] h-[18px] rounded-[4px] border-2 transition-all duration-200 flex items-center justify-center
                        ${checked
                            ? 'bg-black border-black shadow-sm'
                            : 'bg-white border-gray-200 group-hover:border-gray-300'}
                    `}
                >
                    {checked && (
                        <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="animate-in zoom-in-50 duration-200"
                        >
                            <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
            </div>
            {children && (
                <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                    {children}
                </span>
            )}
        </label>
    );
}
