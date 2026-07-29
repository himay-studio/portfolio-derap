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
} as const;

/** Kredensial demo, sengaja ditampilkan di layar login. Tidak ada auth nyata. */
export const demoLogin = {
  email: 'rangga@derap.id',
  sandi: 'derap2026',
  peran: 'Manajer Proyek',
} as const;
