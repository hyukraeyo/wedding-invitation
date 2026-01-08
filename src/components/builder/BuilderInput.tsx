import React from 'react';
import { twMerge } from 'tailwind-merge';

type BuilderInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const BuilderInput = (props: BuilderInputProps) => {

    return (
        <input
            {...props}
            className={twMerge(
                "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-300 focus:border-gray-400 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100 disabled:cursor-not-allowed",
                props.className
            )}
            style={{
                // Set focus ring/border color dynamically if focused
                // Since tailwind classes are static, we can use inline styles for the focus color if needed,
                // but a better way is to use a CSS variable or just a soft gray border for focus and a shadow for accent.
            }}
        />
    );
};
