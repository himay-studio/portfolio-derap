'use client';

import { Check, Minus, Search } from 'lucide-react';
import { useId, type ReactNode } from 'react';

/**
 * Kontrol form. Batas WAJIB `--border-control` #767F8F yang menghasilkan
 * 4.04:1 di atas permukaan putih. `--border` #D5DAE3 hanya 1.40:1 dan
 * DILARANG dipakai sebagai batas kontrol (R20, DESIGN.md 2.6). Ini persis
 * kelas kegagalan yang muncul di Komodrift.
 */

export function Checkbox({
  checked,
  onChange,
  label,
  labelTersembunyi,
  sebagian,
  nonaktif,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  labelTersembunyi?: boolean;
  sebagian?: boolean;
  nonaktif?: boolean;
}) {
  const id = useId();
  return (
    <span className="cb-wrap">
      <input
        id={id}
        type="checkbox"
        className="cb-input"
        checked={checked}
        disabled={nonaktif}
        aria-checked={sebagian ? 'mixed' : checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="cb-box" aria-hidden="true">
        {sebagian ? <Minus size={13} /> : checked ? <Check size={13} /> : null}
      </span>
      <label htmlFor={id} className={labelTersembunyi ? 'sr-only' : 'cb-label'}>
        {label}
      </label>
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  keterangan,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  keterangan?: string;
}) {
  const id = useId();
  return (
    <span className="tg-wrap">
      {/* R50. Label dan keterangan adalah dua blok terpisah dengan gap. */}
      <span className="item-text grow">
        <label className="title" htmlFor={id}>{label}</label>
        {keterangan ? <span className="meta">{keterangan}</span> : null}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`tg ${checked ? 'tg-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="tg-knob" aria-hidden="true" />
        <span className="sr-only">{checked ? 'Aktif' : 'Nonaktif'}</span>
      </button>
    </span>
  );
}

export function Stepper({
  nilai,
  onUbah,
  label,
  min = 0,
  max = 999,
  langkah = 1,
  satuan,
}: {
  nilai: number;
  onUbah: (v: number) => void;
  label: string;
  min?: number;
  max?: number;
  langkah?: number;
  satuan?: string;
}) {
  const id = useId();
  const batas = (v: number) => Math.max(min, Math.min(max, Math.round(v * 10) / 10));
  return (
    <span className="stp">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <button type="button" className="stp-btn" onClick={() => onUbah(batas(nilai - langkah))} aria-label={`Kurangi ${label}`} disabled={nilai <= min}>
        <Minus size={14} aria-hidden="true" />
      </button>
      <input
        id={id}
        className="stp-input t-num"
        inputMode="decimal"
        value={satuan ? `${nilai}${satuan}` : nilai}
        onChange={(e) => {
          const n = Number.parseFloat(e.target.value.replace(/[^0-9.,]/g, '').replace(',', '.'));
          if (!Number.isNaN(n)) onUbah(batas(n));
        }}
      />
      <button type="button" className="stp-btn" onClick={() => onUbah(batas(nilai + langkah))} aria-label={`Tambah ${label}`} disabled={nilai >= max}>
        <span aria-hidden="true" className="stp-plus">+</span>
      </button>
    </span>
  );
}

export function SearchInput({
  nilai,
  onUbah,
  label,
  placeholder = 'Cari',
  lebar,
}: {
  nilai: string;
  onUbah: (v: string) => void;
  label: string;
  placeholder?: string;
  lebar?: number | string;
}) {
  const id = useId();
  return (
    <span className="search-wrap" style={lebar ? { width: lebar } : undefined}>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <Search size={15} aria-hidden="true" className="search-icon" />
      <input
        id={id}
        type="search"
        className="input input-search"
        value={nilai}
        placeholder={placeholder}
        onChange={(e) => onUbah(e.target.value)}
      />
    </span>
  );
}

/** Kelompok tombol siku bersebelahan. Dipakai kepadatan tabel dan penyaring cepat. */
export function SegmentedControl<T extends string>({
  nilai,
  onUbah,
  opsi,
  label,
}: {
  nilai: T;
  onUbah: (v: T) => void;
  opsi: { nilai: T; label: string; ikon?: ReactNode }[];
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {opsi.map((o) => (
        <button
          key={o.nilai}
          type="button"
          className={`seg-btn ${o.nilai === nilai ? 'seg-btn-aktif' : ''}`}
          aria-pressed={o.nilai === nilai}
          onClick={() => onUbah(o.nilai)}
        >
          {o.ikon}
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
