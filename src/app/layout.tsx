import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '电商主图生成系统',
  description: '上传商品图，AI 帮你生成 5 张高质量主图 prompt',
  applicationName: 'Ecom Hero Shot',
  appleWebApp: {
    capable: true,
    title: 'Ecom Hero Shot',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBEA' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: 'rounded-xl shadow-lg border',
              title: 'font-medium',
              description: 'text-sm text-muted-foreground',
            },
          }}
        />
      </body>
    </html>
  );
}
