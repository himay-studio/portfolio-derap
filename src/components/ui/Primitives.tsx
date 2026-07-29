import type { ReactNode } from 'react';
import type { Tone } from '@/data/types';

/* ==========================================================================
   Avatar. Persegi, bukan lingkaran (R10). Blok inisial, bukan foto, jadi
   tidak ada satu pun aset yang perlu digenerate untuk modul Tim.
   ========================================================================== */

export function Avatar({
  inisial,
  warna,
  ukuran = 32,
  nama,
}: {
  inisial: string;
  warna: 1 | 2 | 3 | 4 | 5 | 6;
  ukuran?: 24 | 32 | 40 | 64;
  nama?: string;
}) {
  return (
    <span
      className={`avatar avatar-${ukuran}`}
      style={{ background: `var(--chart-${warna})` }}
      title={nama}
      aria-hidden={nama ? undefined : 'true'}
      role={nama ? 'img' : undefined}
      aria-label={nama}
    >
      {inisial}
    </span>
  );
}

export function AvatarStack({
  orang,
  maks = 4,
}: {
  orang: { id: string; inisial: string; warna: 1 | 2 | 3 | 4 | 5 | 6; nama: string }[];
  maks?: number;
}) {
  const tampil = orang.slice(0, maks);
  const sisa = orang.length - tampil.length;
  return (
    <span className="avatar-stack" role="img" aria-label={`${orang.length} anggota: ${orang.map((o) => o.nama).join(', ')}`}>
      {tampil.map((o) => (
        <span key={o.id} className="avatar avatar-24" style={{ background: `var(--chart-${o.warna})` }} aria-hidden="true">
          {o.inisial}
        </span>
      ))}
      {sisa > 0 ? (
        <span className="avatar avatar-24 avatar-sisa" aria-hidden="true">{`+${sisa}`}</span>
      ) : null}
    </span>
  );
}

/* ==========================================================================
   Badge dan chip
   ========================================================================== */

const KELAS_TONE: Record<Tone, string> = {
  neutral: 'badge-neutral',
  brand: 'badge-brand',
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
};

export function Badge({
  children,
  tone = 'neutral',
  pekat = false,
}: {
  children: ReactNode;
  tone?: Tone;
  pekat?: boolean;
}) {
  return <span className={`badge ${pekat ? 'badge-solid-danger' : KELAS_TONE[tone]}`}>{children}</span>;
}

export function Chip({ children, warna }: { children: ReactNode; warna?: string }) {
  return (
    <span className="chip">
      {warna ? <span className="chip-dot" style={{ background: warna }} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ==========================================================================
   Batang progres. Persegi, tidak ada cincin bulat.
   ========================================================================== */

export function Progress({
  nilai,
  label,
  tone,
  besar,
}: {
  nilai: number;
  label: string;
  tone?: 'brand' | 'success' | 'warn' | 'danger';
  besar?: boolean;
}) {
  const aman = Math.max(0, Math.min(100, nilai));
  const kelas = tone && tone !== 'brand' ? `progress-${tone}` : '';
  return (
    <span
      className={`progress ${besar ? 'progress-lg' : ''} ${kelas}`}
      role="progressbar"
      aria-valuenow={Math.round(aman)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span style={{ width: `${aman}%` }} />
    </span>
  );
}

/* ==========================================================================
   Placeholder beranotasi Stage 3. Bukan gambar AI, dan menyebutkan sendiri
   apa yang akan menggantikannya di Stage 5.
   ========================================================================== */

export function Placeholder({
  label,
  catatan,
  tinggi,
}: {
  label: string;
  catatan: string;
  tinggi?: number;
}) {
  return (
    <div className="ph" style={tinggi ? { minHeight: tinggi } : undefined}>
      <span className="ph-label">{label}</span>
      <span className="ph-note">{catatan}</span>
    </div>
  );
}

/* ==========================================================================
   Keadaan kosong. Bentuk geometris siku yang ditulis tangan, bukan ilustrasi
   hasil generate. Satu kalimat penjelas plus satu aksi utama.
   ========================================================================== */

export function EmptyState({
  judul,
  penjelasan,
  aksi,
  ragam = 'kotak',
}: {
  judul: string;
  penjelasan: string;
  aksi?: ReactNode;
  ragam?: 'kotak' | 'papan' | 'kalender' | 'garis';
}) {
  return (
    <div className="empty">
      <EmptyArt ragam={ragam} />
      <div className="item-text empty-text">
        <span className="title t-h3">{judul}</span>
        <span className="meta t-ui-sm">{penjelasan}</span>
      </div>
      {aksi ? <div className="empty-aksi">{aksi}</div> : null}
    </div>
  );
}

function EmptyArt({ ragam }: { ragam: 'kotak' | 'papan' | 'kalender' | 'garis' }) {
  const stroke = 'var(--border-control)';
  const isi = 'var(--surface-2)';
  return (
    <svg width="96" height="72" viewBox="0 0 96 72" aria-hidden="true" focusable="false" className="empty-art">
      {ragam === 'papan' ? (
        <>
          <rect x="2" y="6" width="27" height="60" fill={isi} stroke={stroke} />
          <rect x="34" y="6" width="27" height="60" fill={isi} stroke={stroke} />
          <rect x="66" y="6" width="27" height="60" fill={isi} stroke={stroke} />
          <rect x="7" y="13" width="17" height="9" fill="var(--brand-soft)" stroke={stroke} />
          <rect x="39" y="13" width="17" height="9" fill="var(--surface)" stroke={stroke} />
        </>
      ) : null}
      {ragam === 'kalender' ? (
        <>
          <rect x="8" y="8" width="80" height="56" fill={isi} stroke={stroke} />
          <rect x="8" y="8" width="80" height="12" fill="var(--surface-3)" stroke={stroke} />
          {[0, 1, 2, 3].map((c) => (
            <line key={`v${c}`} x1={8 + (c + 1) * 16} y1="20" x2={8 + (c + 1) * 16} y2="64" stroke={stroke} />
          ))}
          {[0, 1].map((r) => (
            <line key={`h${r}`} x1="8" y1={35 + r * 15} x2="88" y2={35 + r * 15} stroke={stroke} />
          ))}
        </>
      ) : null}
      {ragam === 'garis' ? (
        <>
          <rect x="4" y="14" width="44" height="10" fill="var(--brand-soft)" stroke={stroke} />
          <rect x="20" y="31" width="52" height="10" fill={isi} stroke={stroke} />
          <rect x="36" y="48" width="40" height="10" fill={isi} stroke={stroke} />
        </>
      ) : null}
      {ragam === 'kotak' ? (
        <>
          <rect x="10" y="10" width="76" height="52" fill={isi} stroke={stroke} />
          <rect x="18" y="20" width="34" height="7" fill="var(--surface-3)" stroke={stroke} />
          <rect x="18" y="33" width="60" height="7" fill="var(--surface-3)" stroke={stroke} />
          <rect x="18" y="46" width="46" height="7" fill="var(--surface-3)" stroke={stroke} />
        </>
      ) : null}
    </svg>
  );
}

/* ==========================================================================
   Skeleton. Bukan spinner layar penuh, supaya tata letak tidak melompat.
   ========================================================================== */

export function Skeleton({ w, h = 14 }: { w?: number | string; h?: number }) {
  return <span className="skeleton" style={{ display: 'block', width: w ?? '100%', height: h }} aria-hidden="true" />;
}

export function SkeletonBaris({ jumlah = 5 }: { jumlah?: number }) {
  return (
    <div className="stack gap-2" aria-hidden="true">
      {Array.from({ length: jumlah }, (_, i) => (
        <Skeleton key={i} h={20} />
      ))}
    </div>
  );
}
