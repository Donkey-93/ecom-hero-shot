'use client';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function TranslateButton({ onClick, disabled }: { onClick: () => Promise<void>; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={loading || disabled}
      onClick={async () => {
        setLoading(true);
        try {
          await onClick();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
      в╙с╒нд
    </Button>
  );
}
