export const config = {
  runtime: 'edge', // 👈 جادوی اصلی اینجاست؛ استفاده از محیط سریع و بدون کرش Edge
};

export default async function handler(req) {
  // ۱. مدیریت درخواست‌های OPTIONS (CORS Preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization',
      },
    });
  }

  const SUPABASE_URL = "https://laszvjdlnmmkhtjmvgz.supabase.co";
  
  // ۲. پیدا کردن مسیر واقعی درخواست
  const url = new URL(req.url);
  const cleanPath = url.pathname.replace(/^\/api/, '');
  const targetUrl = SUPABASE_URL + cleanPath + url.search;

  try {
    // ۳. کپی کردن هدرهای اصلی ارسالی از اندروید
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    if (req.headers.get('apikey')) headers.set('apikey', req.headers.get('apikey'));
    if (req.headers.get('authorization')) headers.set('authorization', req.headers.get('authorization'));

    // ۴. خواندن مستقیم بادی به صورت استریم خام بدون ریسک کرش و ارور 500
    const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;

    // ۵. شلیک درخواست به سوپابیس
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body
    });

    const data = await response.text();

    // ۶. برگرداندن پاسخ نهایی به اندروید
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
