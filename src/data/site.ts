// Site-wide facts. Program details (fee, modules, FAQ) go in program.ts.

export const site = {
  name: 'Tradot Academy',
  phoneDisplay: '+91 96458 86344',
  phoneHref: 'tel:+919645886344',
  whatsappNumber: '919645886344',
  location: 'Kalamassery, Kochi, Kerala',
  // TODO(client): email, full street address, Google Maps link, social links.
  disclaimer:
    'Tradot Academy provides stock market education only. We do not offer investment advice, tips or guaranteed returns. Trading in securities involves risk.',
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/course', label: 'Course' },
  { href: '/market-news', label: 'Market News' },
  { href: '/contact', label: 'Contact' },
] as const;

export const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/disclaimer', label: 'Disclaimer' },
] as const;
