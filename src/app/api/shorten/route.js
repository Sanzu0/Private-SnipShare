import { NextResponse } from 'next/server';
import { createClient } from 'redis';

// গ্লোবাল ক্লায়েন্ট তৈরি
let client;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
  }
  return client;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, targetUrl, imageUrl, title } = body;

    if (!targetUrl) {
      return NextResponse.json({ success: false, message: 'Target URL is required' }, { status: 400 });
    }

    const redis = await getRedisClient();

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

    // Redis-এ ডাটা সেভ করা
    await redis.set(shortId, JSON.stringify(linkData));

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const shortUrl = `${protocol}://${host}/s/${shortId}`;

    return NextResponse.json({ success: true, shortUrl });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}