import Image from 'next/image';
import Link from 'next/link';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Check } from 'lucide-react';
import { Placeholder } from '@/components/ui/Primitives';
import { site } from '@/data/site';

/**
 * Empat tangkapan layar produk (S01 sampai S04, `MEDIA.md`) ada kalau
 * `scripts/landing-shots.mjs` sudah dijalankan setelah build. Dicek di build
 * time, bukan diasumsikan selalu ada, supaya sebuah build TANPA tangkapan
 * layar tetap menunjukkan placeholder beranotasi yang jujur (R15) daripada
 * `<img>` yang menunjuk berkas kosong.
 */
const ADA_TANGKAPAN = (nama: string) => existsSync(join(process.cwd(), 'public', 'img', nama));

const POIN = [
  'Empat view setara untuk data yang sama, Kanban, Tabel, Kalender, dan Timeline.',
  'Kesehatan proyek dihitung dari tenggat dan progres, bukan diisi manual.',
  'Beban kerja per orang terlihat sebelum ada yang tumbang.',
  'Sepenuhnya Bahasa Indonesia, termasuk label kolom dan status.',
];

export default function Landing() {
  return (
    <div className="lp">
      <header className="lp-top">
        {/* Latar terang, jadi varian primary (R43). Varian knockout putih akan
            hilang sama sekali di permukaan ini. */}
        <Link href="/" className="lockup" aria-label={site.nama}>
          <Image src="/mark-derap.svg" alt="" width={28} height={28} priority />
          <span className="lockup-text">
            <span className="lockup-name">{site.nama}</span>
            <span className="lockup-tagline text-muted">{site.taglinePendek}</span>
          </span>
        </Link>
        <span className="grow" />
        <Link href="/login/" className="btn btn-secondary">Masuk ke demo</Link>
      </header>

      <main className="lp-main">
        <div className="lp-inner">
          <div>
            <h1 className="lp-judul">{site.tagline}</h1>
            <p className="lp-sub">
              {site.nama} adalah aplikasi manajemen proyek dan tugas untuk tim 8 sampai 80 orang.
              Satu tempat untuk proyek, tugas, sprint, dan beban tim, dengan kedalaman view setara
              tool global tapi tanpa kerumitannya.
            </p>

            <div className="lp-aksi">
              <Link href="/login/" className="btn btn-cta">Coba Demo Sekarang</Link>
              <Link href="/app/" className="btn btn-secondary">Langsung ke Dashboard</Link>
            </div>

            <ul className="lp-poin">
              {POIN.map((p) => (
                <li key={p}>
                  <Check size={16} aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* Antarmuka TIDAK PERNAH digenerate AI, karena hasilnya selalu
                berisi teks kacau dan tata letak yang tidak mungkin, dan itu
                justru merusak kepercayaan pada produk software
                (ART-DIRECTION.md bagian 7). Empat tangkapan layar ini diambil
                dari build aplikasi sendiri lewat `scripts/landing-shots.mjs`
                (S01 sampai S04, MEDIA.md), bukan digenerate. */}
            {ADA_TANGKAPAN('app-kanban.png') ? (
              <Image src="/img/app-kanban.png" alt="Papan Kanban Derap dengan tugas dikelompokkan per status" width={1440} height={900} className="lp-shot" priority />
            ) : (
              <Placeholder
                label="Tangkapan layar, papan Kanban"
                catatan="Diganti dengan tangkapan layar asli /app/tugas/ pada lebar 1440px, faktor skala 2x, disimpan di public/img/app-kanban.png lewat scripts/landing-shots.mjs."
                tinggi={280}
              />
            )}
            <div className="grid-3" style={{ marginTop: 'var(--sp-3)' }}>
              {ADA_TANGKAPAN('app-tabel.png') ? (
                <Image src="/img/app-tabel.png" alt="Tabel tugas Derap dengan kolom bisa diurutkan" width={720} height={450} className="lp-shot" />
              ) : (
                <Placeholder
                  label="Tangkapan layar, Tabel"
                  catatan="public/img/app-tabel.png, diambil dari /app/tugas/ pada view Tabel."
                  tinggi={132}
                />
              )}
              {ADA_TANGKAPAN('app-timeline.png') ? (
                <Image src="/img/app-timeline.png" alt="Timeline proyek Derap" width={720} height={450} className="lp-shot" />
              ) : (
                <Placeholder
                  label="Tangkapan layar, Timeline"
                  catatan="public/img/app-timeline.png, diambil dari /app/proyek/ pada view Timeline."
                  tinggi={132}
                />
              )}
              {ADA_TANGKAPAN('app-dashboard.png') ? (
                <Image src="/img/app-dashboard.png" alt="Dashboard ringkasan Derap" width={720} height={450} className="lp-shot" />
              ) : (
                <Placeholder
                  label="Tangkapan layar, Dashboard"
                  catatan="public/img/app-dashboard.png, diambil dari /app/."
                  tinggi={132}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="lp-kaki">
        <span className="t-caption text-muted">
          {site.nama} adalah demo portfolio. Data di dalamnya fiktif dan tidak terhubung ke sistem mana pun.
        </span>
        <span className="grow" />
        <a href={site.studioUrl} target="_blank" rel="noopener" className="t-caption">
          Designed &amp; Developed by {site.studio}
        </a>
      </footer>
    </div>
  );
}
