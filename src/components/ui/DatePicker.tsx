'use client';

import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  HARI_INI,
  NAMA_BULAN,
  NAMA_HARI,
  NAMA_HARI_PENDEK,
  indeksHari,
  jumlahHariBulan,
  parseIso,
  tambahHari,
  tanggalPanjang,
  toIso,
} from '@/lib/dates';
import { useDisclosure } from './useDisclosure';

interface Props {
  nilai: string | null;
  onUbah: (iso: string | null) => void;
  label: string;
  labelTersembunyi?: boolean;
  placeholder?: string;
  nama?: string;
  /** Batas bawah dan atas, dipakai rentang tanggal. */
  min?: string;
  max?: string;
  bisaDikosongkan?: boolean;
  jangkar?: 'kiri' | 'kanan';
  ukuran?: 'sm' | 'md';
  lebar?: number | string;
}

/**
 * R21. Pemilih tanggal kustom. Input teks bebas untuk tanggal dilarang, karena
 * menghasilkan data yang tidak bisa diurai dan tidak bisa divalidasi.
 *
 * Papan ketik mengikuti pola grid ARIA: panah memindah satu hari atau satu
 * minggu, PageUp dan PageDown memindah satu bulan, Home dan End ke awal dan
 * akhir minggu, Enter atau Space memilih, Escape menutup dan mengembalikan
 * fokus ke pemicu.
 */
export function DatePicker({
  nilai,
  onUbah,
  label,
  labelTersembunyi,
  placeholder = 'Pilih tanggal',
  nama,
  min,
  max,
  bisaDikosongkan = true,
  jangkar = 'kiri',
  ukuran = 'md',
  lebar,
}: Props) {
  const d = useDisclosure();
  const [fokus, setFokus] = useState<string>(nilai ?? HARI_INI);
  const [bulanTampil, setBulanTampil] = useState(() => parseIso(nilai ?? HARI_INI));
  const gridRef = useRef<HTMLTableElement | null>(null);
  const perluFokus = useRef(false);

  useEffect(() => {
    if (d.terbuka) {
      const awal = nilai ?? HARI_INI;
      setFokus(awal);
      setBulanTampil(parseIso(awal));
      perluFokus.current = true;
    }
  }, [d.terbuka, nilai]);

  /**
   * Fokus baru dipindahkan setelah panelnya BENAR BENAR terpasang.
   *
   * Saat `terpasang` masih false, panel membawa atribut `hidden` sehingga
   * `display: none`, dan `focus()` pada elemen di dalamnya diam diam tidak
   * melakukan apa apa. Versi pertama kode ini tetap menurunkan flag `perluFokus`
   * di render itu juga, jadi saat panel akhirnya tampil tidak ada lagi yang
   * meminta fokus, dan seluruh jalur papan ketik date picker mati tanpa satu
   * pun tanda yang kelihatan di layar.
   */
  useEffect(() => {
    if (!d.terbuka || !d.terpasang || !perluFokus.current) return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>('[data-fokus="true"]');
    if (!el || el.offsetParent === null) return;
    el.focus();
    perluFokus.current = false;
  });

  const diluarBatas = (iso: string) => (min && iso < min) || (max && iso > max);

  const pindahFokus = (iso: string) => {
    if (diluarBatas(iso)) return;
    setFokus(iso);
    setBulanTampil(parseIso(iso));
    perluFokus.current = true;
  };

  const pilih = (iso: string) => {
    if (diluarBatas(iso)) return;
    onUbah(iso);
    d.tutup();
  };

  const gantiBulan = (delta: number) => {
    setBulanTampil((b) => {
      const m = b.m + delta;
      const y = b.y + Math.floor((m - 1) / 12);
      const mm = ((m - 1) % 12 + 12) % 12 + 1;
      return { y, m: mm, d: Math.min(b.d, jumlahHariBulan(y, mm)) };
    });
  };

  const padaGridKeyDown = (e: React.KeyboardEvent) => {
    const langkah: Record<string, number> = {
      ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7,
    };
    if (e.key in langkah) {
      e.preventDefault();
      pindahFokus(tambahHari(fokus, langkah[e.key]));
      return;
    }
    if (e.key === 'Home') { e.preventDefault(); pindahFokus(tambahHari(fokus, -indeksHari(fokus))); return; }
    if (e.key === 'End')  { e.preventDefault(); pindahFokus(tambahHari(fokus, 6 - indeksHari(fokus))); return; }
    if (e.key === 'PageUp')   { e.preventDefault(); geserBulanFokus(-1); return; }
    if (e.key === 'PageDown') { e.preventDefault(); geserBulanFokus(1); return; }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pilih(fokus); }
  };

  const geserBulanFokus = (delta: number) => {
    const f = parseIso(fokus);
    const m = f.m + delta;
    const y = f.y + Math.floor((m - 1) / 12);
    const mm = ((m - 1) % 12 + 12) % 12 + 1;
    pindahFokus(toIso({ y, m: mm, d: Math.min(f.d, jumlahHariBulan(y, mm)) }));
  };

  // Grid enam baris tetap supaya tinggi panel tidak melompat saat ganti bulan.
  const awalGrid = tambahHari(toIso({ ...bulanTampil, d: 1 }), -indeksHari(toIso({ ...bulanTampil, d: 1 })));
  const minggu: string[][] = [];
  for (let w = 0; w < 6; w += 1) {
    minggu.push(Array.from({ length: 7 }, (_, i) => tambahHari(awalGrid, w * 7 + i)));
  }

  return (
    <div className="dp" style={lebar ? { width: lebar } : undefined}>
      <label className={labelTersembunyi ? 'sr-only' : 'sel-label'} htmlFor={d.idPemicu} id={`${d.idPemicu}-label`}>
        {label}
      </label>

      <div className="dp-trigger-wrap">
        <button
          type="button"
          id={d.idPemicu}
          ref={d.pemicuRef}
          className={`sel-trigger ${ukuran === 'sm' ? 'sel-sm' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={d.terbuka}
          aria-controls={d.idPanel}
          aria-labelledby={`${d.idPemicu}-label ${d.idPemicu}`}
          onClick={d.alih}
        >
          <span className="sel-value">
            <CalendarDays size={15} aria-hidden="true" className="dp-icon" />
            {nilai ? <span className="truncate">{tanggalPanjang(nilai)}</span> : <span className="sel-placeholder">{placeholder}</span>}
          </span>
        </button>
        {bisaDikosongkan && nilai ? (
          <button type="button" className="dp-clear" onClick={() => onUbah(null)} aria-label={`Kosongkan ${label}`}>
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {nama ? <input type="hidden" name={nama} value={nilai ?? ''} readOnly /> : null}

      <div
        ref={d.panelRef}
        id={d.idPanel}
        role="dialog"
        aria-label={label}
        aria-modal="false"
        className={`pop pop-anim dp-pop ${jangkar === 'kanan' ? 'pop-right' : 'pop-left'} ${d.masuk ? 'pop-enter' : ''}`}
        hidden={!d.terpasang}
      >
        <div className="pop-anim-inner">
          <div className="dp-body">
            <div className="dp-head">
              <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => gantiBulan(-1)} aria-label="Bulan sebelumnya">
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <span className="dp-title" aria-live="polite">
                {NAMA_BULAN[bulanTampil.m - 1]} {bulanTampil.y}
              </span>
              <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => gantiBulan(1)} aria-label="Bulan berikutnya">
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>

            <table className="dp-grid" role="grid" ref={gridRef} onKeyDown={padaGridKeyDown}>
              <thead>
                <tr>
                  {NAMA_HARI_PENDEK.map((h, i) => (
                    <th key={h} scope="col" abbr={NAMA_HARI[i]}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {minggu.map((baris) => (
                  <tr key={baris[0]}>
                    {baris.map((iso) => {
                      const { m } = parseIso(iso);
                      const luarBulan = m !== bulanTampil.m;
                      const terpilih = iso === nilai;
                      const mati = Boolean(diluarBatas(iso));
                      return (
                        <td key={iso} role="gridcell" aria-selected={terpilih}>
                          <button
                            type="button"
                            data-fokus={iso === fokus}
                            tabIndex={iso === fokus ? 0 : -1}
                            disabled={mati}
                            className={[
                              'dp-day',
                              luarBulan ? 'dp-day-luar' : '',
                              terpilih ? 'dp-day-pilih' : '',
                              iso === HARI_INI ? 'dp-day-ini' : '',
                            ].join(' ')}
                            onClick={() => pilih(iso)}
                            onFocus={() => setFokus(iso)}
                          >
                            <span aria-hidden="true">{parseIso(iso).d}</span>
                            <span className="sr-only">{tanggalPanjang(iso)}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="dp-foot">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => pilih(HARI_INI)}>
                Hari ini
              </button>
              {bisaDikosongkan ? (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { onUbah(null); d.tutup(); }}>
                  Kosongkan
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
