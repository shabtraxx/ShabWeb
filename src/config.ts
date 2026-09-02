/**
 * Everything that needs a real-world value before launch lives here.
 * Anything still wrapped in [SQUARE BRACKETS] is a placeholder and will
 * render visibly as one on the page — replace it, don't delete it.
 */

/** Public origin, used for canonical URLs, sitemap and Open Graph tags. */
export const SITE_URL = 'https://example.com';

/** Cal.com booking page. Create a free account, then paste the link here. */
export const BOOKING_URL = '[YOUR CAL.COM LINK]';

export const CONTACT = {
  email: '[YOUR EMAIL]',
  phone: '[YOUR PHONE]',
} as const;

export const COMPANY = {
  name: 'Shab',
  strapline: 'Digital | Data | Cyber',
  address: '[REGISTERED ADDRESS]',
  number: '[COMPANY NUMBER]',
} as const;

export const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'How we work', href: '#how-we-work' },
  { label: 'Contact', href: '#contact' },
] as const;

/** True once the value no longer looks like [A PLACEHOLDER]. */
export const isSet = (value: string): boolean => !value.startsWith('[');

/** A booking link that is safe to render before the real URL exists. */
export const bookingHref = (): string =>
  isSet(BOOKING_URL) ? BOOKING_URL : '#contact';
