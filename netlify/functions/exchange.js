// netlify/functions/exchange.js  (Node 18, ESM)
import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { code, redirect_uri } = JSON.parse(req.body || '{}');
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

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
  return res.status(podiumRes.status).json(data);
};
