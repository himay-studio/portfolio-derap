'use client';

import { ChevronDown, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDisclosure } from './useDisclosure';

export interface OpsiSelect {
  nilai: string;
  label: string;
  /** Label sekunder. R50 merender ini sebagai blok terpisah, bukan teks inline. */
  keterangan?: string;
  /** Titik warna kecil, misalnya untuk kolom status atau label. */
  warna?: string;
  nonaktif?: boolean;
}

interface Props {
  nilai: string;
  opsi: OpsiSelect[];
  onUbah: (nilai: string) => void;
  label: string;
  /** Sembunyikan label visual, tetap terbaca pembaca layar. */
  labelTersembunyi?: boolean;
  placeholder?: string;
  nama?: string;
  lebar?: number | string;
  /** Panel menjangkar menjauhi tepi terdekat (R16.1). */
  jangkar?: 'kiri' | 'kanan';
  ukuran?: 'sm' | 'md';
  className?: string;
}

/**
 * R12. Dropdown kustom. `<select>` bawaan browser dilarang di seluruh aplikasi.
 *
 * Papan ketik: ArrowDown dan ArrowUp berpindah, Home dan End ke ujung, Enter
 * atau Space memilih, Escape menutup, mengetik huruf melompat ke opsi yang
 * cocok. Fokus tetap di pemicu, opsi aktif ditandai `aria-activedescendant`,
 * jadi tidak ada perpindahan fokus yang bisa membuat panel tertutup sendiri.
 */
export function Select({
  nilai,
  opsi,
  onUbah,
  label,
  labelTersembunyi,
  placeholder = 'Pilih',
  nama,
  lebar,
  jangkar = 'kiri',
  ukuran = 'md',
  className,
}: Props) {
  const d = useDisclosure();
  const [sorot, setSorot] = useState(() => Math.max(0, opsi.findIndex((o) => o.nilai === nilai)));
  const ketikRef = useRef({ buffer: '', waktu: 0 });
  const daftarRef = useRef<HTMLUListElement | null>(null);

  const terpilih = opsi.find((o) => o.nilai === nilai);

  useEffect(() => {
    if (d.terbuka) setSorot(Math.max(0, opsi.findIndex((o) => o.nilai === nilai)));
  }, [d.terbuka, nilai, opsi]);

  useEffect(() => {
    if (!d.terbuka) return;
    const el = daftarRef.current?.querySelector<HTMLElement>('[data-sorot="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [sorot, d.terbuka]);

  const pilih = (i: number) => {
    const o = opsi[i];
    if (!o || o.nonaktif) return;
    onUbah(o.nilai);
    d.tutup();
  };

  const geser = (arah: number) => {
    setSorot((s) => {
      let n = s;
      for (let i = 0; i < opsi.length; i += 1) {
        n = (n + arah + opsi.length) % opsi.length;
        if (!opsi[n].nonaktif) return n;
      }
      return s;
    });
  };

  const padaKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!d.terbuka) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        d.buka();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); geser(1); break;
      case 'ArrowUp':   e.preventDefault(); geser(-1); break;
      case 'Home':      e.preventDefault(); setSorot(opsi.findIndex((o) => !o.nonaktif)); break;
      case 'End': {
        e.preventDefault();
        for (let i = opsi.length - 1; i >= 0; i -= 1) if (!opsi[i].nonaktif) { setSorot(i); break; }
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        pilih(sorot);
        break;
      case 'Tab':
        d.tutup(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          const sekarang = Date.now();
          const k = ketikRef.current;
          k.buffer = sekarang - k.waktu > 700 ? e.key : k.buffer + e.key;
          k.waktu = sekarang;
          const cari = k.buffer.toLowerCase();
          const idx = opsi.findIndex((o) => !o.nonaktif && o.label.toLowerCase().startsWith(cari));
          if (idx >= 0) setSorot(idx);
        }
    }
  };

  return (
    <div className={`sel ${className ?? ''}`} style={lebar ? { width: lebar } : undefined}>
      <label
        className={labelTersembunyi ? 'sr-only' : 'sel-label'}
        id={`${d.idPemicu}-label`}
        htmlFor={d.idPemicu}
      >
        {label}
      </label>

      <button
        type="button"
        id={d.idPemicu}
        ref={d.pemicuRef}
        className={`sel-trigger ${ukuran === 'sm' ? 'sel-sm' : ''}`}
        role="combobox"
        aria-haspopup="listbox"
        // R60. Nilai yang sama persis yang menentukan panel tampil atau tidak.
        aria-expanded={d.terbuka}
        aria-controls={d.idPanel}
        aria-labelledby={`${d.idPemicu}-label ${d.idPemicu}`}
        aria-activedescendant={d.terbuka ? `${d.idPanel}-o${sorot}` : undefined}
        onClick={d.alih}
        onKeyDown={padaKeyDown}
      >
        <span className="sel-value">
          {terpilih ? (
            <>
              {terpilih.warna ? <span className="chip-dot" style={{ background: terpilih.warna }} aria-hidden="true" /> : null}
              <span className="truncate">{terpilih.label}</span>
            </>
          ) : (
            <span className="sel-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={16} aria-hidden="true" className={`chevron ${d.terbuka ? 'chevron-open' : ''}`} />
      </button>

      {nama ? <input type="hidden" name={nama} value={nilai} readOnly /> : null}

      <div
        ref={d.panelRef}
        id={d.idPanel}
        className={`pop pop-anim sel-pop ${jangkar === 'kanan' ? 'pop-right' : 'pop-left'} ${d.masuk ? 'pop-enter' : ''}`}
        hidden={!d.terpasang}
      >
        <div className="pop-anim-inner">
          <ul className="sel-list" role="listbox" aria-labelledby={`${d.idPemicu}-label`} ref={daftarRef}>
            {opsi.map((o, i) => {
              const aktif = o.nilai === nilai;
              return (
                <li
                  key={o.nilai}
                  id={`${d.idPanel}-o${i}`}
                  role="option"
                  aria-selected={aktif}
                  aria-disabled={o.nonaktif || undefined}
                  data-sorot={i === sorot}
                  className={`sel-opt ${i === sorot ? 'sel-opt-sorot' : ''} ${o.nonaktif ? 'sel-opt-mati' : ''}`}
                  onPointerDown={(e) => { e.preventDefault(); pilih(i); }}
                  onPointerEnter={() => !o.nonaktif && setSorot(i)}
                >
                  {o.warna ? <span className="chip-dot" style={{ background: o.warna }} aria-hidden="true" /> : null}
                  {/* R50. Judul dan keterangan adalah dua blok dengan gap, bukan
                      dua node teks inline yang akan menempel saat dirender. */}
                  <span className="item-text grow">
                    <span className="title">{o.label}</span>
                    {o.keterangan ? <span className="meta">{o.keterangan}</span> : null}
                  </span>
                  {aktif ? <Check size={15} aria-hidden="true" className="sel-check" /> : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
