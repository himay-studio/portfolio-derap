import type { Metadata } from 'next';
import { PageHeader } from '@/components/shell/PageHeader';
import { PengaturanNav } from '../PengaturanNav';
import { LabelEditor } from './LabelEditor';

export const metadata: Metadata = {
  title: 'Label',
  description: 'Kelola label yang bisa dipasang pada tugas, lengkap dengan warna dan jumlah pemakaian.',
};

export default function HalamanLabel() {
  return (
    <>
      <PageHeader
        judul="Label"
        keterangan="Label dipakai untuk menyaring tugas lintas proyek. Buat sedikit saja supaya tetap berguna."
      />
      <PengaturanNav />
      <LabelEditor />
    </>
  );
}
