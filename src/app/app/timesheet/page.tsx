import type { Metadata } from 'next';
import { TimesheetClient } from './TimesheetClient';

export const metadata: Metadata = {
  title: 'Timesheet',
  description: 'Catat jam kerja per tugas, dengan rekap per orang dan per proyek.',
};

export default function HalamanTimesheet() {
  return <TimesheetClient />;
}
