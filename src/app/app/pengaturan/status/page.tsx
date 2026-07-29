import type { Metadata } from 'next';
import { PageHeader } from '@/components/shell/PageHeader';
import { PengaturanNav } from '../PengaturanNav';
import { StatusEditor } from './StatusEditor';

export const metadata: Metadata = {
  title: 'Kolom Status',
  description: 'Susun kolom status kustom yang dipakai papan Kanban dan seluruh view.',
};

export default function HalamanStatus() {
  return (
    <>
      <PageHeader
        judul="Kolom Status"
        keterangan="Kolom di sini yang membentuk papan Kanban, badge status di tabel, dan warna di kalender serta timeline."
      />
      <PengaturanNav />
      <StatusEditor />
    </>
  );
}
