'use client';

import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Portal } from './Portal';

const BISA_FOKUS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Jerat fokus plus Escape. Dipakai Modal dan Drawer.
 *
 * `tutup` disimpan di ref dan TIDAK ikut jadi dependensi.
 *
 * Pemanggil hampir selalu menulis `tutup={() => setModal(false)}`, yang berarti
 * fungsinya beridentitas baru tiap render. Kalau identitas itu masuk ke daftar
 * dependensi, efek ini dibongkar pasang tiap render, dan pembersihannya
 * mengembalikan fokus KE LUAR dialog setiap kali. Hasilnya modal yang terlihat
 * sempurna tapi fokusnya tidak pernah benar benar masuk, cacat yang mustahil
 * terlihat di screenshot dan hanya muncul kalau fokusnya diukur.
 */
function useJeratFokus(aktif: boolean, ref: React.RefObject<HTMLElement | null>, tutup: () => void) {
  const tutupRef = useRef(tutup);
  tutupRef.current = tutup;

  useEffect(() => {
    if (!aktif) return;
    const sebelumnya = document.activeElement as HTMLElement | null;
    let batal = false;

    /**
     * Isi portal belum tentu ada di DOM saat efek ini pertama berjalan.
     *
     * `Portal` merender null di lintasan pertamanya, jadi `ref.current` masih
     * null di sini, dan sekali fokusnya gagal dipasang tidak ada lagi yang
     * mencoba, karena dependensi efeknya tidak berubah. Jadi percobaannya
     * diulang tiap frame sampai wadahnya benar benar ada. Ini juga membuat
     * jerat fokus tidak lagi bergantung pada urutan internal `Portal`.
     */
    const fokuskan = () => {
      if (batal) return;
      const wadah = ref.current;
      if (!wadah) { requestAnimationFrame(fokuskan); return; }
      wadah.querySelector<HTMLElement>(BISA_FOKUS)?.focus();
    };
    fokuskan();

    const padaKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); tutupRef.current(); return; }
      const wadah = ref.current;
      if (e.key !== 'Tab' || !wadah) return;
      const bisa = Array.from(wadah.querySelectorAll<HTMLElement>(BISA_FOKUS)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (bisa.length === 0) return;
      const pertama = bisa[0];
      const terakhir = bisa[bisa.length - 1];
      if (e.shiftKey && document.activeElement === pertama) { e.preventDefault(); terakhir.focus(); }
      else if (!e.shiftKey && document.activeElement === terakhir) { e.preventDefault(); pertama.focus(); }
    };

    document.addEventListener('keydown', padaKeyDown);
    const overflowLama = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      batal = true;
      document.removeEventListener('keydown', padaKeyDown);
      document.body.style.overflow = overflowLama;
      sebelumnya?.focus?.();
    };
  }, [aktif, ref]);
}

/**
 * R53. Modal dan Drawer SELALU di-portal ke `document.body`.
 *
 * Kalau overlay ini dirender di dalam `<header>` yang memasang
 * `backdrop-filter`, header itu menjadi containing block dan `position: fixed`
 * akan terpotong setinggi header. Yang membuatnya berbahaya: CSS-nya terbaca
 * benar di kedua keadaan, jadi membaca stylesheet tidak akan pernah
 * membedakan yang rusak dari yang benar. Ukur dengan
 * `getBoundingClientRect()`, bukan dengan membaca CSS.
 *
 * Saat tertutup, komponen ini tidak merender apa apa, jadi tidak ada lapisan
 * tak terlihat yang menjerat klik dan tidak ada kotak yang ikut menghitung
 * layout (R57).
 */
export function Modal({
  terbuka,
  tutup,
  judul,
  keterangan,
  children,
  aksi,
  lebar = 560,
}: {
  terbuka: boolean;
  tutup: () => void;
  judul: string;
  keterangan?: string;
  children: ReactNode;
  aksi?: ReactNode;
  lebar?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useJeratFokus(terbuka, ref, tutup);
  if (!terbuka) return null;

  return (
    <Portal>
      <div className="ovl" role="presentation">
        <div className="ovl-scrim" onClick={tutup} aria-hidden="true" />
        <div
          ref={ref}
          className="ovl-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-judul`}
          aria-describedby={keterangan ? `${id}-ket` : undefined}
          style={{ maxWidth: lebar }}
        >
          <div className="ovl-head">
            {/* R50. Judul dan keterangan dua blok terpisah. */}
            <div className="item-text grow">
              <h2 className="title t-h2" id={`${id}-judul`}>{judul}</h2>
              {keterangan ? <p className="meta" id={`${id}-ket`}>{keterangan}</p> : null}
            </div>
            <button type="button" className="btn btn-ghost btn-icon" onClick={tutup} aria-label="Tutup dialog">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="ovl-body">{children}</div>
          {aksi ? <div className="ovl-foot">{aksi}</div> : null}
        </div>
      </div>
    </Portal>
  );
}

/** Panel geser dari kanan, dipakai detail tugas. Sama sama di-portal (R53). */
export function Drawer({
  terbuka,
  tutup,
  judul,
  keterangan,
  children,
  aksi,
  lebar = 520,
}: {
  terbuka: boolean;
  tutup: () => void;
  judul: string;
  keterangan?: string;
  children: ReactNode;
  aksi?: ReactNode;
  lebar?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useJeratFokus(terbuka, ref, tutup);
  if (!terbuka) return null;

  return (
    <Portal>
      <div className="ovl ovl-kanan" role="presentation">
        <div className="ovl-scrim" onClick={tutup} aria-hidden="true" />
        <div
          ref={ref}
          className="ovl-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-judul`}
          style={{ width: `min(${lebar}px, calc(100vw - 2rem))` }}
        >
          <div className="ovl-head">
            <div className="item-text grow">
              <h2 className="title t-h2" id={`${id}-judul`}>{judul}</h2>
              {keterangan ? <p className="meta">{keterangan}</p> : null}
            </div>
            <button type="button" className="btn btn-ghost btn-icon" onClick={tutup} aria-label="Tutup panel">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <div className="ovl-body">{children}</div>
          {aksi ? <div className="ovl-foot">{aksi}</div> : null}
        </div>
      </div>
    </Portal>
  );
}
