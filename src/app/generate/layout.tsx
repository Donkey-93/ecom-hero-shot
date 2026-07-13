import { Steps } from '@/components/wizard/Steps';

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Steps />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}