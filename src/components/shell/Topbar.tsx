'use client';

import Link from 'next/link';
import { Bell, ChevronDown, Menu, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Primitives';
import { useDisclosure } from '@/components/ui/useDisclosure';
import { penggunaSaatIni } from '@/data/team';
import { jatuhTempoDalam, tugasTelat } from '@/lib/derived';
import { GlobalSearch } from './GlobalSearch';
import { judulRute } from './nav';
import { MobileNav } from './MobileNav';

/**
 * Topbar tinggi 56px.
 *
 * Di mobile ini SATU baris flex `space-between` dengan tinggi tetap, tiap anak
 * di slot sendiri, tap target minimal 44 x 44px, dan tidak ada elemen yang
 * bisa bertumpuk (R47 dan R52). Logo muncul tepat satu kali di seluruh layar,
 * yaitu di dalam tirai navigasi, bukan juga di topbar.
 */
export function Topbar() {
  const pathname = usePathname();
  const [navTerbuka, setNavTerbuka] = useState(false);
  const menu = useDisclosure();

  const telat = tugasTelat().length;
  const segera = jatuhTempoDalam(3).length;

  return (
    <>
      <header className="tb">
        <button
          type="button"
          className="tb-hamburger"
          onClick={() => setNavTerbuka(true)}
          aria-label="Buka navigasi"
          aria-expanded={navTerbuka}
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <h2 className="tb-judul t-body-strong truncate">{judulRute(pathname)}</h2>

        <GlobalSearch />

        <span className="grow" />

        <Link href="/app/tugas/" className="btn btn-primary btn-sm tb-tambah">
          <Plus size={15} aria-hidden="true" />
          <span className="tb-tambah-label">Tugas Baru</span>
        </Link>

        <Link href="/app/tugas/" className="tb-lonceng" aria-label={`Notifikasi, ${telat} tugas telat dan ${segera} jatuh tempo dalam 3 hari`}>
          <Bell size={18} aria-hidden="true" />
          {telat > 0 ? <span className="tb-titik t-num" aria-hidden="true">{telat}</span> : null}
        </Link>

        <div className="tb-akun">
          <button
            type="button"
            ref={menu.pemicuRef}
            className="tb-akun-btn"
            aria-expanded={menu.terbuka}
            aria-controls={menu.idPanel}
            aria-haspopup="menu"
            onClick={menu.alih}
          >
            <Avatar inisial={penggunaSaatIni.inisial} warna={penggunaSaatIni.warna} ukuran={32} />
            {/* R50. Nama dan peran adalah dua blok terpisah dengan gap, kalau
                inline keduanya akan terbaca "Rangga PrasetyoManajer Proyek". */}
            <span className="item-text tb-akun-teks">
              <span className="title">{penggunaSaatIni.nama}</span>
              <span className="meta">{penggunaSaatIni.peran}</span>
            </span>
            <ChevronDown size={15} aria-hidden="true" className={`chevron ${menu.terbuka ? 'chevron-open' : ''}`} />
          </button>

          <div
            ref={menu.panelRef}
            id={menu.idPanel}
            role="menu"
            aria-label="Menu akun"
            className={`pop pop-anim pop-right tb-menu ${menu.masuk ? 'pop-enter' : ''}`}
            hidden={!menu.terpasang}
          >
            <div className="pop-anim-inner">
              <ul>
                <li role="none">
                  <Link role="menuitem" href={`/app/tim/${penggunaSaatIni.slug}/`} className="tb-menu-item" onClick={() => menu.tutup(false)}>
                    Profil dan beban kerja
                  </Link>
                </li>
                <li role="none">
                  <Link role="menuitem" href="/app/timesheet/" className="tb-menu-item" onClick={() => menu.tutup(false)}>
                    Catatan jam saya
                  </Link>
                </li>
                <li role="none">
                  <Link role="menuitem" href="/app/pengaturan/" className="tb-menu-item" onClick={() => menu.tutup(false)}>
                    Pengaturan workspace
                  </Link>
                </li>
                <li role="none"><hr className="divider" /></li>
                <li role="none">
                  <Link role="menuitem" href="/" className="tb-menu-item" onClick={() => menu.tutup(false)}>
                    Keluar dari demo
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <MobileNav terbuka={navTerbuka} tutup={() => setNavTerbuka(false)} />
    </>
  );
}
