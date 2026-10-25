'use client';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('adsterra');
  const [targetUrl, setTargetUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: activeTab,
        targetUrl,
        imageUrl: activeTab === 'cloaking' ? imageUrl : '',
        title: activeTab === 'cloaking' ? title : '',
      }),
    });

    const data = await res.json();
    if (data.success) {
      setShortUrl(data.shortUrl);
    } else {
      alert('Error generating short link');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-400">Smart URL & Cloaking</h1>
        
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-900 p-1 rounded-xl">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'adsterra' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('adsterra')}
          >
            Adsterra Shortener
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'cloaking' ? 'bg-yellow-500 text-black' : 'text-gray-400'}`}
            onClick={() => setActiveTab('cloaking')}
          >
            Image Cloaking
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Destination URL (Main Link)</label>
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400"
            />
          </div>

          {activeTab === 'cloaking' && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Social Preview Title</label>
                <input
                  type="text"
                  required
                  placeholder="Exciting News! Click to watch..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Preview Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://image-link.com/photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-400"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition"
          >
            {loading ? 'Generating...' : 'Create Short Link'}
          </button>
        </form>

        {/* Result */}
        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700 text-center">
            <p className="text-sm text-gray-400 mb-2">Your Shortened Link:</p>
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="w-full p-2 bg-gray-800 text-yellow-400 text-center rounded-lg border border-gray-600 select-all"
            />
          </div>
        )}
      </div>
    </main>
  );
}