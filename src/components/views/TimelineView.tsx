'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { EmptyState } from '@/components/ui/Primitives';
import {
  HARI_INI,
  NAMA_BULAN_PENDEK,
  hariSejakEpoch,
  indeksHari,
  parseIso,
  rentangTanggal,
  tambahHari,
} from '@/lib/dates';
import { WARNA_TONE, type GrupView, type ViewItem } from './types';

interface Props {
  item: ViewItem[];
  grup: GrupView[];
  labelItem: string;
}

const LEBAR_HARI = 26; // px per hari, cukup untuk penanda tanpa jadi terlalu lebar

/**
 * Timeline Gantt sederhana. Satu baris per item, batang dari tanggal mulai
 * sampai tenggat.
 *
 * Gulir horizontal terjadi DI DALAM wadah ini, bukan pada halaman. Kalau
 * batangnya dibiarkan mendorong lebar dokumen, `scrollWidth` halaman akan
 * melewati `innerWidth` dan itu kegagalan R19 di setiap breakpoint sekaligus.
 */
export function TimelineView({ item, grup, labelItem }: Props) {
  const warnaGrup = useMemo(() => {
    const peta = new Map<string, string>();
    grup.forEach((g) => peta.set(g.id, WARNA_TONE[g.tone]));
    return peta;
  }, [grup]);

  const terurut = useMemo(
    () => [...item].sort((a, b) => a.mulai.localeCompare(b.mulai) || a.tenggat.localeCompare(b.tenggat)),
    [item],
  );

  const jendela = useMemo(() => {
    if (terurut.length === 0) return null;
    let min = terurut[0].mulai;
    let max = terurut[0].tenggat;
    terurut.forEach((i) => {
      if (i.mulai < min) min = i.mulai;
      if (i.tenggat > max) max = i.tenggat;
    });
    // Awali pada hari Senin dan beri margin beberapa hari di kedua ujung.
    const awal = tambahHari(min, -indeksHari(min));
    const akhir = tambahHari(max, 4);
    const hari = hariSejakEpoch(akhir) - hariSejakEpoch(awal) + 1;
    return { awal, akhir, hari };
  }, [terurut]);

  if (!jendela) {
    return (
      <EmptyState
        ragam="garis"
        judul={`Belum ada ${labelItem} untuk ditampilkan di Timeline`}
        penjelasan="Longgarkan penyaring, atau tetapkan tanggal mulai pada item yang ada."
      />
    );
  }

  const kolomTanggal = Array.from({ length: jendela.hari }, (_, i) => tambahHari(jendela.awal, i));
  const lebarTotal = jendela.hari * LEBAR_HARI;
  const offsetHariIni = (hariSejakEpoch(HARI_INI) - hariSejakEpoch(jendela.awal)) * LEBAR_HARI;
  const hariIniDiJendela = HARI_INI >= jendela.awal && HARI_INI <= jendela.akhir;

  // Kelompokkan penanda bulan supaya baris atas tidak jadi deretan angka polos.
  const penandaBulan: { iso: string; label: string; span: number }[] = [];
  kolomTanggal.forEach((iso) => {
    const { y, m } = parseIso(iso);
    const label = `${NAMA_BULAN_PENDEK[m - 1]} ${y}`;
    const terakhir = penandaBulan[penandaBulan.length - 1];
    if (terakhir && terakhir.label === label) terakhir.span += 1;
    else penandaBulan.push({ iso, label, span: 1 });
  });

  return (
    <div className="tl">
      <div className="tl-scroll">
        <div className="tl-inner" style={{ width: lebarTotal + 260 }}>
          <div className="tl-head">
            <div className="tl-label-head t-micro">{labelItem}</div>
            <div className="tl-kanan" style={{ width: lebarTotal }}>
              <div className="tl-bulan">
                {penandaBulan.map((b) => (
                  <span key={b.iso} className="tl-bulan-sel t-micro" style={{ width: b.span * LEBAR_HARI }}>
                    {b.label}
                  </span>
                ))}
              </div>
              <div className="tl-hari">
                {kolomTanggal.map((iso) => {
                  const akhirPekan = indeksHari(iso) >= 5;
                  return (
                    <span
                      key={iso}
                      className={`tl-hari-sel t-num ${akhirPekan ? 'tl-akhir-pekan' : ''} ${iso === HARI_INI ? 'tl-hari-ini' : ''}`}
                      style={{ width: LEBAR_HARI }}
                    >
                      {parseIso(iso).d}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <ul className="tl-baris-list">
            {terurut.map((i) => {
              const mulaiOffset = (hariSejakEpoch(i.mulai) - hariSejakEpoch(jendela.awal)) * LEBAR_HARI;
              const panjang = Math.max(
                LEBAR_HARI,
                (hariSejakEpoch(i.tenggat) - hariSejakEpoch(i.mulai) + 1) * LEBAR_HARI,
              );
              return (
                <li key={i.id} className="tl-baris">
                  <div className="tl-label">
                    <Link href={i.href} className="item-text tl-label-link">
                      <span className="title truncate">{i.judul}</span>
                      {i.keterangan ? <span className="meta truncate">{i.keterangan}</span> : null}
                    </Link>
                  </div>
                  <div className="tl-track" style={{ width: lebarTotal }}>
                    {hariIniDiJendela ? <span className="tl-garis-ini" style={{ left: offsetHariIni }} aria-hidden="true" /> : null}
                    <Link
                      href={i.href}
                      className="tl-bar"
                      style={{
                        left: mulaiOffset,
                        width: panjang,
                        background: warnaGrup.get(i.grup) ?? 'var(--brand)',
                      }}
                      title={`${i.judul}, ${rentangTanggal(i.mulai, i.tenggat)}`}
                    >
                      <span className="sr-only">{i.judul}, {rentangTanggal(i.mulai, i.tenggat)}</span>
                      <span className="tl-bar-teks" aria-hidden="true">{i.judul}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="tl-catatan t-caption text-muted">
        Batang membentang dari tanggal mulai sampai tenggat. Garis tegak menandai hari ini.
      </p>
    </div>
  );
}
