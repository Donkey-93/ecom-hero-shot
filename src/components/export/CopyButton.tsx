'use client';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function CopyButton({ text, label = '复制' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // fallback: select-and-copy via a transient textarea
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand('copy');
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          } catch {
            /* swallow — nothing else we can do */
          } finally {
            document.body.removeChild(ta);
          }
        }
      }}
    >
      {done ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {done ? '已复制' : label}
    </Button>
  );
}
