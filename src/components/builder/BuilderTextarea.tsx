import React from 'react';
import { twMerge } from 'tailwind-merge';

type BuilderTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const BuilderTextarea = (props: BuilderTextareaProps) => {
    return (
        <textarea
            {...props}
            className={twMerge(
                "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-300 leading-relaxed focus:border-forest-green focus:bg-white focus:ring-4 focus:ring-forest-green/5 outline-none resize-none transition-all",
                props.className
            )}
        />
    );
};
