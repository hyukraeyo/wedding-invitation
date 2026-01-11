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
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

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
                class: cn(
                    "prose prose-sm max-w-none focus:outline-none p-4",
                    minHeight
                ),
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
        <div className={cn("border rounded-md bg-background overflow-hidden", className)}>
            <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-muted/20">
                <div className="flex items-center gap-0.5">
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

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className="flex items-center gap-0.5">
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

                <Separator orientation="vertical" className="h-6 mx-1" />

                <div className="flex items-center gap-0.5">
                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                        pressed={editor.isActive({ textAlign: 'left' })}
                        title="왼쪽 정렬"
                    >
                        <AlignLeft size={16} />
                    </ToolbarToggle>

                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                        pressed={editor.isActive({ textAlign: 'center' })}
                        title="가운데 정렬"
                    >
                        <AlignCenter size={16} />
                    </ToolbarToggle>

                    <ToolbarToggle
                        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                        pressed={editor.isActive({ textAlign: 'right' })}
                        title="오른쪽 정렬"
                    >
                        <AlignRight size={16} />
                    </ToolbarToggle>
                </div>
            </div>

            <EditorContent
                editor={editor}
                className="w-full"
            />
        </div>
    );
}

