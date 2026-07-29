'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useCallback, useMemo, type ReactNode } from 'react';
import { Checkbox, SegmentedControl } from '@/components/ui/Controls';
import { useDisclosure } from '@/components/ui/useDisclosure';
import { KUNCI, useStickyState } from '@/lib/storage';
import { CalendarView } from './CalendarView';
import { CardView, ListView } from './CardView';
import { KanbanView } from './KanbanView';
import { TableView, type Kepadatan } from './TableView';
import { TimelineView } from './TimelineView';
import { ViewSwitcher } from './ViewSwitcher';
import type { AdapterView, JenisView, ViewItem } from './types';

interface Props<T> {
  judul: string;
  keterangan?: string;
  adapter: AdapterView<T>;
  baris: T[];
  /** Aksi utama. Dirender di KIRI baris aksi, bukan di pojok kanan atas. */
  aksiUtama?: ReactNode;
  /** Penyaring dan pencarian, menyusul di kanan aksi utama pada baris yang sama. */
  penyaring?: ReactNode;
  aksiMassal?: (terpilih: T[], bersihkan: () => void) => ReactNode;
  /** Ringkasan jumlah, misalnya "47 tugas, 12 telat". */
  ringkasan?: string;
}

type Override = Record<string, { grup: string; urutan: number }>;

/**
 * Satu lapisan view yang dipakai semua modul.
 *
 * Yang dijaga komponen ini:
 * 1. Satu sumber data untuk semua view. Penyaring diterapkan SEBELUM data
 *    masuk ke sini, jadi keempat view selalu memandang himpunan yang sama.
 * 2. Berpindah view tidak mereset penyaring, karena penyaring memang tidak
 *    tinggal di sini.
 * 3. Pilihan view, kepadatan tabel, dan kolom yang tampil bertahan antar
 *    kunjungan lewat localStorage, satu ruang nama per modul.
 */
export function DataViews<T>({
  judul,
  keterangan,
  adapter,
  baris,
  aksiUtama,
  penyaring,
  aksiMassal,
  ringkasan,
}: Props<T>) {
  const [view, setView] = useStickyState<JenisView>(KUNCI.view(adapter.modul), adapter.viewBawaan);
  const [kepadatan, setKepadatan] = useStickyState<Kepadatan>(KUNCI.kepadatan, 'normal');
  const [kolomTampil, setKolomTampil] = useStickyState<string[]>(
    KUNCI.kolom(adapter.modul),
    adapter.kolom.filter((k) => !k.bawaanTersembunyi).map((k) => k.id),
  );
  const [papan, setPapan] = useStickyState<Override>(`${KUNCI.papan}.${adapter.modul}`, {});
  const kolomPop = useDisclosure();

  // Pilihan tersimpan bisa memuat view yang sudah tidak ada lagi di adapter.
  const viewAktif = adapter.viewTersedia.includes(view) ? view : adapter.viewBawaan;

  const item: ViewItem[] = useMemo(() => {
    const dasar = baris.map((b) => adapter.keItem(b));
    if (Object.keys(papan).length === 0) return dasar;
    return dasar
      .map((i) => (papan[i.id] ? { ...i, grup: papan[i.id].grup } : i))
      .sort((a, b) => (papan[a.id]?.urutan ?? 0) - (papan[b.id]?.urutan ?? 0));
  }, [adapter, baris, papan]);

  const isiGrup = useCallback(
    (grup: string) => item.filter((i) => i.grup === grup).map((i) => i.id),
    [item],
  );

  /** Perpindahan Kanban. Menulis ulang urutan KEDUA kolom yang terlibat. */
  const pindah = useCallback(
    (itemId: string, keGrup: string, keIndeks: number) => {
      const sekarang = item.find((i) => i.id === itemId);
      if (!sekarang) return;
      const dariGrup = sekarang.grup;
      const sumber = isiGrup(dariGrup).filter((id) => id !== itemId);
      const tujuan = dariGrup === keGrup ? sumber : isiGrup(keGrup).filter((id) => id !== itemId);
      tujuan.splice(Math.max(0, Math.min(keIndeks, tujuan.length)), 0, itemId);

      setPapan((sebelum) => {
        const berikut: Override = { ...sebelum };
        if (dariGrup !== keGrup) {
          sumber.forEach((id, idx) => { berikut[id] = { grup: dariGrup, urutan: idx }; });
        }
        tujuan.forEach((id, idx) => { berikut[id] = { grup: keGrup, urutan: idx }; });
        return berikut;
      });
    },
    [isiGrup, item, setPapan],
  );

  const bisaAturKolom = viewAktif === 'tabel';

  return (
    <div className="dv">
      {/* Header halaman: judul plus pemindah view. */}
      <header className="dv-head">
        <div className="item-text grow">
          <h1 className="title t-h1">{judul}</h1>
          {keterangan ? <p className="meta t-ui-sm">{keterangan}</p> : null}
        </div>
        <ViewSwitcher nilai={viewAktif} tersedia={adapter.viewTersedia} onUbah={setView} />
      </header>

      {/* Baris aksi. Aksi utama di KIRI, penyaring menyusul di kanannya. */}
      <div className="dv-bar">
        {aksiUtama}
        {penyaring ? <div className="dv-penyaring">{penyaring}</div> : null}
        <span className="grow" />
        {ringkasan ? <span className="dv-ringkas t-caption text-muted">{ringkasan}</span> : null}

        {bisaAturKolom ? (
          <div className="dv-kolom">
            <button
              type="button"
              ref={kolomPop.pemicuRef}
              className="btn btn-secondary btn-sm"
              aria-expanded={kolomPop.terbuka}
              aria-controls={kolomPop.idPanel}
              aria-haspopup="dialog"
              onClick={kolomPop.alih}
            >
              <SlidersHorizontal size={14} aria-hidden="true" />
              <span>Kolom</span>
            </button>
            <div
              ref={kolomPop.panelRef}
              id={kolomPop.idPanel}
              role="dialog"
              aria-label="Pilih kolom yang tampil"
              className={`pop pop-anim pop-right dv-kolom-pop ${kolomPop.masuk ? 'pop-enter' : ''}`}
              hidden={!kolomPop.terpasang}
            >
              <div className="pop-anim-inner">
                <ul className="dv-kolom-list">
                  {adapter.kolom.map((k) => (
                    <li key={k.id}>
                      <Checkbox
                        checked={k.wajib || kolomTampil.includes(k.id)}
                        nonaktif={k.wajib}
                        label={k.judul}
                        onChange={(v) =>
                          setKolomTampil((s) => (v ? [...s, k.id] : s.filter((x) => x !== k.id)))
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {viewAktif === 'tabel' ? (
          <SegmentedControl<Kepadatan>
            label="Kepadatan baris"
            nilai={kepadatan}
            onUbah={setKepadatan}
            opsi={[
              { nilai: 'rapat', label: 'Rapat' },
              { nilai: 'normal', label: 'Normal' },
              { nilai: 'longgar', label: 'Longgar' },
            ]}
          />
        ) : null}
      </div>

      {/* Wilayah view. Kunci `key` memaksa animasi masuk 180ms tiap ganti view. */}
      <div className="dv-area view-enter" key={viewAktif}>
        {viewAktif === 'kanban' ? (
          <KanbanView
            item={item}
            grup={adapter.grup}
            labelItem={adapter.labelItem}
            onPindah={adapter.bisaPindahGrup ? pindah : undefined}
          />
        ) : null}
        {viewAktif === 'tabel' ? (
          <TableView
            baris={baris}
            adapter={adapter}
            kolomTampil={kolomTampil}
            kepadatan={kepadatan}
            aksiMassal={aksiMassal}
          />
        ) : null}
        {viewAktif === 'kalender' ? (
          <CalendarView item={item} grup={adapter.grup} labelItem={adapter.labelItem} />
        ) : null}
        {viewAktif === 'timeline' ? (
          <TimelineView item={item} grup={adapter.grup} labelItem={adapter.labelItem} />
        ) : null}
        {viewAktif === 'kartu' ? <CardView item={item} labelItem={adapter.labelItem} /> : null}
        {viewAktif === 'daftar' ? <ListView item={item} labelItem={adapter.labelItem} /> : null}
      </div>
    </div>
  );
}
