"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  FileText,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Redo,
  Undo,
} from "lucide-react";

import { uploadEditorMedia } from "@/lib/adminApi";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center size-7  transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-violet text-white" : "text-stone hover:bg-paper-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  editor,
  onInsertImage,
  onAttachPdf,
  uploading,
}: {
  editor: Editor;
  onInsertImage: () => void;
  onAttachPdf: () => void;
  uploading: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-hairline bg-paper-2 px-2 py-1.5">
      <select
        aria-label="Text style"
        value={
          editor.isActive("heading", { level: 2 })
            ? "2"
            : editor.isActive("heading", { level: 3 })
              ? "3"
              : editor.isActive("heading", { level: 4 })
                ? "4"
                : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          const chain = editor.chain().focus();
          if (v === "p") chain.setParagraph().run();
          else chain.setHeading({ level: Number(v) as 2 | 3 | 4 }).run();
        }}
        className="mr-1 h-7 border border-violet/40 bg-white px-2 text-xs text-ink outline-none rounded-box"
      >
        <option value="p">Paragraph</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
      <span className="w-px h-4 bg-hairline mx-1" />
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="size-3.5" />
      </ToolbarButton>
      <span className="w-px h-4 bg-hairline mx-1" />
      {(
        [
          ["left", "Align left", AlignLeft],
          ["center", "Align center", AlignCenter],
          ["right", "Align right", AlignRight],
          ["justify", "Justify", AlignJustify],
        ] as const
      ).map(([value, label, Icon]) => (
        <ToolbarButton
          key={value}
          label={label}
          active={editor.isActive({ textAlign: value })}
          onClick={() => editor.chain().focus().setTextAlign(value).run()}
        >
          <Icon className="size-3.5" />
        </ToolbarButton>
      ))}
      <span className="w-px h-4 bg-hairline mx-1" />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          const url = window.prompt("Link URL");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
          } else {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <LinkIcon className="size-3.5" />
      </ToolbarButton>
      <span className="w-px h-4 bg-hairline mx-1" />
      <ToolbarButton label="Insert image" disabled={uploading} onClick={onInsertImage}>
        {uploading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ImageIcon className="size-3.5" />
        )}
      </ToolbarButton>
      <ToolbarButton label="Attach PDF" disabled={uploading} onClick={onAttachPdf}>
        <FileText className="size-3.5" />
      </ToolbarButton>
      <span className="w-px h-4 bg-hairline mx-1" />
      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="size-3.5" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: "" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[10rem] px-4 py-3 focus:outline-none prose-headings:font-display prose-a:text-violet-deep",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  async function handleFilePicked(file: File | undefined, kind: "image" | "pdf") {
    if (!file || !editor) return;
    setUploadError("");
    setUploading(true);
    try {
      const media = await uploadEditorMedia(file);
      if (kind === "image") {
        editor.chain().focus().setImage({ src: media.url, alt: media.name }).run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${media.url}" target="_blank" rel="noopener noreferrer">📄 ${media.name}</a> `
          )
          .run();
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  if (!editor) {
    return (
      <div className=" border border-hairline bg-white h-48 animate-pulse rounded-box" />
    );
  }

  return (
    <div className=" border border-violet/40 bg-white overflow-hidden focus-within:border-violet transition-colors rounded-box">
      <Toolbar
        editor={editor}
        uploading={uploading}
        onInsertImage={() => imageInputRef.current?.click()}
        onAttachPdf={() => pdfInputRef.current?.click()}
      />
      <EditorContent editor={editor} placeholder={placeholder} />
      {uploadError ? <p className="px-4 pb-3 text-xs text-red-600">{uploadError}</p> : null}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void handleFilePicked(e.target.files?.[0], "image");
          e.target.value = "";
        }}
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          void handleFilePicked(e.target.files?.[0], "pdf");
          e.target.value = "";
        }}
      />
    </div>
  );
}
