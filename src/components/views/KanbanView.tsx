'use client';

import { useCallback, useId, useMemo } from 'react';
import { EmptyState } from '@/components/ui/Primitives';
import { ItemCard } from './ItemCard';
import { useBoardDnd } from './useBoardDnd';
import { WARNA_TONE, type GrupView, type ViewItem } from './types';

interface Props {
  item: ViewItem[];
  grup: GrupView[];
  onPindah?: (itemId: string, keGrup: string, keIndeks: number) => void;
  labelItem: string;
}

/**
 * Papan Kanban.
 *
 * Kolom dibangun dari definisi grup adapter, bukan dari nama status yang
 * ditulis harfiah, jadi kolom status kustom yang diubah di halaman Pengaturan
 * langsung tercermin di sini tanpa satu baris pun perubahan di view.
 */
export function KanbanView({ item, grup, onPindah, labelItem }: Props) {
  const idPetunjuk = useId();

  const perGrup = useMemo(() => {
    const peta = new Map<string, ViewItem[]>();
    grup.forEach((g) => peta.set(g.id, []));
    item.forEach((i) => {
      const daftar = peta.get(i.grup);
      if (daftar) daftar.push(i);
    });
    return peta;
  }, [grup, item]);

  const grupUrut = useMemo(() => grup.map((g) => g.id), [grup]);
  const isiGrup = useCallback(
    (g: string) => (perGrup.get(g) ?? []).map((i) => i.id),
    [perGrup],
  );
  const namaGrup = useCallback(
    (g: string) => grup.find((x) => x.id === g)?.nama ?? g,
    [grup],
  );
  const namaItem = useCallback(
    (id: string) => item.find((i) => i.id === id)?.judul ?? 'Item',
    [item],
  );

  const dnd = useBoardDnd({
    grupUrut,
    isiGrup,
    namaGrup,
    namaItem,
    onPindah: onPindah ?? (() => undefined),
  });

  const bisaPindah = Boolean(onPindah);

  if (item.length === 0) {
    return (
      <EmptyState
        ragam="papan"
        judul={`Belum ada ${labelItem} yang cocok`}
        penjelasan="Longgarkan penyaring, atau tambahkan item pertama untuk mulai."
      />
    );
  }

  return (
    <div className="kb-wrap">
      <p id={idPetunjuk} className="sr-only">
        Tekan Space untuk mengangkat kartu, panah kiri dan kanan untuk berpindah kolom, panah atas dan bawah untuk menggeser posisi, Space lagi untuk meletakkan, Escape untuk membatalkan.
      </p>
      {/* Pengguna pembaca layar tidak melihat kartunya bergerak, jadi setiap
          perpindahan diumumkan di sini. */}
      <p className="sr-only" role="status" aria-live="polite">{dnd.pengumuman}</p>

      <div className="kb-board">
        {grup.map((g) => {
          const isi = perGrup.get(g.id) ?? [];
          const lewatWip = g.batasWip !== null && g.batasWip !== undefined && isi.length > g.batasWip;
          return (
            <section
              key={g.id}
              className={`kb-col ${dnd.targetGrup === g.id ? 'kb-col-target' : ''}`}
              aria-label={`${g.nama}, ${isi.length} ${labelItem}`}
              onDragOver={bisaPindah ? (e) => dnd.padaDragOverGrup(e, g.id) : undefined}
              onDrop={bisaPindah ? (e) => dnd.padaDropGrup(e, g.id) : undefined}
            >
              <header className="kb-col-head">
                <span className="chip-dot kb-dot" style={{ background: WARNA_TONE[g.tone] }} aria-hidden="true" />
                <h3 className="t-h3 grow truncate">{g.nama}</h3>
                <span className={`kb-hitung t-num ${lewatWip ? 'kb-hitung-lebih' : ''}`}>
                  {g.batasWip ? `${isi.length} dari ${g.batasWip}` : isi.length}
                </span>
              </header>

              <ol className="kb-col-list">
                {isi.map((i, idx) => (
                  <li key={i.id}>
                    <ItemCard
                      item={i}
                      idPetunjuk={idPetunjuk}
                      terangkat={dnd.angkat?.itemId === i.id}
                      sedangSeret={dnd.seret === i.id}
                      onKeyDown={bisaPindah ? (e) => dnd.padaKartuKeyDown(e, i.id) : undefined}
                      onDragStart={bisaPindah ? (e) => dnd.padaDragStart(e, i.id) : undefined}
                      onDragEnd={bisaPindah ? dnd.padaDragEnd : undefined}
                      onDragOver={bisaPindah ? (e) => dnd.padaDragOverGrup(e, g.id) : undefined}
                      onDrop={bisaPindah ? (e) => { e.stopPropagation(); dnd.padaDropGrup(e, g.id, idx); } : undefined}
                    />
                  </li>
                ))}
                {isi.length === 0 ? (
                  <li className="kb-col-kosong">Belum ada {labelItem} di kolom ini.</li>
                ) : null}
              </ol>

              {lewatWip ? (
                <p className="kb-wip">Melebihi batas kerja berjalan, {isi.length} dari {g.batasWip}.</p>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
