import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: { label: string; href: string };
}) {
  return (
    <Card>
      <CardContent className="p-8 text-center space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {cta ? (
          <Link href={cta.href}>
            <Button>{cta.label}</Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}