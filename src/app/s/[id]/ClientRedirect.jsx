'use client';

import { useState, useEffect } from 'react';

export default function ClientRedirect({ linkData }) {
  const { type, targetUrl } = linkData;
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [canGo, setCanGo] = useState(false);

  // Image Cloaking: সাথে সাথে মূল লিঙ্কে রিডাইরেক্ট
  useEffect(() => {
    if (type === 'cloaking') {
      window.location.href = targetUrl;
    }
  }, [type, targetUrl]);

  // Step 2-এর টাইমার কাউন্টডাউন
  useEffect(() => {
    if (type === 'shortener' && step === 2) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setCanGo(true);
      }
    }
  }, [type, step, timeLeft]);

  // Image cloaking হলে ব্যাকগ্রাউন্ডে কিছুই রেন্ডার হবে না
  if (type === 'cloaking') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="animate-pulse">Redirecting to target page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-between p-4">
      {/* Top Ad Banner Container */}
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-lg p-4 text-center my-2 min-h-[100px] flex items-center justify-center">
        {/* এখানে আপনার Adsterra Top Banner Ad Script বা iframe বসাবেন */}
        <p className="text-xs text-gray-500">[ Adsterra Top Banner Ad Placement ]</p>
      </div>

      {/* Main Content Area */}
      <div className="my-auto text-center w-full max-w-md bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        {step === 1 ? (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-200">Your Link is Ready</h2>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30 text-lg"
            >
              Get Link
            </button>
          </div>
        ) : (
          <div>
            {!canGo ? (
              <div className="space-y-4">
                <p className="text-gray-400 font-medium">Please wait a few seconds...</p>
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
        )}
      </div>

      {/* Bottom Ad Banner Container */}
      <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-lg p-4 text-center my-2 min-h-[100px] flex items-center justify-center">
        {/* এখানে আপনার Adsterra Bottom Banner Ad Script বা iframe বসাবেন */}
        <p className="text-xs text-gray-500">[ Adsterra Bottom Banner Ad Placement ]</p>
      </div>
    </div>
  );
}