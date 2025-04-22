import fetch from 'node-fetch';

export default async (req) => {
  if (req.method !== 'POST' && req.httpMethod !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { code, redirect_uri } = JSON.parse(req.body || '{}');
  if (!code) {
    return new Response(JSON.stringify({ error: 'Missing code' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const podiumRes = await fetch('https://api.podium.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.PODIUM_CLIENT_ID,
        client_secret: process.env.PODIUM_CLIENT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code',
        code,
      }),
    });

    const data = await podiumRes.json();
    return new Response(JSON.stringify(data), {
      status: podiumRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Server error',
      message: err.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
