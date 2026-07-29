import type { Metadata } from 'next';
import { ProyekClient } from './ProyekClient';

export const metadata: Metadata = {
  title: 'Proyek',
  description: 'Daftar proyek berjalan lengkap dengan kesehatan proyek, progres, pemilik, dan tenggat.',
};

export default function HalamanProyek() {
  return <ProyekClient />;
}
