'use client';

import { useEffect } from 'react';

export default function CloakRedirect({ targetUrl, title }) {
  useEffect(() => {
    // মেটা ট্যাগ বা টাইটেল সেট করা
    if (title) {
      document.title = title;
    }

    // লিঙ্কে ক্লিক করার সাথে সাথেই বা ১ সেকেন্ডের কম সময়ে মূল লিঙ্কে রিডাইরেক্ট হয়ে যাবে
    const timer = setTimeout(() => {
      window.location.replace(targetUrl);
    }, 100); // 0.1 সেকেন্ড বা তাৎক্ষণিক রিডাইরেক্ট

    return () => clearTimeout(timer);
  }, [targetUrl, title]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="animate-pulse text-sm text-gray-400">Redirecting...</p>
    </div>
  );
}