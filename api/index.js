export default async function handler(req, res) {
  // هدرهای CORS برای دسترسی اندروید
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
    // بازسازی هدرها به صورت کاملا ایمن
    const headers = {};
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
    if (req.headers['apikey']) headers['apikey'] = req.headers['apikey'];
    if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];

    let body = undefined;

    // متد جدید برای خواندن بادی به صورت استریم خام جهت جلوگیری از ارور 500
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = Buffer.concat(buffers).toString('utf-8');
    }

    // ارسال به سوپابیس
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body
    });

    const data = await response.text();
    return res.status(response.status).send(data);

  } catch (error) {
    // اگر باز هم ارور داد، متن دقیق خطا را به اندروید برگردان تا ببینیم مشکل چیست
    return res.status(500).send("خطای سرور ورسل: " + error.message);
  }
}
