export default async function handler(req, res) {
  // تنظیم هدرهای CORS برای اینکه اندروید بدون مشکل متصل شود
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // آدرس اصلی سوپابیس شما
  const SUPABASE_URL = "https://laszvjdlnmmkhtjmvgz.supabase.co";
  
  // ساخت آدرس نهایی مقصد
  const targetUrl = SUPABASE_URL + req.url;

  try {
    // خواندن بدنه درخواست فرستاده شده از اندروید
    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    // فرستادن درخواست واقعی به سوپابیس از داخل سرور ورسل
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'] || 'application/json',
        'apikey': req.headers['apikey'] || '',
        'authorization': req.headers['authorization'] || ''
      },
      body: body
    });

    const data = await response.text();
    
    // برگرداندن پاسخ سوپابیس به اندروید
    return res.status(response.status).send(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}