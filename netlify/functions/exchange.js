export default async (req) => {
  const method = req.method || req.httpMethod;

  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let code, redirect_uri;

  try {
    const body = JSON.parse(req.body || '{}');
    code = body.code;
    redirect_uri = body.redirect_uri;
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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
