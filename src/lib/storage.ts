'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Semua kunci localStorage aplikasi. Ditulis di satu tempat supaya tidak ada
 * dua modul yang diam diam memakai kunci yang sama.
 */
export const KUNCI = {
  sidebar: 'derap.sidebar.collapsed',
  kepadatan: 'derap.table.density',
  view: (modul: string) => `derap.view.${modul}`,
  kolom: (modul: string) => `derap.columns.${modul}`,
  papan: 'derap.board.moves',
  masuk: 'derap.demo.signed-in',
} as const;

export function bacaLocal<T>(kunci: string, bawaan: T): T {
  if (typeof window === 'undefined') return bawaan;
  try {
    const mentah = window.localStorage.getItem(kunci);
    return mentah === null ? bawaan : (JSON.parse(mentah) as T);
  } catch {
    return bawaan;
  }
}

export function tulisLocal(kunci: string, nilai: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    /* Mode penyamaran atau kuota penuh. Demo tetap jalan tanpa penyimpanan. */
  }
}

/**
 * State yang bertahan antar kunjungan.
 *
 * Static export mengharuskan render pertama identik dengan HTML yang sudah
 * dibangun, jadi nilai tersimpan BARU dibaca setelah mount. Flag `siap`
 * dikembalikan supaya pemanggil bisa menunda animasi sampai nilai asli masuk.
 */
export function useStickyState<T>(kunci: string, bawaan: T) {
  const [nilai, setNilai] = useState<T>(bawaan);
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    setNilai(bacaLocal<T>(kunci, bawaan));
    setSiap(true);
    // Kunci adalah satu satunya ketergantungan yang benar di sini. Nilai bawaan
    // sengaja tidak ikut, supaya perubahan referensi objek tidak memuat ulang.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci]);

  const simpan = useCallback(
    (berikut: T | ((sebelum: T) => T)) => {
      setNilai((sebelum) => {
        const hasil = typeof berikut === 'function' ? (berikut as (s: T) => T)(sebelum) : berikut;
        tulisLocal(kunci, hasil);
        return hasil;
      });
    },
    [kunci],
  );

  return [nilai, simpan, siap] as const;
}

/** Menandai bahwa komponen sudah berjalan di klien. */
export function useMounted(): boolean {
  const [ada, setAda] = useState(false);
  useEffect(() => setAda(true), []);
  return ada;
}
