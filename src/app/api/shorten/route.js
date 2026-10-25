import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// .env.local থেকে স্বয়ংক্রিয়ভাবে REDIS_URL রিড করবে
const redis = Redis.fromEnv();

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, targetUrl, imageUrl, title } = body;

    if (!targetUrl) {
      return NextResponse.json({ success: false, message: 'Target URL is required' }, { status: 400 });
    }

    // ৫-৬ অক্ষরের একটি ইউনিক আইডি জেনারেট করা
    const id = Math.random().toString(36).substring(2, 7) + Date.now().toString(36).slice(-3);
    const shortId = id.slice(0, 6);

    const linkData = {
      id: shortId,
      type, // 'adsterra' অথবা 'cloaking'
      targetUrl,
      imageUrl: imageUrl || '',
      title: title || 'Click to view content',
      createdAt: new Date().toISOString(),
    };

    // Redis-এ ডাটা সেভ করা
    await redis.set(shortId, linkData);

    // ডোমেইন ডায়নামিকভাবে ধরে শর্ট লিঙ্ক তৈরি করা
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const shortUrl = `${protocol}://${host}/s/${shortId}`;

    return NextResponse.json({ success: true, shortUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}