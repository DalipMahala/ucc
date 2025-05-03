// pages/api/player-urls.ts

import { NextResponse } from 'next/server';
import { getPlayerUrlsByIds } from '@/controller/playerController';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids = body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Invalid match IDs' }, { status: 400 });
    }

    const urls = await getPlayerUrlsByIds(ids);
    return NextResponse.json(urls);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}