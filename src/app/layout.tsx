import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { site } from '@/data/site';
import './globals.css';
import './app.css';

/** R36: GTM container shared across himaystudio.com + every portfolio subdomain. */
const GTM_ID = 'GTM-WZJZTSKG';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const ui = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ui',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.nama}, Portfolio Website by Himay Studio`,
    template: `%s, ${site.nama} by Himay Studio`,
  },
  description: `Live preview aplikasi ${site.nama}. Proyek pembuatan aplikasi web profesional oleh Himay Studio. Ingin buat aplikasi seperti ini? Hubungi kami.`,
  // Merek demo, jadi kanonik menunjuk ke dirinya sendiri (R35).
  alternates: { canonical: site.domain },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: site.domain,
    siteName: site.nama,
    title: `${site.nama}, ${site.tagline}`,
    description: site.deskripsi,
    // Ditulis tangan sebagai SVG lalu dirender Chromium lewat
    // `scripts/gen-og.mjs`, bukan digenerate model gambar. Isinya persegi datar
    // dan dua string teks, jadi jalur deterministik menghasilkan tepi lebih
    // tajam dan ejaan yang dijamin benar.
    images: [{ url: '/og-derap.png', width: 1200, height: 630, alt: `${site.nama}, ${site.tagline}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.nama}, ${site.tagline}`,
    description: site.deskripsi,
    images: ['/og-derap.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0E1524',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Keadaan lipat sidebar dipasang SEBELUM paint pertama, sebagai atribut pada
 * `<html>`. Membacanya dari React akan selalu memberi satu frame sidebar lebar
 * lalu menyempit, dan pada static export juga membuat markup server berbeda
 * dari klien.
 */
const SKRIP_SIDEBAR = `try{var v=localStorage.getItem('derap.sidebar.collapsed');document.documentElement.setAttribute('data-sidebar',v==='true'?'collapsed':'expanded')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-sidebar="expanded" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <head>
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: SKRIP_SIDEBAR }} />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
