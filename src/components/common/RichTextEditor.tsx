'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Highlighter,
    Type
} from 'lucide-react';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string; // Outer container class
    minHeight?: string; // e.g. "min-h-[100px]"
}

// ToolbarButton component - declared outside render to follow React Hooks rules
const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    className = ""
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    className?: string;
}) => (
    <button
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${isActive
            ? 'bg-gray-100 text-gray-900 border border-gray-200'
            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            } ${className}`}
    >
        {children}
    </button>
);

export default function RichTextEditor({ content, onChange, placeholder, className = "", minHeight = "min-h-[180px]" }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-sm focus:outline-none max-w-none ${minHeight} px-6 py-6 text-[15px] leading-[1.8] text-gray-700 font-pretendard`,
                placeholder: placeholder || '내용을 입력하세요...',
            },
        },
    });

    // Handle external content updates (e.g. from samples)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={twMerge("border border-gray-200 rounded-xl overflow-hidden bg-white transition-all focus-within:border-gray-400", className)}>
            {/* Minimal Toolbar - Minimalist / Modern Style */}
            <div className="flex items-center gap-0.5 p-1.5 border-b border-gray-100 bg-gray-50/50">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                >
                    <UnderlineIcon size={18} />
                </ToolbarButton>

                <div className="w-[1px] h-4 bg-gray-200 mx-1.5 opacity-50"></div>

                <div className="flex items-center">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setColor('#8B5E3C').run()}
                        isActive={editor.isActive('textStyle', { color: '#8B5E3C' })}
                    >
                        <Type size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFECD1' }).run()}
                        isActive={editor.isActive('highlight', { color: '#FFECD1' })}
                    >
                        <Highlighter size={18} />
                    </ToolbarButton>
                </div>

                <div className="w-[1px] h-4 bg-gray-200 mx-1.5 opacity-50"></div>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                >
                    <AlignLeft size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                >
                    <AlignCenter size={18} />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                >
                    <AlignRight size={18} />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} className="bg-white" />
        </div>
    );
}
