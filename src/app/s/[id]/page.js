import fs from 'fs';
import path from 'path';
import ClientRedirect from './ClientRedirect';

// সার্ভার সাইডে ডাটা পড়ার ফাংশন
function getLinkData(id) {
  const filePath = path.join(process.cwd(), 'data.json');
  if (!fs.existsSync(filePath)) return null;
  const fileData = fs.readFileSync(filePath, 'utf8');
  const links = JSON.parse(fileData);
  return links[id] || null;
}

// ১. সোশ্যাল মিডিয়া বটগুলোর জন্য মেটা ট্যাগ জেনারেট করা (Open Graph)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const linkData = getLinkData(id);

  if (!linkData || linkData.type !== 'cloaking') {
    return {
      title: 'Redirecting...',
    };
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

// ২. মেইন পেজ কম্পোনেন্ট
export default async function Page({ params }) {
  const { id } = await params;
  const linkData = getLinkData(id);

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-xl">Link not found or expired!</h1>
      </div>
    );
  }

  return <ClientRedirect linkData={linkData} />;
}