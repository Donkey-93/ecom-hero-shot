import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Upload API deprecated on Vercel. Use client-side FileReader + IndexedDB instead.',
      hint: 'See UploadZone.tsx - readAsDataURL -> onUploaded(dataUrl).',
    },
    { status: 410, statusText: 'Gone' },
  );
}

export async function GET() {
  return NextResponse.json({ status: 'deprecated', since: '2026-07-13' });
}
