import type { ReactNode } from 'react';
import type { PrioritasId, Tone } from '@/data/types';

/**
 * Lapisan view bersama.
 *
 * SATU sumber data, beberapa cara memandang. Kanban, Tabel, Kalender, dan
 * Timeline TIDAK boleh menjadi empat implementasi terpisah yang kebetulan
 * mirip, karena begitu bercabang, penyaring dan urutan akan berbeda beda per
 * view dan tidak ada satu pun yang bisa dipercaya.
 *
 * Kontraknya: setiap modul menyediakan satu `AdapterView` yang menerjemahkan
 * barisnya sendiri menjadi `ViewItem` netral, ditambah definisi kolom tabel dan
 * definisi grup Kanban. Semua renderer view hanya tahu `ViewItem`.
 */

export type JenisView = 'kanban' | 'tabel' | 'kalender' | 'timeline' | 'kartu' | 'daftar';

export interface OrangRingkas {
  id: string;
  nama: string;
  inisial: string;
  warna: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ViewItem {
  id: string;
  /** Kode produk, dirender mono. Boleh kosong untuk modul yang tidak punya. */
  kode?: string;
  judul: string;
  /** Label sekunder. Selalu dirender sebagai blok terpisah (R50). */
  keterangan?: string;
  /** Kunci grup, yaitu kolom Kanban. */
  grup: string;
  /** Dipakai Timeline. */
  mulai: string;
  /** Dipakai Kalender dan perhitungan telat. */
  tenggat: string;
  href: string;
  badge?: { teks: string; tone: Tone; pekat?: boolean };
  prioritas?: PrioritasId;
  orang?: OrangRingkas | null;
  chips?: { teks: string; warna?: string }[];
  progres?: number;
  /** Metrik kecil di kaki kartu, misalnya jam tercatat dibanding estimasi. */
  metrik?: { label: string; nilai: string }[];
}

export interface KolomTabel<T> {
  id: string;
  judul: string;
  lebar?: number;
  rata?: 'kiri' | 'kanan';
  /** Kolom wajib tidak bisa disembunyikan lewat pemilih kolom. */
  wajib?: boolean;
  /** Tersembunyi secara bawaan, pengguna bisa memunculkannya. */
  bawaanTersembunyi?: boolean;
  render: (baris: T) => ReactNode;
  nilaiUrut?: (baris: T) => string | number;
}

export interface GrupView {
  id: string;
  nama: string;
  tone: Tone;
  batasWip?: number | null;
}

export interface AdapterView<T> {
  /** Ruang nama localStorage untuk pilihan view, kolom, dan kepadatan. */
  modul: string;
  /** Kata benda tunggal, dipakai di keadaan kosong dan pengumuman pembaca layar. */
  labelItem: string;
  kunci: (baris: T) => string;
  keItem: (baris: T) => ViewItem;
  kolom: KolomTabel<T>[];
  grup: GrupView[];
  viewTersedia: JenisView[];
  viewBawaan: JenisView;
  /** Kanban hanya bisa memindahkan item kalau modulnya memang punya makna itu. */
  bisaPindahGrup?: boolean;
}

export const LABEL_VIEW: Record<JenisView, string> = {
  kanban: 'Kanban',
  tabel: 'Tabel',
  kalender: 'Kalender',
  timeline: 'Timeline',
  kartu: 'Kartu',
  daftar: 'Daftar',
};

export const KELAS_TONE_LEMBUT: Record<Tone, string> = {
  neutral: 'badge-neutral',
  brand: 'badge-brand',
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
};

/** Warna titik penanda grup. Dipakai kolom Kanban dan penyaring status. */
export const WARNA_TONE: Record<Tone, string> = {
  neutral: 'var(--text-subtle)',
  brand: 'var(--brand)',
  info: 'var(--info)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
};
