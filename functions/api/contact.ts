interface Env {
  RESEND_API_KEY: string;
}

type Subject = 'ma' | 'litigacja' | 'ochrona' | 'inne';

interface ContactPayload {
  name: string;
  email: string;
  subject: Subject;
  message: string;
}

const ALLOWED_ORIGINS = new Set<string>([
  'https://adwokaci.zakopane.pl',
  'https://adwokaci-zakopane.pages.dev',
  'http://localhost:3000',
]);

const SUBJECT_LABELS: Record<Subject, string> = {
  ma: 'M&A i Prawo Spółek',
  litigacja: 'Spory Gospodarcze',
  ochrona: 'Ochrona Kapitału',
  inne: 'Inne zapytanie',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_REQ_PER_MIN = 5;
const WINDOW_MS = 60_000;

const ipBuckets = new Map<string, number[]>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) ?? [];
  const fresh = bucket.filter((t) => now - t < WINDOW_MS);
  if (fresh.length >= MAX_REQ_PER_MIN) {
    ipBuckets.set(ip, fresh);
    return false;
  }
  fresh.push(now);
  ipBuckets.set(ip, fresh);
  return true;
};

const corsHeaders = (origin: string | null): Record<string, string> => {
  const allowOrigin = origin !== null && ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
};

const jsonResponse = (status: number, body: Record<string, unknown>, origin: string | null): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isSubject = (value: unknown): value is Subject =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(SUBJECT_LABELS, value);

type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; error: string };

const validate = (data: Record<string, unknown>): ValidationResult => {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (name.length < 2 || name.length > 100) {
    return { ok: false, error: 'Nieprawidłowe imię i nazwisko (2-100 znaków).' };
  }

  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (email.length === 0 || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Nieprawidłowy adres e-mail.' };
  }

  if (!isSubject(data.subject)) {
    return { ok: false, error: 'Nieprawidłowy temat rozmowy.' };
  }

  const messageRaw = typeof data.message === 'string' ? data.message : '';
  const message = messageRaw.trim();
  if (message.length < 10 || message.length > 5000) {
    return { ok: false, error: 'Wiadomość musi mieć od 10 do 5000 znaków.' };
  }

  if (data.consent !== true) {
    return { ok: false, error: 'Wymagana jest zgoda na przetwarzanie danych.' };
  }

  return {
    ok: true,
    value: { name, email, subject: data.subject, message },
  };
};

const renderEmailHtml = (p: ContactPayload): string => `<!doctype html>
<html lang="pl">
<head><meta charset="UTF-8"><title>Nowe zapytanie</title></head>
<body style="font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; max-width: 640px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 20px; border-bottom: 1px solid #ccc; padding-bottom: 12px;">Nowe zapytanie z formularza kontaktowego</h1>
  <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 8px 0; font-weight: bold; width: 160px; vertical-align: top;">Imię i nazwisko:</td><td style="padding: 8px 0;">${escapeHtml(p.name)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">E-mail:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></td></tr>
    <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Temat:</td><td style="padding: 8px 0;">${escapeHtml(SUBJECT_LABELS[p.subject])}</td></tr>
  </table>
  <h2 style="font-size: 16px; margin-top: 24px;">Wiadomość</h2>
  <p style="white-space: pre-wrap; line-height: 1.6; font-family: Georgia, 'Times New Roman', serif;">${escapeHtml(p.message)}</p>
  <hr style="margin: 32px 0; border: none; border-top: 1px solid #ccc;">
  <p style="color: #666; font-size: 12px;">Wiadomość wysłana z formularza adwokaci.zakopane.pl</p>
</body>
</html>`;

const sendEmail = async (env: Env, p: ContactPayload): Promise<boolean> => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Formularz Adwokaci Zakopane <noreply@okay.marketing>',
      to: ['piotr.zielinski@adwokatura.home.pl'],
      reply_to: p.email,
      subject: `[Kontakt] ${SUBJECT_LABELS[p.subject]} — ${p.name}`,
      html: renderEmailHtml(p),
    }),
  });
  return response.ok;
};

export const onRequestOptions: PagesFunction<Env> = ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get('Origin');

  if (origin === null || !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse(403, { success: false, error: 'Forbidden' }, origin);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return jsonResponse(429, { success: false, error: 'Zbyt wiele żądań. Spróbuj ponownie za chwilę.' }, origin);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonResponse(400, { success: false, error: 'Nieprawidłowy format żądania.' }, origin);
  }

  if (typeof raw !== 'object' || raw === null) {
    return jsonResponse(400, { success: false, error: 'Nieprawidłowy format żądania.' }, origin);
  }

  const data = raw as Record<string, unknown>;

  // Honeypot — bot wypełnił ukryte pole 'website'. Zwracamy 200 OK BEZ wysyłki.
  if (typeof data.website === 'string' && data.website.length > 0) {
    return jsonResponse(200, { success: true }, origin);
  }

  const result = validate(data);
  if (!result.ok) {
    return jsonResponse(400, { success: false, error: result.error }, origin);
  }

  try {
    const sent = await sendEmail(env, result.value);
    if (!sent) {
      return jsonResponse(502, { success: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.' }, origin);
    }
    return jsonResponse(200, { success: true }, origin);
  } catch {
    return jsonResponse(502, { success: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.' }, origin);
  }
};
