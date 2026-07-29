import Link from 'next/link';
import { ArrowDown, ArrowUp, CalendarClock, Minus } from 'lucide-react';
import { Avatar, Badge, Progress } from '@/components/ui/Primitives';
import { relatifTenggat, terlambat } from '@/lib/dates';
import type { PrioritasId } from '@/data/types';
import type { ViewItem } from './types';

const IKON_PRIORITAS: Record<PrioritasId, typeof ArrowUp> = {
  tinggi: ArrowUp,
  sedang: Minus,
  rendah: ArrowDown,
};

const KELAS_PRIORITAS: Record<PrioritasId, string> = {
  tinggi: 'prio-tinggi',
  sedang: 'prio-sedang',
  rendah: 'prio-rendah',
};

const NAMA_PRIORITAS: Record<PrioritasId, string> = {
  tinggi: 'Tinggi',
  sedang: 'Sedang',
  rendah: 'Rendah',
};

/**
 * Penanda prioritas TIDAK PERNAH ikon saja. Selalu ikon plus teks, supaya
 * papan tetap terbaca oleh pengguna buta warna (BRAND.md bagian 7).
 */
export function TandaPrioritas({ prioritas }: { prioritas: PrioritasId }) {
  const Ikon = IKON_PRIORITAS[prioritas];
  return (
    <span className={`prio ${KELAS_PRIORITAS[prioritas]}`}>
      <Ikon size={12} aria-hidden="true" />
      <span>{NAMA_PRIORITAS[prioritas]}</span>
    </span>
  );
}

export function TandaTenggat({ iso, ringkas }: { iso: string; ringkas?: boolean }) {
  const telat = terlambat(iso);
  return (
    <span className={`tenggat ${telat ? 'tenggat-telat' : ''}`}>
      {ringkas ? null : <CalendarClock size={12} aria-hidden="true" />}
      <span>{relatifTenggat(iso)}</span>
    </span>
  );
}

/**
 * Kartu bersama, dipakai view Kanban dan view Kartu.
 *
 * Kartu itu sendiri adalah tautan, jadi hanya ada SATU perhentian tab per
 * kartu. Enter membuka detail lewat perilaku bawaan tautan, sedangkan Space
 * diambil alih untuk mengangkat kartu pada papan Kanban.
 */
export function ItemCard({
  item,
  terangkat,
  sedangSeret,
  onKeyDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  idPetunjuk,
}: {
  item: ViewItem;
  terangkat?: boolean;
  sedangSeret?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  idPetunjuk?: string;
}) {
  const bisaGeser = Boolean(onDragStart);
  return (
    <Link
      href={item.href}
      className={`kb-card ${terangkat ? 'kb-card-angkat' : ''} ${sedangSeret ? 'kb-card-seret' : ''}`}
      draggable={bisaGeser || undefined}
      aria-roledescription={bisaGeser ? 'Kartu yang bisa dipindahkan' : undefined}
      aria-describedby={bisaGeser ? idPetunjuk : undefined}
      aria-grabbed={bisaGeser ? Boolean(terangkat) : undefined}
      onKeyDown={onKeyDown}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <span className="kb-card-atas">
        {item.kode ? <span className="t-mono kb-kode">{item.kode}</span> : null}
        {item.prioritas ? <TandaPrioritas prioritas={item.prioritas} /> : null}
      </span>

      {/* R50. Judul dan keterangan dua blok terpisah dengan gap, tidak pernah
          dua node teks inline yang akan menempel jadi satu baris. */}
      <span className="item-text kb-card-teks">
        <span className="title kb-judul">{item.judul}</span>
        {item.keterangan ? <span className="meta">{item.keterangan}</span> : null}
      </span>

      {item.chips && item.chips.length > 0 ? (
        <span className="kb-chips">
          {item.chips.map((c) => (
            <span key={c.teks} className="chip">
              {c.warna ? <span className="chip-dot" style={{ background: c.warna }} aria-hidden="true" /> : null}
              {c.teks}
            </span>
          ))}
        </span>
      ) : null}

      {typeof item.progres === 'number' ? (
        <Progress nilai={item.progres} label={`Progres ${item.judul}`} />
      ) : null}

      <span className="kb-card-kaki">
        <TandaTenggat iso={item.tenggat} />
        <span className="kb-kaki-kanan">
          {item.metrik?.map((m) => (
            <span key={m.label} className="kb-metrik t-mono" title={m.label}>
              {m.nilai}
            </span>
          ))}
          {item.orang ? (
            <Avatar inisial={item.orang.inisial} warna={item.orang.warna} ukuran={24} nama={item.orang.nama} />
          ) : (
            <span className="kb-tanpa-pj">Belum ada PJ</span>
          )}
        </span>
      </span>

      {item.badge ? (
        <span className="kb-card-badge">
          <Badge tone={item.badge.tone} pekat={item.badge.pekat}>{item.badge.teks}</Badge>
        </span>
      ) : null}
    </Link>
  );
}
