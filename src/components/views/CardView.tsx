'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/ui/Primitives';
import { ItemCard, TandaPrioritas, TandaTenggat } from './ItemCard';
import type { ViewItem } from './types';

/** Kisi kartu. Memakai kartu yang sama persis dengan papan Kanban. */
export function CardView({ item, labelItem }: { item: ViewItem[]; labelItem: string }) {
  if (item.length === 0) {
    return (
      <EmptyState
        ragam="kotak"
        judul={`Belum ada ${labelItem} yang cocok`}
        penjelasan="Longgarkan penyaring, atau tambahkan item pertama untuk mulai."
      />
    );
  }
  return (
    <ul className="kartu-grid">
      {item.map((i) => (
        <li key={i.id}>
          <ItemCard item={i} />
        </li>
      ))}
    </ul>
  );
}

/** Daftar padat satu baris per item, untuk membaca cepat tanpa kolom. */
export function ListView({ item, labelItem }: { item: ViewItem[]; labelItem: string }) {
  if (item.length === 0) {
    return (
      <EmptyState
        ragam="garis"
        judul={`Belum ada ${labelItem} yang cocok`}
        penjelasan="Longgarkan penyaring, atau tambahkan item pertama untuk mulai."
      />
    );
  }
  return (
    <ul className="daftar">
      {item.map((i) => (
        <li key={i.id}>
          <Link href={i.href} className="daftar-item">
            {i.kode ? <span className="t-mono kb-kode daftar-kode">{i.kode}</span> : null}
            <span className="item-text grow">
              <span className="title">{i.judul}</span>
              {i.keterangan ? <span className="meta">{i.keterangan}</span> : null}
            </span>
            {i.prioritas ? <TandaPrioritas prioritas={i.prioritas} /> : null}
            <TandaTenggat iso={i.tenggat} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
