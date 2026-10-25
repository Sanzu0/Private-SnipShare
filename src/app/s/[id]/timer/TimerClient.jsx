'use client';

import { useState, useEffect } from 'react';

export default function TimerClient({ targetUrl }) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [canGo, setCanGo] = useState(false);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setCanGo(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between p-4">
      {/* Top Ad 2 */}
      <div className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-4 text-center my-2 min-h-[90px] flex items-center justify-center">
        <p className="text-xs text-gray-500">[ Timer Page - Top Adsterra Ad ]</p>
      </div>

      {/* Main Timer / Go To Link Area */}
      <div className="my-auto text-center w-full max-w-md mx-auto bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        {!canGo ? (
          <div className="space-y-4">
            <p className="text-gray-400 font-medium">Please wait while we process your link...</p>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/10 border-2 border-blue-500 text-blue-400 font-bold text-3xl rounded-full animate-pulse">
              {timeLeft}s
            </div>
          </div>
        ) : (
          <a
            href={targetUrl}
            className="block w-full py-4 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-600/30 text-lg"
          >
            Go To Link
          </a>
        )}
      </div>

      {/* Bottom Ad 2 */}
      <div className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-lg p-4 text-center my-2 min-h-[90px] flex items-center justify-center">
        <p className="text-xs text-gray-500">[ Timer Page - Bottom Adsterra Ad ]</p>
      </div>
    </div>
  );
}