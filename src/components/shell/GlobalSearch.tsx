'use client';

import { Search } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Avatar, Badge } from '@/components/ui/Primitives';
import { TugasQuickView } from '@/components/tugas/TugasQuickView';
import { proyekById } from '@/data/projects';
import { team } from '@/data/team';
import { statusById } from '@/data/taxonomy';
import { useDataStore } from '@/lib/store';

interface Hasil {
  jenis: 'tugas' | 'proyek' | 'sprint' | 'anggota';
  id: string;
  judul: string;
  keterangan: string;
  href: string;
  inisial?: string;
  warna?: 1 | 2 | 3 | 4 | 5 | 6;
}

const LABEL_JENIS: Record<Hasil['jenis'], string> = {
  tugas: 'Tugas', proyek: 'Proyek', sprint: 'Sprint', anggota: 'Anggota',
};

/**
 * Pencarian global topbar. Digabung dari empat modul sekaligus, dikelompokkan
 * per jenis, navigasi papan ketik penuh (ArrowUp dan ArrowDown, Enter,
 * Escape). Hasil Tugas membuka panel pratinjau, bukan pindah halaman,
 * supaya tugas baru hasil demo (belum punya halaman statis sendiri, R59)
 * tetap bisa dibuka dari sini.
 */
export function GlobalSearch() {
  const store = useDataStore();
  const [q, setQ] = useState('');
  const [terbuka, setTerbuka] = useState(false);
  const [sorot, setSorot] = useState(0);
  const [pratinjauId, setPratinjauId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const idKotak = useId();
  const idPanel = useId();

  useEffect(() => {
    if (!terbuka) return;
    const padaKlik = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setTerbuka(false);
    };
    document.addEventListener('pointerdown', padaKlik, true);
    return () => document.removeEventListener('pointerdown', padaKlik, true);
  }, [terbuka]);

  const hasil = useMemo<Hasil[]>(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 1) return [];
    const out: Hasil[] = [];

    store.tasks.forEach((t) => {
      if (`${t.kode} ${t.judul}`.toLowerCase().includes(query)) {
        const p = proyekById(t.proyekId);
        out.push({
          jenis: 'tugas', id: t.id, judul: t.judul,
          keterangan: `${t.kode}, ${statusById(t.statusId)?.nama ?? ''}${p ? `, ${p.nama}` : ''}`,
          href: `/app/tugas/${t.id}/`,
        });
      }
    });
    store.projects.forEach((p) => {
      if (`${p.kode} ${p.nama} ${p.klien}`.toLowerCase().includes(query)) {
        out.push({
          jenis: 'proyek', id: p.id, judul: p.nama, keterangan: p.klien,
          href: store.isProyekBaru(p.id) ? '/app/proyek/' : `/app/proyek/${p.slug}/`,
        });
      }
    });
    store.sprints.forEach((s) => {
      if (s.nama.toLowerCase().includes(query)) {
        const p = proyekById(s.proyekId);
        out.push({
          jenis: 'sprint', id: s.id, judul: s.nama, keterangan: p?.nama ?? 'Tanpa proyek',
          href: store.isSprintBaru(s.id) ? '/app/sprint/' : `/app/sprint/${s.slug}/`,
        });
      }
    });
    team.forEach((a) => {
      if (`${a.nama} ${a.peran}`.toLowerCase().includes(query)) {
        out.push({
          jenis: 'anggota', id: a.id, judul: a.nama, keterangan: a.peran,
          href: `/app/tim/${a.slug}/`, inisial: a.inisial, warna: a.warna,
        });
      }
    });

    return out.slice(0, 18);
  }, [q, store]);

  useEffect(() => setSorot(0), [q]);

  const pilih = (h: Hasil) => {
    setTerbuka(false);
    setQ('');
    if (h.jenis === 'tugas') { setPratinjauId(h.id); return; }
    window.location.assign(h.href);
  };

  const padaKeyDown = (e: React.KeyboardEvent) => {
    if (!terbuka || hasil.length === 0) {
      if (e.key === 'Escape') setTerbuka(false);
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSorot((s) => (s + 1) % hasil.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSorot((s) => (s - 1 + hasil.length) % hasil.length); }
    else if (e.key === 'Enter') { e.preventDefault(); pilih(hasil[sorot]); }
    else if (e.key === 'Escape') { e.preventDefault(); setTerbuka(false); }
  };

  return (
    <div className="tb-cari" ref={wrapRef}>
      <span className="search-wrap">
        <label className="sr-only" htmlFor={idKotak}>Cari tugas, proyek, sprint, atau anggota</label>
        <Search size={15} aria-hidden="true" className="search-icon" />
        <input
          id={idKotak}
          type="search"
          className="input input-search"
          role="combobox"
          aria-expanded={terbuka && hasil.length > 0}
          aria-controls={idPanel}
          aria-autocomplete="list"
          aria-activedescendant={terbuka && hasil[sorot] ? `${idPanel}-o${sorot}` : undefined}
          value={q}
          placeholder="Cari tugas atau proyek"
          onChange={(e) => { setQ(e.target.value); setTerbuka(true); }}
          onFocus={() => { if (q) setTerbuka(true); }}
          onKeyDown={padaKeyDown}
        />
      </span>

      {terbuka && hasil.length > 0 ? (
        <div id={idPanel} role="listbox" aria-label="Hasil pencarian" className="pop pop-left tb-cari-pop">
          <ul className="sel-list">
            {hasil.map((h, i) => (
              <li
                key={`${h.jenis}-${h.id}`}
                id={`${idPanel}-o${i}`}
                role="option"
                aria-selected={i === sorot}
                className={`sel-opt ${i === sorot ? 'sel-opt-sorot' : ''}`}
                onPointerDown={(e) => { e.preventDefault(); pilih(h); }}
                onPointerEnter={() => setSorot(i)}
              >
                {h.jenis === 'anggota' && h.inisial && h.warna ? (
                  <Avatar inisial={h.inisial} warna={h.warna} ukuran={24} />
                ) : (
                  <Badge tone="neutral">{LABEL_JENIS[h.jenis]}</Badge>
                )}
                <span className="item-text grow">
                  <span className="title">{h.judul}</span>
                  <span className="meta">{h.keterangan}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : terbuka && q.trim().length > 0 ? (
        <div id={idPanel} className="pop pop-left tb-cari-pop">
          <p className="t-caption text-muted" style={{ padding: 'var(--sp-3)' }}>Tidak ada hasil untuk &quot;{q}&quot;.</p>
        </div>
      ) : null}

      <TugasQuickView tugasId={pratinjauId} terbuka={pratinjauId !== null} tutup={() => setPratinjauId(null)} />
    </div>
  );
}
