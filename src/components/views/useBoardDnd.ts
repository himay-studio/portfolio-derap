'use client';

import { useCallback, useRef, useState } from 'react';

export interface PosisiPapan {
  itemId: string;
  grup: string;
  indeks: number;
}

interface Opsi {
  /** Urutan grup dari kiri ke kanan, dipakai perpindahan dengan panah. */
  grupUrut: string[];
  /** Isi tiap grup, sudah terurut. */
  isiGrup: (grup: string) => string[];
  onPindah: (itemId: string, keGrup: string, keIndeks: number) => void;
  namaGrup: (grup: string) => string;
  namaItem: (itemId: string) => string;
}

/**
 * Drag and drop papan Kanban, jalur tetikus dan jalur papan ketik sekaligus.
 *
 * Jalur papan ketik BUKAN tambahan yang bisa ditempel belakangan. Kalau
 * strukturnya tidak menyediakan pintu masuknya sejak awal, satu satunya cara
 * menambahkannya nanti adalah membongkar markup papan, dan itu masalah
 * arsitektur, bukan masalah tahap implementasi.
 *
 * Kontrak papan ketik pada kartu yang sedang fokus:
 *   Space atau Enter  angkat kartu, dan tekan lagi untuk meletakkan
 *   Panah kiri kanan  pindah antar kolom saat kartu terangkat
 *   Panah atas bawah  geser posisi di dalam kolom saat kartu terangkat
 *   Escape            batalkan, kartu kembali ke posisi semula
 *
 * Setiap perubahan diumumkan lewat wilayah `aria-live` yang disediakan
 * `pengumuman`, karena pengguna pembaca layar tidak melihat kartunya bergerak.
 */
export function useBoardDnd({ grupUrut, isiGrup, onPindah, namaGrup, namaItem }: Opsi) {
  const [angkat, setAngkat] = useState<PosisiPapan | null>(null);
  const [seret, setSeret] = useState<string | null>(null);
  const [targetGrup, setTargetGrup] = useState<string | null>(null);
  const [pengumuman, setPengumuman] = useState('');
  const asal = useRef<PosisiPapan | null>(null);

  const posisi = useCallback(
    (itemId: string): PosisiPapan | null => {
      for (const g of grupUrut) {
        const i = isiGrup(g).indexOf(itemId);
        if (i >= 0) return { itemId, grup: g, indeks: i };
      }
      return null;
    },
    [grupUrut, isiGrup],
  );

  /* ------------------------------ papan ketik ----------------------------- */

  const padaKartuKeyDown = useCallback(
    (e: React.KeyboardEvent, itemId: string) => {
      const terangkat = angkat?.itemId === itemId;

      if (e.key === ' ' || e.key === 'Enter') {
        // Enter pada kartu yang tidak terangkat tetap membuka detail lewat
        // tautan di dalamnya, jadi hanya Space yang mengangkat.
        if (!terangkat && e.key === 'Enter') return;
        e.preventDefault();
        if (terangkat) {
          setAngkat(null);
          asal.current = null;
          setPengumuman(`${namaItem(itemId)} diletakkan di kolom ${namaGrup(posisi(itemId)?.grup ?? '')}.`);
          return;
        }
        const p = posisi(itemId);
        if (!p) return;
        asal.current = p;
        setAngkat(p);
        setPengumuman(
          `${namaItem(itemId)} terangkat dari kolom ${namaGrup(p.grup)}, posisi ${p.indeks + 1}. Pakai panah untuk memindahkan, Space untuk meletakkan, Escape untuk membatalkan.`,
        );
        return;
      }

      if (!terangkat) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        const a = asal.current;
        if (a) onPindah(itemId, a.grup, a.indeks);
        setAngkat(null);
        asal.current = null;
        setPengumuman(`Perpindahan dibatalkan. ${namaItem(itemId)} kembali ke tempat semula.`);
        return;
      }

      const p = posisi(itemId);
      if (!p) return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const arah = e.key === 'ArrowRight' ? 1 : -1;
        const i = grupUrut.indexOf(p.grup) + arah;
        if (i < 0 || i >= grupUrut.length) return;
        const grupBaru = grupUrut[i];
        const indeksBaru = Math.min(p.indeks, isiGrup(grupBaru).length);
        onPindah(itemId, grupBaru, indeksBaru);
        setAngkat({ itemId, grup: grupBaru, indeks: indeksBaru });
        setPengumuman(`Pindah ke kolom ${namaGrup(grupBaru)}, posisi ${indeksBaru + 1} dari ${isiGrup(grupBaru).length + 1}.`);
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const arah = e.key === 'ArrowDown' ? 1 : -1;
        const indeksBaru = p.indeks + arah;
        const isi = isiGrup(p.grup);
        if (indeksBaru < 0 || indeksBaru >= isi.length) return;
        onPindah(itemId, p.grup, indeksBaru);
        setAngkat({ itemId, grup: p.grup, indeks: indeksBaru });
        setPengumuman(`Posisi ${indeksBaru + 1} dari ${isi.length} di kolom ${namaGrup(p.grup)}.`);
      }
    },
    [angkat, grupUrut, isiGrup, namaGrup, namaItem, onPindah, posisi],
  );

  /* -------------------------------- tetikus -------------------------------- */

  const padaDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setSeret(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  }, []);

  const padaDragEnd = useCallback(() => {
    setSeret(null);
    setTargetGrup(null);
  }, []);

  const padaDragOverGrup = useCallback((e: React.DragEvent, grup: string) => {
    if (!seret) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setTargetGrup(grup);
  }, [seret]);

  const padaDropGrup = useCallback(
    (e: React.DragEvent, grup: string, indeks?: number) => {
      e.preventDefault();
      const itemId = seret ?? e.dataTransfer.getData('text/plain');
      if (!itemId) return;
      const isi = isiGrup(grup).filter((id) => id !== itemId);
      onPindah(itemId, grup, indeks === undefined ? isi.length : Math.min(indeks, isi.length));
      setPengumuman(`${namaItem(itemId)} dipindahkan ke kolom ${namaGrup(grup)}.`);
      setSeret(null);
      setTargetGrup(null);
    },
    [isiGrup, namaGrup, namaItem, onPindah, seret],
  );

  return {
    angkat,
    seret,
    targetGrup,
    pengumuman,
    padaKartuKeyDown,
    padaDragStart,
    padaDragEnd,
    padaDragOverGrup,
    padaDropGrup,
  };
}
