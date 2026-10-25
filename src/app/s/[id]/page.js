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

export default async function GetLinkPage({ params }) {
  const { id } = await params;
  const linkData = await getLinkData(id);

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-xl">Link not found or expired!</h1>
      </div>
    );
  }

  // যদি cloaking হয়, তবে সাথে সাথে মূল লিঙ্কে রিডাইরেক্ট করে দেবে
  if (linkData.type === 'cloaking') {
    return (
      <meta httpEquiv="refresh" content={`0;url=${linkData.targetUrl}`} />
    );
  }

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