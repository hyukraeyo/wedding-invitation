'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
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
    className?: string;
    minHeight?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    className = "",
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    className?: string;
    title?: string;
}) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        className={clsx(styles.toolbarButton, isActive && styles.active, className)}
        title={title}
    >
        {children}
    </button>
);

export default function RichTextEditor({ content, onChange, placeholder, className = "", minHeight = "min-h-[240px]" }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
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
                class: `focus:outline-none`,
                'data-placeholder': placeholder || '',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);


    if (!editor) return null;

    return (
        <div className={clsx(styles.richTextEditor, className)}>
            <div className={styles.toolbar}>
                <div className={styles.group}>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="굵게"
                    >
                        <Bold size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="기울임"
                    >
                        <Italic size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="밑줄"
                    >
                        <UnderlineIcon size={18} />
                    </ToolbarButton>
                </div>

                <div className={styles.separator} aria-hidden="true" />

                <div className={styles.group}>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setColor('#8B5E3C').run()}
                        isActive={editor.isActive('textStyle', { color: '#8B5E3C' })}
                        title="갈색 상징색"
                    >
                        <Type size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#FFECD1' }).run()}
                        isActive={editor.isActive('highlight', { color: '#FFECD1' })}
                        title="하이라이트"
                    >
                        <Highlighter size={18} />
                    </ToolbarButton>
                </div>

                <div className={styles.separator} aria-hidden="true" />

                <div className={styles.group}>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="왼쪽 정렬"
                    >
                        <AlignLeft size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="가운데 정렬"
                    >
                        <AlignCenter size={18} />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="오른쪽 정렬"
                    >
                        <AlignRight size={18} />
                    </ToolbarButton>
                </div>
            </div>

            <EditorContent
                editor={editor}
                className={styles.content}
                style={{
                    minHeight: minHeight.includes('min-h-[')
                        ? minHeight.replace('min-h-[', '').replace(']', '')
                        : minHeight
                }}
            />
        </div>
    );
}

