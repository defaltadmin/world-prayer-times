// Cloudflare Worker — serves meeting links with proper auth
// Deploy: cd worker && wrangler deploy
// Secrets: wrangler secret put COURSE_SECRET

const LINKS = [
  { name: 'Adab',    url: 'https://teams.microsoft.com/meet/399685477116000?p=8Oop946QAJ6k1hldIr' },
  { name: 'Aqaaid',  url: 'https://teams.microsoft.com/meet/344566458555626?p=0l5ODY9VrcP16iLPlz' },
  { name: 'Arabic',  url: 'https://teams.microsoft.com/meet/389926319388991?p=SFAKAL79SzXfLtzZqR' },
  { name: 'Fiqh',    url: 'https://teams.microsoft.com/meet/376573361182615?p=FvZ2OpK7bVSWldKWmO' },
  { name: 'Hadith',  url: 'https://teams.microsoft.com/meet/385525245278270?p=hWEQMbzmDE2oHlrDPv' },
  { name: 'Seerah',  url: 'https://teams.microsoft.com/meet/377135747219007?p=NqTd0GWjViCL33VzvA' },
  { name: 'Tafseer', url: 'https://teams.microsoft.com/meet/369309171584275?p=9lA5Ggmd5KHtavSgwQ' },
];

const ALLOWED_ORIGIN = 'https://prayer.mscarabia.com';

function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a), bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

function json(body, status, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN, ...extra },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Course-Pw',
        },
      });
    }

    if (url.pathname !== '/api/links') return json({ error: 'Not found' }, 404);

    // Validate secret is configured
    if (!env.COURSE_SECRET) return json({ error: 'Server misconfigured' }, 500);

    // Constant-time password compare
    const pw = request.headers.get('X-Course-Pw') || '';
    if (!timingSafeEqual(pw, env.COURSE_SECRET)) {
      return json({ error: 'Unauthorized' }, 403);
    }

    return json(LINKS, 200, { 'Cache-Control': 'no-store' });
  },
};
