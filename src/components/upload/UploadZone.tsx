'use client';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  label: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

export function UploadZone({ label, currentUrl, onUploaded }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('文件超过 10MB');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const dataUrl = await readAsDataURL(file);
      onUploaded(dataUrl);
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
        <div className="relative border border-border/60 rounded-xl p-4 bg-muted/20 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt={label} className="max-h-48 mx-auto rounded-lg" />
          <button
            type="button"
            aria-label="移除"
            onClick={() => onUploaded('')}
            className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-md bg-background/80 hover:bg-background border opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) void handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10'
              : 'border-border hover:border-primary/50 hover:bg-muted/30',
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all',
              dragOver ? 'bg-primary/15 scale-110' : 'bg-muted',
            )}
          >
            <Upload
              className={cn(
                'w-6 h-6 transition-colors',
                dragOver ? 'text-primary' : 'text-muted-foreground',
              )}
              strokeWidth={1.75}
            />
          </div>
          <p className="text-sm font-medium">
            {uploading ? '上传中…' : dragOver ? '松开即可上传' : '点击或拖拽图片到此处'}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">PNG / JPEG / WebP / GIF，最大 10MB</p>
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
        </div>
      )}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
