// Cloudflare Worker — serves meeting links only when password hash matches
// Deploy: cd worker && wrangler deploy

const VALID_HASH = '988ecb15';

// Same hash function as frontend (hashStr in index.html)
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return (h >>> 0).toString(16).padStart(8, '0'); }

const LINKS = [
  { name: 'Adab',    url: 'https://teams.microsoft.com/meet/399685477116000?p=8Oop946QAJ6k1hldIr' },
  { name: 'Aqaaid',  url: 'https://teams.microsoft.com/meet/344566458555626?p=0l5ODY9VrcP16iLPlz' },
  { name: 'Arabic',  url: 'https://teams.microsoft.com/meet/389926319388991?p=SFAKAL79SzXfLtzZqR' },
  { name: 'Fiqh',    url: 'https://teams.microsoft.com/meet/376573361182615?p=FvZ2OpK7bVSWldKWmO' },
  { name: 'Hadith',  url: 'https://teams.microsoft.com/meet/385525245278270?p=hWEQMbzmDE2oHlrDPv' },
  { name: 'Seerah',  url: 'https://teams.microsoft.com/meet/377135747219007?p=NqTd0GWjViCL33VzvA' },
  { name: 'Tafseer', url: 'https://teams.microsoft.com/meet/369309171584275?p=9lA5Ggmd5KHtavSgwQ' },
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only respond to GET /api/links
    if (url.pathname !== '/api/links') {
      return new Response('Not found', { status: 404 });
    }

    // Check password — hash server-side (raw password from client, not pre-hashed)
    const pw = request.headers.get('X-Course-Pw') || '';
    const hash = hashStr(pw);
    if (hash !== VALID_HASH) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Return links
    return new Response(JSON.stringify(LINKS), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  },
};
