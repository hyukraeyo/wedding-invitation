import React from 'react';
import { twMerge } from 'tailwind-merge';

type BuilderInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const BuilderInput = (props: BuilderInputProps) => {
    return (
        <input
            {...props}
            className={twMerge(
                "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-300 focus:border-forest-green focus:bg-white focus:ring-4 focus:ring-forest-green/5 outline-none transition-all",
                props.className
            )}
        />
    );
};
