'use client';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

/**
 * Minimal upload zone — uploads a file to /api/upload and returns the URL.
 * The full-featured version (drag-drop, multi-file, image preview cropping)
 * is owned by Stream B; this minimal version lets Stream C build against it.
 */
export function UploadZone({
  label,
  currentUrl,
  onUploaded,
}: {
  label: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!r.ok) throw new Error(`上传失败 (${r.status})`);
      const { url } = (await r.json()) as { url: string };
      onUploaded(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={currentUrl} alt={label} className="max-h-32 rounded border" />
      ) : null}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 rounded border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? '上传中…' : currentUrl ? '替换' : '上传'}
        </button>
        {error ? <span className="text-xs text-red-500">{error}</span> : null}
      </div>
    </div>
  );
}
