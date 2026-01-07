import React from 'react';
import { twMerge } from 'tailwind-merge';

type BuilderTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const BuilderTextarea = (props: BuilderTextareaProps) => {
    return (
        <textarea
            {...props}
            className={twMerge(
                "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 leading-relaxed focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none resize-none transition-colors",
                props.className
            )}
        />
    );
};
