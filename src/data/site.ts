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
 *  using the shared measurement property. Meta Pixel/CAPI client code is not wired
 *  on this site (dashboard app, no client fbq/Pixel scaffolding exists), so those
 *  channels stay dormant here regardless of category, out of scope for HIM-356. */
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
