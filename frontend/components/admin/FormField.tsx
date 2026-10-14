import { UploadCloud } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

const baseInput =
  "w-full bg-white border border-violet/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-light focus:border-violet focus:ring-2 focus:ring-violet/15 outline-none transition-all";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-ink mb-1.5"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-stone-light mt-1">{hint}</p> : null}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  children: ReactNode;
}) {
  return (
    <div className=" border border-hairline bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        {Icon ? (
          <span className="inline-flex size-9 items-center justify-center bg-violet-pale text-violet-deep shrink-0">
            <Icon className="size-4.5" strokeWidth={2.2} />
          </span>
        ) : null}
        <div>
          <h2 className="font-display font-bold text-base text-ink">{title}</h2>
          {description ? <p className="text-sm text-stone mt-0.5">{description}</p> : null}
        </div>
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

export function Checkbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-ink cursor-pointer select-none">
      <input type="checkbox" {...props} className="size-4 accent-violet" />
      {label}
    </label>
  );
}

/** Click-or-drop image picker, as in the design. Shows the new file or the stored one. */
export function Dropzone({
  id,
  file,
  existingUrl,
  onChange,
  accept = "image/*",
}: {
  id: string;
  file: File | null;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
  accept?: string;
}) {
  const preview = file ? URL.createObjectURL(file) : existingUrl || null;
  return (
    <label
      htmlFor={id}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) onChange(dropped);
      }}
      className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 border border-violet/40 bg-white p-4 text-center transition-colors hover:border-violet hover:bg-violet-tint"
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="max-h-28 w-auto object-contain" />
      ) : (
        <UploadCloud className="size-6 text-ink/70" strokeWidth={1.6} />
      )}
      <span className="text-xs text-ink">
        {file ? file.name : "Click to upload or drag and drop"}
      </span>
      <span className="text-[11px] text-stone">JPG, PNG, WEBP</span>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
