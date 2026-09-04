/**
 * Everything that needs a real-world value before launch lives here.
 * Anything still wrapped in [SQUARE BRACKETS] is a placeholder and will
 * render visibly as one on the page — replace it, don't delete it.
 */

/**
 * Canonical public origin — used for canonical URLs, the sitemap and Open Graph
 * tags. shab.au and www.shab.com.au redirect here at the edge, so this value is
 * the single answer search engines get.
 */
export const SITE_URL = 'https://shab.com.au';

/** Cal.com booking page. Create a free account, then paste the link here. */
export const BOOKING_URL = '[YOUR CAL.COM LINK]';

export const CONTACT = {
  email: 'hello@shab.com.au',
} as const;

export const COMPANY = {
  name: 'Shab',
  strapline: 'Digital | Data | Cyber',
  address: 'Adelaide, South Australia',
  /** Australian Business Number — 11 digits, shown in the footer and on the privacy page. */
  abn: '45 074 849 006',
} as const;

/**
 * Date the privacy policy last changed, ISO format. Bump it whenever the
 * policy text changes — readers and procurement reviewers look for it.
 */
export const PRIVACY_UPDATED = '2026-09-04';

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
