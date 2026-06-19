export default async function handler(req, res) {
  // تنظیم هدرهای CORS برای ارتباط امن اندروید
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = "https://laszvjdlnmmkhtjmvgz.supabase.co";
  
  // پیدا کردن مسیر واقعی درخواست (مثلاً /auth/v1/signup)
  // چون آدرس با /api شروع شده، کلمه /api را از اولش پاک می‌کنیم تا سوپابیس بفهمد
  const cleanPath = req.url.replace(/^\/api/, '');
  const targetUrl = SUPABASE_URL + cleanPath;

  try {
    // کپی کردن و بازسازی هدرهای اصلی برای سوپابیس
    const headers = {};
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
    if (req.headers['apikey']) headers['apikey'] = req.headers['apikey'];
    if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];

    // آماده‌سازی بدنه درخواست
    let body = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    }

    // فرستادen درخواست به سوپابیس
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body
    });

    const data = await response.text();
    
    // بازگرداندن پاسخ سوپابیس به اپلیکیشن اندروید
    return res.status(response.status).send(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
