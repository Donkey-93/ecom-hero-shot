'use client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Generation } from '@/lib/schemas';
import { CopyButton } from './CopyButton';

export function JsonExport({ generation }: { generation: Generation }) {
  const json = JSON.stringify(generation, null, 2);
  function download() {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (generation.id || 'generation') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return (
    <div className="flex gap-2">
      <CopyButton text={json} label="∏¥÷∆ JSON" />
      <Button onClick={download} variant="outline">
        <Download className="w-4 h-4 mr-1" />
        œ¬‘ÿ .json
      </Button>
    </div>
  );
}
