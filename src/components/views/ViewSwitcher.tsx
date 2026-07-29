'use client';

import { CalendarDays, GanttChartSquare, LayoutGrid, List, Rows3, Table2 } from 'lucide-react';
import { LABEL_VIEW, type JenisView } from './types';

const IKON: Record<JenisView, typeof Table2> = {
  kanban: LayoutGrid,
  tabel: Table2,
  kalender: CalendarDays,
  timeline: GanttChartSquare,
  kartu: Rows3,
  daftar: List,
};

/**
 * Pemindah view. Duduk di header halaman, satu kelompok tombol siku
 * bersebelahan, yang aktif memakai isian brand dengan teks putih (8.23:1).
 *
 * Pilihan terakhir disimpan di localStorage oleh `DataViews`, dan berpindah
 * view TIDAK mereset penyaring yang sedang aktif.
 */
export function ViewSwitcher({
  nilai,
  tersedia,
  onUbah,
}: {
  nilai: JenisView;
  tersedia: JenisView[];
  onUbah: (v: JenisView) => void;
}) {
  return (
    <div className="vs" role="group" aria-label="Pilih tampilan">
      {tersedia.map((v) => {
        const Ikon = IKON[v];
        const aktif = v === nilai;
        return (
          <button
            key={v}
            type="button"
            className={`vs-btn ${aktif ? 'vs-btn-aktif' : ''}`}
            aria-pressed={aktif}
            // Di bawah 560px label disembunyikan secara visual supaya kelompok
            // tombol muat di 375px tanpa mendorong lebar dokumen. Ikon tidak
            // pernah berdiri sendiri sebagai satu satunya penanda makna, jadi
            // label tetap ada di DOM untuk pembaca layar dan tooltip.
            title={LABEL_VIEW[v]}
            onClick={() => onUbah(v)}
          >
            <Ikon size={16} aria-hidden="true" />
            <span className="vs-label">{LABEL_VIEW[v]}</span>
          </button>
        );
      })}
    </div>
  );
}
