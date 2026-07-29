import type { Metadata } from 'next';
import { TugasClient } from './TugasClient';

export const metadata: Metadata = {
  title: 'Tugas',
  description: 'Semua tugas dalam empat view setara, Kanban, Tabel, Kalender, dan Timeline.',
};

export default function HalamanTugas() {
  return <TugasClient />;
}
