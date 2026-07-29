'use client';

import { useLayoutEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * R53. Overlay layar penuh WAJIB lewat sini.
 *
 * Elemen apa pun yang memasang `backdrop-filter`, `filter`, `transform`,
 * `perspective`, `contain: paint`, atau `will-change` pada salah satu properti
 * itu menjadi containing block bagi seluruh keturunan `position: fixed`.
 * Overlay yang bersarang di dalam `<header>` semacam itu akan kolaps setinggi
 * header, bukan setinggi viewport, dan CSS-nya terbaca benar di kedua keadaan.
 * Memindahkan overlay ke `document.body` adalah satu satunya perbaikan yang
 * menyentuh sebabnya.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [siap, setSiap] = useState(false);
  /**
   * `useLayoutEffect`, bukan `useEffect`, dan itu penting.
   *
   * Dengan `useEffect`, isi portal baru terpasang SETELAH paint, jadi pada saat
   * jerat fokus milik Modal berjalan, `ref.current` masih null dan fokus tidak
   * pernah pindah ke dalam dialog. Cacat itu tidak kelihatan sama sekali kalau
   * cuma dilihat dengan mata, karena modalnya tampil normal.
   *
   * Komponen ini hanya pernah dirender saat overlay-nya terbuka, dan overlay
   * selalu mulai tertutup, jadi ia tidak pernah ikut dalam pohon SSR dan
   * layout effect ini tidak pernah berjalan di server.
   */
  useLayoutEffect(() => setSiap(true), []);
  if (!siap) return null;
  return createPortal(children, document.body);
}
