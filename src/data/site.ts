// Site-wide facts. Program details (fee, modules, FAQ) go in program.ts.

/**
 * Colour theme. 'dark' = ink heroes and footer; 'light' = all-light sections.
 * Everything else is shared, so switching is this one line.
 */
export const THEME: 'dark' | 'light' = 'light';

/** Logo variant that reads on the theme's nav and footer. */
export const logoSrc = THEME === 'light' ? '/logo.webp' : '/logo-white.webp';

export const site = {
  name: 'Tradot Academy',
  phoneDisplay: '+91 96458 86344',
  phoneHref: 'tel:+919645886344',
  whatsappNumber: '919645886344',
  location: 'Kalamassery, Kochi, Kerala',
  address: {
    street: '65/A1, Changampuzha Nagar',
    locality: 'Kalamassery, Kochi',
    region: 'Kerala',
    postalCode: '682033',
  },
  // TODO(client): email, opening hours, social links.
  disclaimer:
    'Tradot Academy provides stock market education only. We do not offer investment advice, tips or guaranteed returns. Trading in securities involves risk.',
} as const;

/** Address as display lines, e.g. for the footer and contact page. */
export const addressLines = [
  site.address.street,
  site.address.locality,
  `${site.address.region} ${site.address.postalCode}`,
] as const;

const mapQuery = encodeURIComponent(`Tradot Academy, ${addressLines.join(', ')}`);
export const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`;
export const mapDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

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
