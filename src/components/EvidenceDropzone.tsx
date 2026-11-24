import { useRef, useState, type DragEvent } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EvidenceFile } from "@/lib/skillverify-types";

interface EvidenceDropzoneProps {
  id: string;
  label: string;
  description: string;
  files: EvidenceFile[];
  onChange: (files: EvidenceFile[]) => void;
}

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function EvidenceDropzone({ id, label, description, files, onChange }: EvidenceDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (incoming: File[]) => {
    const oversized = incoming.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`${oversized.name} is larger than 8 MB. Choose a smaller file.`);
      return;
    }
    setError("");
    const metadata = incoming.map((file, index) => ({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${index}-${file.name}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    }));
    const existingKeys = new Set(files.map((file) => `${file.name}-${file.size}`));
    onChange([...files, ...metadata.filter((file) => !existingKeys.has(`${file.name}-${file.size}`))]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-lg border border-dashed bg-surface-subtle p-4 transition-colors focus-within:ring-2 focus-within:ring-ring ${
          isDragging ? "border-primary bg-accent" : "border-input"
        }`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          className="sr-only"
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
          <UploadCloud className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{description}</span>
            <span className="mt-2 inline-block text-xs font-medium text-primary">Choose files or drop them here · PDF, image, DOC · max 8 MB each</span>
          </span>
        </label>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Prototype privacy: only file names and sizes are saved in this browser. File contents are not uploaded or institutionally verified.
      </p>
      {error && <p role="alert" className="text-xs font-medium text-destructive">{error}</p>}
      {files.length > 0 && (
        <ul className="space-y-1.5" aria-label={`${label} selected files`}>
          {files.map((file) => (
            <li key={file.id} className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
              <span className="flex min-w-0 items-center gap-2 text-xs">
                <FileText className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate font-medium text-foreground">{file.name}</span>
                <span className="shrink-0 text-muted-foreground">{Math.max(1, Math.round(file.size / 1024))} KB</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange(files.filter((item) => item.id !== file.id))}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
