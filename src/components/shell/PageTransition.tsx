'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * R46. Setiap perpindahan rute beranimasi, 260ms, opacity plus translateY(8px).
 *
 * `key` pada pathname memaksa React memasang ulang subtree, jadi animasi CSS
 * berjalan lagi tiap navigasi. Durasi menjadi 0ms saat
 * `prefers-reduced-motion: reduce`, diatur di globals.css lewat variabel
 * `--dur-slow`, jadi tidak ada logika gerak yang perlu diulang di JavaScript.
 *
 * Animasi ini TIDAK menunda paint pertama dan tidak memblokir interaksi,
 * karena hanya menganimasikan opacity dan transform.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="page-enter" key={pathname}>
      {children}
    </div>
  );
}
