// Build-time market headlines from public RSS feeds (Moneycontrol, Investing.com).
// Only headline, source, time and link are kept; article text is never stored.
// Any failure returns what did load (possibly nothing); it never throws.

export type NewsSource = 'Moneycontrol' | 'Investing.com';

export type NewsItem = {
  title: string;
  link: string;
  source: NewsSource;
  date: Date | null;
};

// Each source lists fallback URLs, tried in order until one returns headlines.
const FEEDS: { source: NewsSource; urls: string[] }[] = [
  {
    source: 'Moneycontrol',
    urls: [
      'https://www.moneycontrol.com/rss/marketreports.xml',
      'https://www.moneycontrol.com/rss/latestnews.xml',
      'https://www.moneycontrol.com/rss/business.xml',
    ],
  },
  { source: 'Investing.com', urls: ['https://in.investing.com/rss/news_25.rss', 'https://in.investing.com/rss/news.rss'] },
];

const TIMEOUT_MS = 8000;
/** Max headlines kept per source, so one busy feed can't crowd out the other. */
const PER_SOURCE = 20;

// Browser-like headers: some publishers' bot protection rejects unknown agents.
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36',
  Accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5',
  'Accept-Language': 'en-IN,en;q=0.9',
};

const decode = (s: string) =>
  s
    // Unwrap CDATA wherever it sits (feeds often put it on its own line).
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
};

function parseDate(raw: string): Date | null {
  if (!raw) return null;
  let s = raw.trim();
  // Investing.com sends "YYYY-MM-DD HH:MM:SS" with no zone; it's GMT.
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) s = `${s.replace(' ', 'T')}Z`;
  // Indian feeds sometimes use "IST" or "GMT+5:30", which Date can't parse.
  s = s.replace(/\s*(IST|GMT\s*\+\s*0?5:30)$/i, ' +0530');
  const d = new Date(s);
  return isNaN(+d) ? null : d;
}

function parse(xml: string, source: NewsSource): NewsItem[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  return items
    .map((item) => {
      const title = tag(item, 'title');
      const link = tag(item, 'link');
      const date = parseDate(tag(item, 'pubDate'));
      return { title, link, source, date };
    })
    .filter((n) => n.title && /^https?:\/\//.test(n.link));
}

async function fetchFeed(source: NewsSource, urls: string[]): Promise<NewsItem[]> {
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const items = parse(await res.text(), source);
      if (!items.length) throw new Error('no headlines in feed');
      console.log(`[news] ${source}: ${items.length} headlines from ${url}`);
      return items.slice(0, PER_SOURCE);
    } catch (err) {
      console.warn(`[news] ${source} ${url} failed: ${(err as Error).message}`);
    }
  }
  console.warn(`[news] ${source}: all feeds failed`);
  return [];
}

// Last good data: the live site publishes /news.json from its previous build.
// If both feeds fail, reuse those headlines instead of showing nothing.
async function fetchLastGood(): Promise<NewsItem[]> {
  const site = import.meta.env.SITE;
  if (!site) return [];
  try {
    const res = await fetch(new URL('/news.json', site), { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { items: (Omit<NewsItem, 'date'> & { date: string | null })[] };
    console.warn(`[news] using last good data from ${site}`);
    return data.items.map((n) => ({ ...n, date: n.date ? new Date(n.date) : null }));
  } catch (err) {
    console.warn(`[news] no last good data: ${(err as Error).message}`);
    return [];
  }
}

let cache: Promise<NewsItem[]> | null = null;

/** All headlines, newest first. Fetched once per build. */
export function getNews(): Promise<NewsItem[]> {
  cache ??= Promise.all(FEEDS.map((f) => fetchFeed(f.source, f.urls)))
    .then(async (lists) => {
      const items = lists.flat();
      return items.length ? items : fetchLastGood();
    })
    .then((items) => items.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)).slice(0, 40));
  return cache;
}

export const formatNewsTime = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)
    : '';

export const NEWS_ATTRIBUTION =
  'Headlines are sourced from Moneycontrol and Investing.com and link to the original articles. News is for information only and is not investment advice.';
