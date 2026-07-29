'use client';

import Link from 'next/link';
import { ArrowDownUp, ArrowDown, ArrowUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/Controls';
import { EmptyState } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from './ItemCard';
import type { AdapterView, KolomTabel, ViewItem } from './types';

export type Kepadatan = 'rapat' | 'normal' | 'longgar';

interface Props<T> {
  baris: T[];
  adapter: AdapterView<T>;
  kolomTampil: string[];
  kepadatan: Kepadatan;
  aksiMassal?: (terpilih: T[], bersihkan: () => void) => React.ReactNode;
}

/**
 * Tabel padat data. Kolom bisa diurutkan, header lengket saat digulir, baris
 * bisa dipilih, dan aksi massal muncul begitu ada yang terpilih.
 *
 * Di bawah 768px tabel berganti menjadi daftar kartu. Kedua bentuk dirender,
 * lalu CSS memilih salah satu, karena lebar viewport tidak diketahui saat
 * static export dibangun dan menebaknya akan membuat markup server dan klien
 * berbeda.
 */
export function TableView<T>({ baris, adapter, kolomTampil, kepadatan, aksiMassal }: Props<T>) {
  const [urutKolom, setUrutKolom] = useState<string | null>(null);
  const [urutArah, setUrutArah] = useState<'naik' | 'turun'>('naik');
  const [terpilih, setTerpilih] = useState<string[]>([]);

  const kolom = useMemo(
    () => adapter.kolom.filter((k) => k.wajib || kolomTampil.includes(k.id)),
    [adapter.kolom, kolomTampil],
  );

  const terurut = useMemo(() => {
    if (!urutKolom) return baris;
    const def = adapter.kolom.find((k) => k.id === urutKolom);
    if (!def?.nilaiUrut) return baris;
    const arah = urutArah === 'naik' ? 1 : -1;
    return [...baris].sort((a, b) => {
      const va = def.nilaiUrut!(a);
      const vb = def.nilaiUrut!(b);
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * arah;
      return String(va).localeCompare(String(vb), 'id') * arah;
    });
  }, [baris, adapter.kolom, urutKolom, urutArah]);

  const semuaTerpilih = terpilih.length > 0 && terpilih.length === baris.length;
  const sebagianTerpilih = terpilih.length > 0 && !semuaTerpilih;

  const alihUrut = (k: KolomTabel<T>) => {
    if (!k.nilaiUrut) return;
    if (urutKolom === k.id) {
      setUrutArah((a) => (a === 'naik' ? 'turun' : 'naik'));
    } else {
      setUrutKolom(k.id);
      setUrutArah('naik');
    }
  };

  const barisTerpilih = baris.filter((b) => terpilih.includes(adapter.kunci(b)));
  const bersihkan = () => setTerpilih([]);

  if (baris.length === 0) {
    return (
      <EmptyState
        ragam="kotak"
        judul={`Belum ada ${adapter.labelItem} yang cocok`}
        penjelasan="Longgarkan penyaring, atau tambahkan item pertama untuk mulai."
      />
    );
  }

  return (
    <div className="tbl-wrap">
      {terpilih.length > 0 ? (
        <div className="tbl-massal" role="region" aria-label="Aksi massal">
          <span className="t-body-strong">{terpilih.length} {adapter.labelItem} terpilih</span>
          <span className="grow" />
          {aksiMassal?.(barisTerpilih, bersihkan)}
          <button type="button" className="btn btn-ghost btn-sm" onClick={bersihkan}>Batal pilih</button>
        </div>
      ) : null}

      {/* Bentuk tabel, dipakai mulai 769px ke atas. */}
      <div className={`tbl-scroll tbl-${kepadatan}`}>
        <table className="tbl">
          <caption className="sr-only">
            Daftar {adapter.labelItem}, {baris.length} baris. Header kolom bisa diklik untuk mengurutkan.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="tbl-pilih">
                <Checkbox
                  checked={semuaTerpilih}
                  sebagian={sebagianTerpilih}
                  onChange={(v) => setTerpilih(v ? baris.map(adapter.kunci) : [])}
                  label="Pilih semua baris"
                  labelTersembunyi
                />
              </th>
              {kolom.map((k) => {
                const aktif = urutKolom === k.id;
                const Ikon = !k.nilaiUrut ? null : aktif ? (urutArah === 'naik' ? ArrowUp : ArrowDown) : ArrowDownUp;
                return (
                  <th
                    key={k.id}
                    scope="col"
                    style={k.lebar ? { width: k.lebar } : undefined}
                    className={k.rata === 'kanan' ? 'ta-kanan' : undefined}
                    aria-sort={aktif ? (urutArah === 'naik' ? 'ascending' : 'descending') : k.nilaiUrut ? 'none' : undefined}
                  >
                    {k.nilaiUrut ? (
                      <button type="button" className="tbl-urut" onClick={() => alihUrut(k)}>
                        <span>{k.judul}</span>
                        {Ikon ? <Ikon size={12} aria-hidden="true" className={aktif ? 'tbl-urut-aktif' : 'tbl-urut-diam'} /> : null}
                      </button>
                    ) : (
                      k.judul
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {terurut.map((b) => {
              const kunci = adapter.kunci(b);
              const dipilih = terpilih.includes(kunci);
              return (
                <tr key={kunci} className={dipilih ? 'tbl-baris-pilih' : undefined}>
                  <td className="tbl-pilih">
                    <Checkbox
                      checked={dipilih}
                      onChange={(v) => setTerpilih((s) => (v ? [...s, kunci] : s.filter((x) => x !== kunci)))}
                      label={`Pilih ${adapter.keItem(b).judul}`}
                      labelTersembunyi
                    />
                  </td>
                  {kolom.map((k) => (
                    <td key={k.id} className={k.rata === 'kanan' ? 'ta-kanan' : undefined}>
                      {k.render(b)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bentuk daftar kartu, dipakai 768px ke bawah. Tabel lebar memaksa
          gulir horizontal di ponsel, dan itu dilarang (R19). */}
      <ul className="tbl-kartu">
        {terurut.map((b) => {
          const i: ViewItem = adapter.keItem(b);
          return (
            <li key={adapter.kunci(b)}>
              <Link href={i.href} className="tbl-kartu-item">
                <span className="tbl-kartu-atas">
                  {i.kode ? <span className="t-mono kb-kode">{i.kode}</span> : null}
                  {i.prioritas ? <TandaPrioritas prioritas={i.prioritas} /> : null}
                </span>
                <span className="item-text">
                  <span className="title">{i.judul}</span>
                  {i.keterangan ? <span className="meta">{i.keterangan}</span> : null}
                </span>
                <span className="tbl-kartu-kaki">
                  <TandaTenggat iso={i.tenggat} />
                  {i.orang ? <span className="tbl-kartu-pj">{i.orang.nama}</span> : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
