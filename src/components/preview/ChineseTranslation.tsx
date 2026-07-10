import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '../export/CopyButton';

export function ChineseTranslation({ text }: { text: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">ÖÐÎÄ·­Òë</CardTitle>
        <CopyButton text={text} />
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{text}</p>
      </CardContent>
    </Card>
  );
}
