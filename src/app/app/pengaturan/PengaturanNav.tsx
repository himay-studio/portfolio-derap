'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TAB = [
  { href: '/app/pengaturan/', label: 'Workspace', persis: true },
  { href: '/app/pengaturan/status/', label: 'Kolom Status' },
  { href: '/app/pengaturan/label/', label: 'Label' },
];

/** Tab pengaturan. Rute terpisah, bukan tab semu, supaya tiap layar punya
    alamatnya sendiri dan bisa dicrawl (R59). */
export function PengaturanNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Bagian pengaturan" className="seg" style={{ marginBottom: 'var(--sp-5)' }}>
      {TAB.map((t) => {
        const aktif = t.persis ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`seg-btn ${aktif ? 'seg-btn-aktif' : ''}`}
            aria-current={aktif ? 'page' : undefined}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
