import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export interface Remah {
  label: string;
  href?: string;
}

/**
 * Header halaman untuk layar yang tidak memakai lapisan view bersama.
 *
 * Urutan yang konsisten di seluruh aplikasi: remah, judul, lalu baris aksi
 * dengan aksi utama di KIRI. Aksi utama tidak pernah dibuang ke pojok kanan
 * atas.
 */
export function PageHeader({
  judul,
  keterangan,
  remah,
  aksi,
  kanan,
}: {
  judul: string;
  keterangan?: string;
  remah?: Remah[];
  aksi?: ReactNode;
  kanan?: ReactNode;
}) {
  return (
    <header className="ph-head">
      {remah && remah.length > 0 ? (
        <nav aria-label="Remah navigasi" className="remah">
          <ol>
            {remah.map((r, i) => (
              <li key={`${r.label}-${i}`}>
                {r.href ? <Link href={r.href}>{r.label}</Link> : <span aria-current="page">{r.label}</span>}
                {i < remah.length - 1 ? <ChevronRight size={13} aria-hidden="true" className="remah-panah" /> : null}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="ph-baris">
        {/* R50. Judul dan keterangan dua blok terpisah dengan gap. */}
        <div className="item-text grow">
          <h1 className="title t-h1">{judul}</h1>
          {keterangan ? <p className="meta t-ui-sm">{keterangan}</p> : null}
        </div>
        {kanan}
      </div>

      {aksi ? <div className="ph-aksi">{aksi}</div> : null}
    </header>
  );
}

/** Kartu ringkasan angka. Angka besar tabular plus label di bawahnya. */
export function KpiCard({
  nilai,
  label,
  keterangan,
  tone,
  href,
}: {
  nilai: string;
  label: string;
  keterangan?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  href?: string;
}) {
  const isi = (
    <>
      <span className={`kpi-nilai t-num ${tone ? `kpi-${tone}` : ''}`}>{nilai}</span>
      <span className="item-text">
        <span className="title kpi-label">{label}</span>
        {keterangan ? <span className="meta">{keterangan}</span> : null}
      </span>
    </>
  );
  return href ? (
    <Link href={href} className="kpi kpi-link">{isi}</Link>
  ) : (
    <div className="kpi">{isi}</div>
  );
}
