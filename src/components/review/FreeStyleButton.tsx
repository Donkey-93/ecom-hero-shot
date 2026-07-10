'use client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function FreeStyleButton({ onClick }: { onClick: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await onClick();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
      自由发挥
    </Button>
  );
}
