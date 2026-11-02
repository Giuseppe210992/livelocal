// robots.txt: il sito è aperto a motori di ricerca e assistenti AI.
import type { APIRoute } from 'astro';
import { urlAssoluto } from '../lib/sito';

const ROBOT = ['Googlebot', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot'];

export const GET: APIRoute = () => {
  const corpo = [
    '# SuccedeQui: calendario pubblico degli eventi. Lettura consentita a tutti.',
    ...ROBOT.flatMap((r) => [`User-agent: ${r}`, 'Allow: /', '']),
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${urlAssoluto('/sitemap.xml')}`,
    '',
  ].join('\n');
  return new Response(corpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
