import type { ReactNode } from "react";

const baseInput =
  "w-full rounded-lg bg-white border border-hairline px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-light focus:border-violet outline-none transition-colors";

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
      <label htmlFor={htmlFor} className="block text-xs font-mono uppercase tracking-wide text-stone mb-1.5">
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
