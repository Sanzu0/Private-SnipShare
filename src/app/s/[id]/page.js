import { createClient } from 'redis';
import Link from 'next/link';

async function getLinkData(id) {
  try {
    const client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    const data = await client.get(id);
    await client.quit();
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

// সোশ্যাল মিডিয়া প্রিভিউ (Facebook/Twitter Open Graph) দেখানোর জন্য
export async function generateMetadata({ params }) {
  const { id } = await params;
  const linkData = await getLinkData(id);

  if (!linkData || linkData.type !== 'cloaking') {
    return { title: 'Redirecting...' };
  }

  return {
    title: linkData.title,
    openGraph: {
      title: linkData.title,
      images: [{ url: linkData.imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: linkData.title,
      images: [linkData.imageUrl],
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const linkData = await getLinkData(id);

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-xl">Link not found or expired!</h1>
      </div>
    );
  }

  // ১. Image Cloaking হলে সাথে সাথে মূল লিঙ্কে রিডাইরেক্ট করে দেবে
  if (linkData.type === 'cloaking') {
    return (
      <html lang="en">
        <head>
          <meta httpEquiv="refresh" content={`0;url=${linkData.targetUrl}`} />
        </head>
        <body className="bg-gray-950 text-white flex items-center justify-center min-h-screen">
          <p className="animate-pulse">Redirecting to target page...</p>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = "${linkData.targetUrl}";`,
            }}
          />
        </body>
      </html>
    );
  }

  // ২. Shortener-এর ক্ষেত্রে সাধারণ Get Link পেজ দেখাবে
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between p-4">
      {/* Top Ad 1 */}
      <div className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-4 text-center my-2 min-h-[90px] flex items-center justify-center">
        <p className="text-xs text-gray-500">[ Get Link Page - Top Adsterra Ad ]</p>
      </div>

      {/* Main Get Link Area */}
      <div className="my-auto text-center w-full max-w-md mx-auto bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-200">Your Link is Ready</h2>
        <Link
          href={`/s/${id}/timer`}
          className="block w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30 text-lg text-center"
        >
          Get Link
        </Link>
      </div>

      {/* Bottom Ad 1 */}
      <div className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-4 text-center my-2 min-h-[90px] flex items-center justify-center">
        <p className="text-xs text-gray-500">[ Get Link Page - Bottom Adsterra Ad ]</p>
      </div>
    </div>
  );
}