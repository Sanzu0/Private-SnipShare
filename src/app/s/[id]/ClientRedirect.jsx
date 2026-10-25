'use client';
import { useEffect } from 'react';

export default function ClientRedirect({ linkData }) {
  useEffect(() => {
    // ইউজারের জন্য রিডাইরেক্ট বা লজিক
    const timer = setTimeout(() => {
      window.location.href = linkData.targetUrl;
    }, 2500); // ২.৫ সেকেন্ড সময় দেওয়া হলো যাতে অ্যাড বা পেজ লোড হওয়ার সুযোগ পায়

    return () => clearTimeout(timer);
  }, [linkData]);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 text-center">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Redirecting to your destination...</h2>
        <p className="text-gray-400 text-sm mb-6">Please wait a moment while we redirect you safely.</p>
        
        {/* এখানে আপনি Adsterra-এর Direct Link বা Banner Ad কোড বসাতে পারবেন */}
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-700 text-xs text-gray-500">
          Advertisement / Direct Link Area
        </div>
      </div>
    </main>
  );
}