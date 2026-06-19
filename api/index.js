export default async function handler(req, res) {
  // هدرهای CORS برای اندروید
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = "https://laszvjdlnmmkhtjmvgz.supabase.co";
  const cleanPath = req.url.replace(/^\/api/, '');
  const targetUrl = SUPABASE_URL + cleanPath;

  try {
    const headers = {
      'content-type': 'application/json',
      'apikey': req.headers['apikey'] || '',
      'authorization': req.headers['authorization'] || ''
    };

    // استفاده از بدنه ارسالیِ خود ورسل بدون دستکاری خام
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body
    });

    const data = await response.text();
    return res.status(response.status).send(data);

  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
}
