/** Konstanta merek dan tautan. Satu sumber, dipakai metadata dan seluruh UI. */

export const site = {
  nama: 'Derap',
  tagline: 'Ritme kerja tim, terlihat jelas.',
  taglinePendek: 'Ritme kerja tim',
  deskripsi:
    'Manajemen proyek berbahasa Indonesia yang membuat ritme kerja dan beban tim terlihat di layar pertama.',
  domain: 'https://portfolio-derap.himaystudio.com',
  studio: 'Himay Studio',
  studioUrl: 'https://himaystudio.com',
  /** Merek fiktif untuk demo portfolio, jadi kanonik menunjuk ke dirinya sendiri (R35). */
  clientDomain: null as string | null,
  kodeTugas: 'DRP',
  /* HIM-356 classification dimension for retargeting audiences. Derap is a project
     management SaaS tool (Indonesian-language team rhythm/workload dashboard), which
     fits "services" (a software service) rather than ecommerce/fashion/distributor/
     food-and-beverage/hotel. */
  category: 'services' as string | null,
} as const;

/** R36: GTM container id, single config constant. GA4 rides through this container
 *  using the shared measurement property. Meta Pixel (browser) + Meta CAPI (server,
 *  functions/api/meta-events.ts) client wiring landed HIM-360 via src/lib/analytics.ts
 *  + src/components/MetaPixelClient.tsx, mounted in src/app/layout.tsx. */
export const TRACKING = {
  gtmId: 'GTM-WZJZTSKG',
  category: site.category,
} as const;

/** Kredensial demo, sengaja ditampilkan di layar login. Tidak ada auth nyata. */
export const demoLogin = {
  email: 'rangga@derap.id',
  sandi: 'derap2026',
  peran: 'Manajer Proyek',
} as const;
