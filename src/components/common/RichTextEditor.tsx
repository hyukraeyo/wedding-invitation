'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Highlighter,
    Type
} from 'lucide-react';
import { useEffect, useMemo, useId } from 'react';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import styles from './RichTextEditor.module.scss';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

const ToolbarToggle = ({
    pressed,
    onPressedChange,
    children,
    title,
}: {
    pressed: boolean;
    onPressedChange: () => void;
    children: React.ReactNode;
    title?: string;
}) => (
    <Toggle
        pressed={pressed}
        onPressedChange={onPressedChange}
        className="data-[state=on]:bg-muted p-2 h-8 w-8"
        aria-label={title}
        title={title}
    >
        {children}
    </Toggle>
);

export default function RichTextEditor({ content, onChange, placeholder, className = "", minHeight = "min-h-[120px]" }: RichTextEditorProps) {
    const editorId = useId();

    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: false,
        }),
        TextStyle.configure({}),
        Color.configure({}),
        Underline.extend({ name: `underline-${editorId}` }),
        Highlight.configure({ multicolor: true }),
        Placeholder.configure({
            placeholder: placeholder || '내용을 입력하세요...',
        }),
    ], [placeholder, editorId]);

    const editor = useEditor({
        extensions,
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "rich-text-content",
                    minHeight
                ),
            },
        },
    });

    useEffect(() => {
        if (editor && !editor.isFocused && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);


    if (!editor) return null;

    return (
        <div className={cn(styles.editorContainer, className)}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarGroup}>
                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        pressed={editor.isActive('bold')}
                        title="굵게"
                    >
                        <Bold size={16} />
                    </ToolbarToggle>

                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        pressed={editor.isActive('italic')}
                        title="기울임"
                    >
                        <Italic size={16} />
                    </ToolbarToggle>

                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        pressed={editor.isActive('underline')}
                        title="밑줄"
                    >
                        <UnderlineIcon size={16} />
                    </ToolbarToggle>
                </div>

                <div className={styles.separator} />

                <div className={styles.toolbarGroup}>
                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().setColor('#8B5E3C').run()}
                        pressed={editor.isActive('textStyle', { color: '#8B5E3C' })}
                        title="갈색 상징색"
                    >
                        <Type size={16} />
                    </ToolbarToggle>
                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().toggleHighlight({ color: '#FFECD1' }).run()}
                        pressed={editor.isActive('highlight', { color: '#FFECD1' })}
                        title="하이라이트"
                    >
                        <Highlighter size={16} />
                    </ToolbarToggle>
                </div>
            </div>

            <EditorContent
                editor={editor}
                className={styles.editorContent}
            />
        </div>
    );
}
