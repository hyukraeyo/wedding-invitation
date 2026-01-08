import React from 'react';
import { twMerge } from 'tailwind-merge';

type BuilderTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const BuilderTextarea = (props: BuilderTextareaProps) => {

    return (
        <textarea
            {...props}
            className={twMerge(
                "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-300 leading-relaxed focus:border-gray-400 outline-none resize-none transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100 disabled:cursor-not-allowed",
                props.className
            )}
            style={{
                // Inline styles for focus color can optionally be handled via focus-within container wrapper or just keep it simple.
                // For now, let's keep it clean without hard borders on focus for textarea unless needed.
            }}
        />
    );
};
