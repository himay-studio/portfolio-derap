import type { Metadata } from 'next';
import { PageHeader } from '@/components/shell/PageHeader';
import { PengaturanNav } from './PengaturanNav';
import { WorkspaceForm } from './WorkspaceForm';

export const metadata: Metadata = {
  title: 'Pengaturan Workspace',
  description: 'Nama workspace, zona waktu, hari kerja, dan preferensi tampilan.',
};

export default function HalamanPengaturan() {
  return (
    <>
      <PageHeader
        judul="Pengaturan"
        keterangan="Pengaturan berlaku untuk seluruh anggota workspace."
      />
      <PengaturanNav />
      <WorkspaceForm />
    </>
  );
}
