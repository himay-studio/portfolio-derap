'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

export function gerakDikurangi(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const DURASI_PANEL = 180; // sama dengan --dur di DESIGN.md

/**
 * Satu mesin buka tutup untuk seluruh lapisan mengambang: dropdown, date
 * picker, menu konteks, popover.
 *
 * Dua aturan yang dijaga di sini, keduanya pernah menjadi kegagalan build:
 *
 * R60. `terbuka` adalah SATU SATUNYA sumber kebenaran. Nilai yang sama dipakai
 * untuk `aria-expanded` dan untuk kondisi tampil panel, jadi keduanya tidak
 * mungkin berbeda. Pemicu juga hanya memakai `onClick`, tidak pernah `onFocus`
 * pembuka bersama `onClick` toggler di elemen yang sama, karena klik sungguhan
 * memicu fokus lebih dulu lalu klik langsung membatalkannya.
 *
 * R57. Saat tertutup penuh, panel diberi atribut `hidden` sehingga
 * `display: none` berlaku dan panel berhenti memakan layout. Panel yang cuma
 * `opacity: 0` tetap menyumbang lebar ke `document.documentElement.scrollWidth`
 * dan bisa menyebabkan overflow horizontal yang tidak terlihat di screenshot
 * mana pun, karena keadaan yang rusak justru keadaan yang tak terlihat.
 */
export function useDisclosure(options?: { onTutup?: () => void }) {
  const [terbuka, setTerbuka] = useState(false);
  const [terpasang, setTerpasang] = useState(false);
  const [masuk, setMasuk] = useState(true); // true berarti masih di posisi awal animasi
  const pemicuRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const bersihkanTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    bersihkanTimer();
    if (terbuka) {
      setTerpasang(true);
      const raf = requestAnimationFrame(() => setMasuk(false));
      return () => cancelAnimationFrame(raf);
    }
    setMasuk(true);
    const jeda = gerakDikurangi() ? 0 : DURASI_PANEL;
    timerRef.current = setTimeout(() => setTerpasang(false), jeda);
    return bersihkanTimer;
  }, [terbuka]);

  useEffect(() => bersihkanTimer, []);

  /**
   * R16.1 dan R57. Menjangkar panel ke tepi pemicunya saja TIDAK cukup.
   *
   * Panel yang dijangkar `left: 0` pada pemicu yang kebetulan duduk di ujung
   * kanan baris penyaring akan tembus keluar jendela, dan `max-width` tidak
   * menolongnya karena panelnya memang lebih sempit dari viewport, cuma salah
   * posisi. Jadi posisinya diukur setelah panel tampil, lalu digeser secukupnya
   * supaya kedua tepinya tetap di dalam jendela dengan margin 8px.
   *
   * Diukur, bukan ditebak dari CSS, karena posisi pemicu tergantung pembungkus
   * yang membungkusnya dan itu berbeda beda per halaman.
   */
  useLayoutEffect(() => {
    if (!terpasang || masuk) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Digeser dengan translateX, bukan margin, karena panel bisa dijangkar
    // `left: 0` maupun `right: 0` dan margin bekerja berbeda di antara
    // keduanya. Panel tidak punya keturunan `position: fixed`, jadi containing
    // block baru yang dibuat transform tidak menimbulkan masalah R53.
    panel.style.transform = 'none';
    const kotak = panel.getBoundingClientRect();
    const layar = document.documentElement.clientWidth;
    const MARGIN = 8;

    let geser = 0;
    if (kotak.right > layar - MARGIN) geser = layar - MARGIN - kotak.right;
    if (kotak.left + geser < MARGIN) geser = MARGIN - kotak.left;
    panel.style.transform = geser === 0 ? 'none' : `translateX(${Math.round(geser)}px)`;
  }, [terpasang, masuk]);

  const tutup = useCallback(
    (kembalikanFokus = true) => {
      setTerbuka((sebelum) => {
        if (sebelum) options?.onTutup?.();
        return false;
      });
      if (kembalikanFokus) pemicuRef.current?.focus();
    },
    [options],
  );

  const buka = useCallback(() => setTerbuka(true), []);
  const alih = useCallback(() => setTerbuka((s) => !s), []);

  // Escape dan klik di luar. Dipasang hanya saat terbuka supaya tidak ada
  // pendengar global yang menganggur.
  useEffect(() => {
    if (!terbuka) return;

    const padaKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        tutup();
      }
    };
    const padaPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (pemicuRef.current?.contains(target)) return;
      tutup(false);
    };

    document.addEventListener('keydown', padaKeyDown, true);
    document.addEventListener('pointerdown', padaPointerDown, true);
    return () => {
      document.removeEventListener('keydown', padaKeyDown, true);
      document.removeEventListener('pointerdown', padaPointerDown, true);
    };
  }, [terbuka, tutup]);

  return {
    terbuka,
    /** Panel masih perlu ada di DOM, entah untuk animasi masuk atau keluar. */
    terpasang,
    /** Kelas animasi awal, dilepas satu frame setelah panel terpasang. */
    masuk,
    buka,
    tutup,
    alih,
    pemicuRef,
    panelRef,
    idPanel: `panel-${id}`,
    idPemicu: `pemicu-${id}`,
  };
}
