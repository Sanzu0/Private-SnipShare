import { createClient } from 'redis';
import ClientRedirect from './ClientRedirect';

async function getLinkData(id) {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });
    await client.connect();
    
    const data = await client.get(id);
    await client.quit();
    
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis Fetch Error:', error);
    return null;
  }
}

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

  return <ClientRedirect linkData={linkData} />;
}