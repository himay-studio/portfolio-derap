import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tasks, tugasById } from '@/data/tasks';
import { TugasDetailClient } from './TugasDetailClient';

export function generateStaticParams() {
  return tasks.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = tugasById(id);
  if (!t) return { title: 'Tugas tidak ditemukan' };
  return { title: `${t.kode} ${t.judul}`, description: t.deskripsi };
}

/**
 * Server component tipis. Isi dan interaksinya (edit, komentar, ceklis, catat
 * jam) sepenuhnya dipegang `TugasDetailClient`, yang membaca lapisan mutasi
 * demo (`lib/store.tsx`) supaya perubahan dari halaman lain (pratinjau cepat,
 * aksi massal) langsung terlihat di sini juga.
 */
export default async function DetailTugas({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!tugasById(id)) notFound();
  return <TugasDetailClient id={id} />;
}
