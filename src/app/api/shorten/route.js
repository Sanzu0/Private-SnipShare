import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ডেটা সেভ করার জন্য লোকাল JSON ফাইলের পাথ
const filePath = path.join(process.cwd(), 'data.json');

// হেলপার ফাংশন: ডাটা পড়া
function readData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

// হেলপার ফাংশন: ডাটা লেখা
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

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

    const links = readData();

    // লিঙ্কের তথ্য অবজেক্ট আকারে সেভ করা
    links[shortId] = {
      id: shortId,
      type, // 'adsterra' অথবা 'cloaking'
      targetUrl,
      imageUrl: imageUrl || '',
      title: title || 'Click to view content',
      createdAt: new Date().toISOString(),
    };

    writeData(links);

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