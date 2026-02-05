'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';

import { Placeholder } from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Highlighter,
    Type,
    LucideIcon
} from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import styles from './RichTextEditor.module.scss';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: number;
}

export function RichTextEditor({
    content,
    onChange,
    placeholder,
    className = "",
    minHeight = 120
}: RichTextEditorProps) {

    const BRAND_COLOR = '#8B5E3C';
    const HIGHLIGHT_COLOR = '#FFECD1';

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Placeholder.configure({
                placeholder: placeholder || '내용을 입력하세요...',
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn("rich-text-content"),
                style: `--editor-min-height: ${minHeight}px;`,
            },
        },
    });

    // ✨ 핵심: useEditorState를 사용하여 에디터 상태 변화를 리액트가 감지하게 함
    const states = useEditorState({
        editor,
        selector: (ctx) => {
            if (!ctx.editor) return {
                bold: false,
                italic: false,
                underline: false,
                brandColor: false,
                highlight: false,
            };
            return {
                bold: ctx.editor.isActive('bold'),
                italic: ctx.editor.isActive('italic'),
                underline: ctx.editor.isActive('underline'),
                brandColor: ctx.editor.isActive('textStyle', { color: BRAND_COLOR }),
                highlight: ctx.editor.isActive('highlight'),
            };
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
                    <MenuBtn
                        title="굵게"
                        icon={Bold}
                        isActive={!!states?.bold}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    />
                    <MenuBtn
                        title="기울임"
                        icon={Italic}
                        isActive={!!states?.italic}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    />
                    <MenuBtn
                        title="밑줄"
                        icon={UnderlineIcon}
                        isActive={!!states?.underline}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    />
                </div>

                <div className={styles.separator} />

                <div className={styles.toolbarGroup}>
                    <MenuBtn
                        title="상징색"
                        icon={Type}
                        isActive={!!states?.brandColor}
                        onClick={() => {
                            if (states?.brandColor) {
                                editor.chain().focus().unsetColor().run();
                            } else {
                                editor.chain().focus().setColor(BRAND_COLOR).run();
                            }
                        }}
                    />
                    <MenuBtn
                        title="하이라이트"
                        icon={Highlighter}
                        isActive={!!states?.highlight}
                        onClick={() => editor.chain().focus().toggleHighlight({ color: HIGHLIGHT_COLOR }).run()}
                    />
                </div>
            </div>

            <EditorContent
                editor={editor}
                className={styles.editorContent}
            />
        </div>
    );
}

// 툴바 버튼용 헬퍼 컴포넌트
const MenuBtn = ({
    icon: Icon,
    onClick,
    isActive,
    title
}: {
    icon: LucideIcon,
    onClick: () => void,
    isActive: boolean,
    title: string
}) => (
    <IconButton
        onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            onClick();
        }}
        className={cn(styles.toggleButton)}
        aria-label={title}
        name={title}
        iconSize={16}
        variant="ghost"
        data-state={isActive ? 'on' : 'off'}
    >
        <Icon size={16} />
    </IconButton>
);

RichTextEditor.displayName = "RichTextEditor";
