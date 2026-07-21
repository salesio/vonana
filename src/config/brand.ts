/**
 * Central brand configuration.
 *
 * Every visible reference to the platform's name, tagline, logo assets and
 * colour system should be read from this file rather than hard-coded across
 * the app. To rebrand the platform later, this is the only file that needs
 * to change (plus the actual files under /public/brand).
 */

export const brand = {
  name: 'VONANA',
  tagline: 'Pessoas. Comunidades. Negócios.',
  shortDescription:
    'A rede social e de negócios de Moçambique — para se conectar, participar em comunidades e comprar e vender com confiança.',

  logos: {
    // Official VONANA assets (Milestone 1). Swap these files under
    // /public/brand to rebrand — no application code needs to change.
    primary: '/brand/logo-primary.png',
    light: '/brand/logo-light.png',
    dark: '/brand/logo-dark.png',
    symbol: '/brand/symbol.png',
    appIcon: '/brand/app-icon.png',
    favicon: '/brand/favicon.ico',
  },

  colors: {
    navy: '#0D1326',
    electricBlue: '#1B3CFF',
    turquoise: '#00C2B5',
    orange: '#FF8A00',
    offWhite: '#F2F4F8',
  },

  fonts: {
    display: 'Poppins',
    body: 'Poppins',
  },

  social: {
    supportEmail: 'suporte@vonana.co.mz',
  },
} as const;

export type Brand = typeof brand;
