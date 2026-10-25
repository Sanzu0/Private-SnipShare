'use client';

import { useState, useEffect } from 'react';

export default function CloakRedirect({ targetUrl, title }) {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    // মেটা ট্যাগ বা টাইটেল সেট করা
    if (title) {
      document.title = title;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = targetUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetUrl, title]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 border-2 border-blue-500 text-blue-400 font-bold text-xl rounded-full animate-pulse mx-auto">
          {timeLeft}s
        </div>
        <h2 className="text-xl font-semibold text-gray-200">Redirecting to destination...</h2>
        <p className="text-sm text-gray-400">Please wait while we safely redirect you to the main page.</p>
        <div className="pt-2">
          <a
            href={targetUrl}
            className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all text-sm text-center shadow-lg shadow-blue-600/20"
          >
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
}