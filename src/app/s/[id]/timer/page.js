import { createClient } from 'redis';
import TimerClient from './TimerClient';

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

export default async function TimerPage({ params }) {
  const { id } = await params;
  const linkData = await getLinkData(id);

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-xl">Link not found or expired!</h1>
      </div>
    );
  }

  return <TimerClient targetUrl={linkData.targetUrl} />;
}