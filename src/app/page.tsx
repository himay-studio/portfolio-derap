import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Placeholder } from '@/components/ui/Primitives';
import { site } from '@/data/site';

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
                justru merusak kepercayaan pada produk software. Stage 5 atau 6
                mengganti blok ini dengan tangkapan layar aplikasi yang asli
                (ART-DIRECTION.md bagian 7). */}
            <Placeholder
              label="Tangkapan layar, papan Kanban"
              catatan="Diganti Stage 6 dengan tangkapan layar asli /app/tugas/ pada lebar 1440px, faktor skala 2x, disimpan di public/img/app-kanban.png."
              tinggi={280}
            />
            <div className="grid-3" style={{ marginTop: 'var(--sp-3)' }}>
              <Placeholder
                label="Tangkapan layar, Tabel"
                catatan="public/img/app-tabel.png, diambil dari /app/tugas/ pada view Tabel."
                tinggi={132}
              />
              <Placeholder
                label="Tangkapan layar, Timeline"
                catatan="public/img/app-timeline.png, diambil dari /app/proyek/ pada view Timeline."
                tinggi={132}
              />
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
