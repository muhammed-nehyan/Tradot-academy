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

const FEEDS: { source: NewsSource; url: string }[] = [
  { source: 'Moneycontrol', url: 'https://www.moneycontrol.com/rss/marketreports.xml' },
  { source: 'Investing.com', url: 'https://in.investing.com/rss/news_25.rss' },
];

const TIMEOUT_MS = 8000;

const decode = (s: string) =>
  s
    .replace(/^<!\[CDATA\[|\]\]>$/g, '')
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

function parse(xml: string, source: NewsSource): NewsItem[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  return items
    .map((item) => {
      const title = tag(item, 'title');
      const link = tag(item, 'link');
      const raw = tag(item, 'pubDate');
      const date = raw ? new Date(raw) : null;
      return { title, link, source, date: date && !isNaN(+date) ? date : null };
    })
    .filter((n) => n.title && /^https?:\/\//.test(n.link));
}

async function fetchFeed(source: NewsSource, url: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TradotAcademyBot/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parse(await res.text(), source);
  } catch (err) {
    console.warn(`[news] ${source} feed unavailable: ${(err as Error).message}`);
    return [];
  }
}

let cache: Promise<NewsItem[]> | null = null;

/** All headlines, newest first. Fetched once per build. */
export function getNews(): Promise<NewsItem[]> {
  cache ??= Promise.all(FEEDS.map((f) => fetchFeed(f.source, f.url))).then((lists) =>
    lists.flat().sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)),
  );
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
