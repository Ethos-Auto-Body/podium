import fetch from 'node-fetch';

export default async (req) => {
  if (req.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'POST only' })
    };
  }

  const { code, redirect_uri } = JSON.parse(req.body || '{}');
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing code' })
    };
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
        code
      })
    });

    const data = await podiumRes.json();

    return {
      statusCode: podiumRes.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', message: err.message })
    };
  }
};
