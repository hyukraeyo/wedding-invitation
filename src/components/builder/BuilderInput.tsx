import React from 'react';
import { twMerge } from 'tailwind-merge';

type BuilderInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const BuilderInput = (props: BuilderInputProps) => {
    return (
        <input
            {...props}
            className={twMerge(
                "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none transition-colors",
                props.className
            )}
        />
    );
};
