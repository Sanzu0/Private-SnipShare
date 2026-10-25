import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, targetUrl, imageUrl, title } = body;

    if (!targetUrl) {
      return NextResponse.json({ success: false, message: 'Target URL is required' }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 7) + Date.now().toString(36).slice(-3);
    const shortId = id.slice(0, 6);

    const linkData = {
      id: shortId,
      type,
      targetUrl,
      imageUrl: imageUrl || '',
      title: title || 'Click to view content',
      createdAt: new Date().toISOString(),
    };

    // Redis ডাটাবেজে সেভ করা
    await redis.set(shortId, linkData);

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const shortUrl = `${protocol}://${host}/s/${shortId}`;

    return NextResponse.json({ success: true, shortUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}