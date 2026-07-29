import Link from 'next/link';
import type { ReactNode } from 'react';
import { team } from '@/data/team';

/**
 * Mention @Nama di dalam teks komentar. Dicocokkan terhadap nama lengkap
 * anggota tim, nama terpanjang lebih dulu supaya "Ayu Lestari" tidak kepotong
 * jadi "Ayu" saat "Ayu Lestari" dan "Ayu" sama sama ada di tim.
 */
const TIM_TERURUT = [...team].sort((a, b) => b.nama.length - a.nama.length);

export function cariAnggotaUntukMention(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return team.slice(0, 6);
  return team.filter((a) => a.nama.toLowerCase().includes(q)).slice(0, 6);
}

/** Merender teks komentar, menyorot @Nama Anggota sebagai tautan ke profilnya. */
export function renderKomentar(isi: string): ReactNode[] {
  const bagian: ReactNode[] = [];
  let sisa = isi;
  let kunci = 0;

  while (sisa.length > 0) {
    const cocok = TIM_TERURUT.map((a) => ({ a, i: sisa.indexOf(`@${a.nama}`) }))
      .filter((x) => x.i >= 0)
      .sort((x, y) => x.i - y.i)[0];

    if (!cocok) {
      bagian.push(<span key={kunci++}>{sisa}</span>);
      break;
    }

    if (cocok.i > 0) bagian.push(<span key={kunci++}>{sisa.slice(0, cocok.i)}</span>);
    bagian.push(
      <Link key={kunci++} href={`/app/tim/${cocok.a.slug}/`} className="mention">
        @{cocok.a.nama}
      </Link>,
    );
    sisa = sisa.slice(cocok.i + cocok.a.nama.length + 1);
  }

  return bagian;
}
