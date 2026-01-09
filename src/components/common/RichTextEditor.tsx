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
import styles from '../builder/Builder.module.scss';
import { clsx } from 'clsx';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string; // Outer container class
    minHeight?: string; // e.g. "min-h-[100px]" - handled via style in SCSS or inline
}

// ToolbarButton component
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
        className={clsx(styles.toolbarButton, isActive && styles.active, className)}
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
                // Classes are handled by :global(.ProseMirror) in SCSS, but placeholder might need Tiptap extension or CSS
                class: `focus:outline-none`,
                // placeholder: placeholder || '내용을 입력하세요...', // Tiptap placeholder extension needed for this to show visually via CSS
            },
        },
    });

    // Handle external content updates
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={clsx(styles.richTextEditor, className)}>
            {/* Minimal Toolbar */}
            <div className={styles.toolbar}>
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

                <div className={styles.separator}></div>

                <div className={styles.group}>
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

                <div className={styles.separator}></div>

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

            <EditorContent
                editor={editor}
                className={styles.content}
                style={{
                    minHeight: minHeight.replace('min-h-[', '').replace(']', '')
                }}
            />
        </div>
    );
}
