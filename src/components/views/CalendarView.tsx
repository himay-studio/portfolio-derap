'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/Primitives';
import {
  HARI_INI,
  NAMA_BULAN,
  NAMA_HARI,
  NAMA_HARI_PENDEK,
  indeksHari,
  parseIso,
  tambahHari,
  tanggalPanjang,
  toIso,
} from '@/lib/dates';
import { WARNA_TONE, type GrupView, type ViewItem } from './types';

interface Props {
  item: ViewItem[];
  grup: GrupView[];
  labelItem: string;
}

/**
 * Kalender berdasarkan tenggat. Grid bulan di layar lebar, daftar agenda di
 * ponsel, karena grid tujuh kolom di 375px membuat sel jadi 45px dan tidak ada
 * satu pun judul yang terbaca.
 */
export function CalendarView({ item, grup, labelItem }: Props) {
  const [bulan, setBulan] = useState(() => {
    const p = parseIso(HARI_INI);
    return { y: p.y, m: p.m };
  });

  const warnaGrup = useMemo(() => {
    const peta = new Map<string, string>();
    grup.forEach((g) => peta.set(g.id, WARNA_TONE[g.tone]));
    return peta;
  }, [grup]);

  const perTanggal = useMemo(() => {
    const peta = new Map<string, ViewItem[]>();
    item.forEach((i) => {
      const daftar = peta.get(i.tenggat);
      if (daftar) daftar.push(i);
      else peta.set(i.tenggat, [i]);
    });
    return peta;
  }, [item]);

  const awalBulan = toIso({ y: bulan.y, m: bulan.m, d: 1 });
  const awalGrid = tambahHari(awalBulan, -indeksHari(awalBulan));
  const minggu: string[][] = [];
  for (let w = 0; w < 6; w += 1) {
    minggu.push(Array.from({ length: 7 }, (_, i) => tambahHari(awalGrid, w * 7 + i)));
  }

  const gantiBulan = (delta: number) => {
    setBulan((b) => {
      const m = b.m + delta;
      const y = b.y + Math.floor((m - 1) / 12);
      return { y, m: ((m - 1) % 12 + 12) % 12 + 1 };
    });
  };

  const agenda = useMemo(
    () => [...item].sort((a, b) => a.tenggat.localeCompare(b.tenggat)),
    [item],
  );

  if (item.length === 0) {
    return (
      <EmptyState
        ragam="kalender"
        judul={`Belum ada ${labelItem} bertenggat`}
        penjelasan="Longgarkan penyaring, atau tetapkan tenggat pada item yang ada."
      />
    );
  }

  return (
    <div className="cal">
      <header className="cal-head">
        <button type="button" className="btn btn-secondary btn-icon btn-sm" onClick={() => gantiBulan(-1)} aria-label="Bulan sebelumnya">
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <h3 className="t-h3 cal-title" aria-live="polite">{NAMA_BULAN[bulan.m - 1]} {bulan.y}</h3>
        <button type="button" className="btn btn-secondary btn-icon btn-sm" onClick={() => gantiBulan(1)} aria-label="Bulan berikutnya">
          <ChevronRight size={16} aria-hidden="true" />
        </button>
        <span className="grow" />
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => { const p = parseIso(HARI_INI); setBulan({ y: p.y, m: p.m }); }}
        >
          Bulan ini
        </button>
      </header>

      {/* Grid bulan, 769px ke atas. */}
      <table className="cal-grid">
        <caption className="sr-only">Kalender {NAMA_BULAN[bulan.m - 1]} {bulan.y}, {labelItem} ditampilkan pada tanggal tenggatnya.</caption>
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
                const { m, d } = parseIso(iso);
                const luar = m !== bulan.m;
                const isi = perTanggal.get(iso) ?? [];
                return (
                  <td key={iso} className={`cal-sel ${luar ? 'cal-sel-luar' : ''} ${iso === HARI_INI ? 'cal-sel-ini' : ''}`}>
                    <span className="cal-tgl t-num">
                      <span aria-hidden="true">{d}</span>
                      <span className="sr-only">{tanggalPanjang(iso)}</span>
                    </span>
                    {isi.length > 0 ? (
                      <ul className="cal-list">
                        {isi.slice(0, 3).map((i) => (
                          <li key={i.id}>
                            <Link href={i.href} className="cal-item">
                              <span className="chip-dot" style={{ background: warnaGrup.get(i.grup) ?? 'var(--brand)' }} aria-hidden="true" />
                              <span className="truncate">{i.judul}</span>
                            </Link>
                          </li>
                        ))}
                        {isi.length > 3 ? <li className="cal-lebih">{isi.length - 3} lainnya</li> : null}
                      </ul>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Agenda, 768px ke bawah. */}
      <ul className="cal-agenda">
        {agenda.map((i) => (
          <li key={i.id}>
            <Link href={i.href} className="cal-agenda-item">
              <span className="cal-agenda-tgl t-mono">{tanggalPanjang(i.tenggat)}</span>
              <span className="item-text">
                <span className="title">{i.judul}</span>
                {i.keterangan ? <span className="meta">{i.keterangan}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
