'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { site } from '@/data/site';
import { KUNCI, tulisLocal } from '@/lib/storage';
import { NAV, aktif } from './nav';

/**
 * Sidebar kiri permanen. Ini APLIKASI, jadi navigasi utama tidak pernah
 * pindah ke topbar.
 *
 * Keadaan lipat disimpan pada atribut `data-sidebar` di elemen `<html>`, bukan
 * pada state React, dan diset oleh skrip kecil sebelum paint pertama. Kalau
 * dibaca dari localStorage saat render, sidebar akan selalu berkedip lebar
 * dulu lalu menyempit, dan pada static export itu juga membuat markup server
 * berbeda dari klien.
 */
export function Sidebar() {
  const pathname = usePathname();
  const [ciut, setCiut] = useState(false);

  useEffect(() => {
    setCiut(document.documentElement.getAttribute('data-sidebar') === 'collapsed');
  }, []);

  const alih = useCallback(() => {
    setCiut((sebelum) => {
      const berikut = !sebelum;
      document.documentElement.setAttribute('data-sidebar', berikut ? 'collapsed' : 'expanded');
      tulisLocal(KUNCI.sidebar, berikut);
      return berikut;
    });
  }, []);

  return (
    <nav className="sb" aria-label="Navigasi utama">
      <div className="sb-merek">
        <Link href="/app/" className="lockup sb-lockup" aria-label={`${site.nama}, ke Dashboard`}>
          {/* Latar sidebar #0E1524, jadi WAJIB varian knockout putih (R43).
              Varian primary akan berubah jadi blok gelap yang nyaris hilang. */}
          <Image
            src="/mark-derap-knockout.svg"
            alt=""
            width={24}
            height={24}
            className="sb-mark"
            priority
          />
          <span className="lockup-text sb-lockup-text">
            <span className="lockup-name">{site.nama}</span>
            <span className="lockup-tagline">{site.taglinePendek}</span>
          </span>
        </Link>
        <button
          type="button"
          className="sb-alih"
          onClick={alih}
          aria-pressed={ciut}
          title={ciut ? 'Bentangkan sidebar' : 'Lipat sidebar'}
        >
          {ciut ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
          <span className="sr-only">{ciut ? 'Bentangkan sidebar' : 'Lipat sidebar'}</span>
        </button>
      </div>

      <div className="sb-gulir">
        {NAV.map((kelompok) => (
          <div key={kelompok.judul} className="sb-grup">
            <h2 className="sb-grup-judul t-micro">{kelompok.judul}</h2>
            <ul>
              {kelompok.item.map((i) => {
                const Ikon = i.ikon;
                const ini = aktif(i, pathname);
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className={`sb-item ${ini ? 'sb-item-aktif' : ''}`}
                      // Penanda menu aktif TIDAK boleh mengandalkan warna latar
                      // saja. Isian brand plus batang kiri 3px putih plus teks
                      // putih plus aria-current, tiga penanda visual dan satu
                      // penanda semantik.
                      aria-current={ini ? 'page' : undefined}
                      title={i.label}
                    >
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

      <div className="sb-kaki">
        <Link href="/" className="sb-keluar" title="Keluar dari demo">
          <span className="sb-label">Keluar dari demo</span>
          <span className="sb-label-ciut" aria-hidden="true">K</span>
        </Link>
      </div>
    </nav>
  );
}
