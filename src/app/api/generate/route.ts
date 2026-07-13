import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: '生图功能将在 Phase 2 启用（需 Nano Banana 2 API key）' },
    { status: 501 },
  );
}

