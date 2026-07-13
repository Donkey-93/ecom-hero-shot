import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  cta?: { label: string; href: string };
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className?: string;
}

export function EmptyState({ title, description, cta, icon: Icon = Inbox, className }: EmptyStateProps) {
  return (
    <Card className={cn('border-border/40 bg-muted/20', className)}>
      <CardContent className="p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
          <Icon className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        {cta && (
          <Button asChild className="mt-2">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
