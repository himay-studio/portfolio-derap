'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Portal } from '@/components/ui/Portal';
import { site } from '@/data/site';
import { NAV, aktif } from './nav';

/**
 * Tirai navigasi mobile, dipakai di bawah 1025px.
 *
 * R53. Tirai ini di-portal ke `document.body` dan TIDAK PERNAH dirender di
 * dalam `<header>`. Kalau bersarang di header yang memasang `backdrop-filter`,
 * `filter`, atau `transform`, header itu menjadi containing block dan tirai
 * `position: fixed; top: 0; bottom: 0` akan kolaps setinggi header, terbaca
 * sebagai potongan sempit di atas layar lengkap dengan logo kedua. CSS-nya
 * sama persis pada kasus rusak dan kasus benar, jadi verifikasinya harus
 * memakai `getBoundingClientRect()`, bukan membaca stylesheet.
 */
export function MobileNav({ terbuka, tutup }: { terbuka: boolean; tutup: () => void }) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const pathAwal = useRef(pathname);

  // `tutup` disimpan di ref supaya identitas fungsinya, yang berubah tiap
  // render di sisi pemanggil, tidak membongkar pasang jerat fokus di bawah dan
  // melempar fokus keluar tirai tiap render (lihat catatan di Overlay.tsx).
  const tutupRef = useRef(tutup);
  tutupRef.current = tutup;

  // Tutup saat pindah rute, kalau tidak tirai akan menutupi halaman baru.
  useEffect(() => {
    if (pathname !== pathAwal.current) {
      pathAwal.current = pathname;
      tutupRef.current();
    }
  }, [pathname]);

  useEffect(() => {
    if (!terbuka) return;
    let batal = false;

    // Sama seperti Overlay.tsx: isi portal belum ada di DOM pada lintasan
    // pertama, jadi percobaan fokusnya diulang tiap frame sampai wadahnya ada.
    const fokuskan = () => {
      if (batal) return;
      const w = panelRef.current;
      if (!w) { requestAnimationFrame(fokuskan); return; }
      w.querySelector<HTMLElement>('a, button')?.focus();
    };
    fokuskan();

    const padaKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); tutupRef.current(); return; }
      const wadah = panelRef.current;
      if (e.key !== 'Tab' || !wadah) return;
      const bisa = Array.from(wadah.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (bisa.length === 0) return;
      const pertama = bisa[0];
      const terakhir = bisa[bisa.length - 1];
      if (e.shiftKey && document.activeElement === pertama) { e.preventDefault(); terakhir.focus(); }
      else if (!e.shiftKey && document.activeElement === terakhir) { e.preventDefault(); pertama.focus(); }
    };

    document.addEventListener('keydown', padaKeyDown);
    const lama = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      batal = true;
      document.removeEventListener('keydown', padaKeyDown);
      document.body.style.overflow = lama;
    };
  }, [terbuka]);

  if (!terbuka) return null;

  return (
    <Portal>
      <div className="mn" role="presentation">
        <div className="mn-scrim" onClick={tutup} aria-hidden="true" />
        <div className="mn-panel" role="dialog" aria-modal="true" aria-label="Navigasi utama" ref={panelRef}>
          <div className="mn-head">
            <span className="lockup">
              <Image src="/mark-derap-knockout.svg" alt="" width={24} height={24} />
              <span className="lockup-text">
                <span className="lockup-name">{site.nama}</span>
                <span className="lockup-tagline">{site.taglinePendek}</span>
              </span>
            </span>
            <button type="button" className="mn-tutup" onClick={tutup} aria-label="Tutup navigasi">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="mn-gulir">
            {NAV.map((kelompok) => (
              <div key={kelompok.judul} className="sb-grup">
                <h2 className="sb-grup-judul t-micro">{kelompok.judul}</h2>
                <ul>
                  {kelompok.item.map((i) => {
                    const Ikon = i.ikon;
                    const ini = aktif(i, pathname);
                    return (
                      <li key={i.href}>
                        <Link href={i.href} className={`sb-item ${ini ? 'sb-item-aktif' : ''}`} aria-current={ini ? 'page' : undefined}>
                          <span className="sb-bar" aria-hidden="true" />
                          <Ikon size={20} aria-hidden="true" className="sb-ikon" />
                          <span className="sb-label">{i.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mn-kaki">
            <Link href="/" className="sb-keluar">Keluar dari demo</Link>
          </div>
        </div>
      </div>
    </Portal>
  );
}
