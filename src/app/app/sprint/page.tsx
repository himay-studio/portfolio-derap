import type { Metadata } from 'next';
import { SprintClient } from './SprintClient';

export const metadata: Metadata = {
  title: 'Sprint',
  description: 'Sprint dan milestone berjangka, lengkap dengan sasaran, progres, dan burndown sederhana.',
};

export default function HalamanSprint() {
  return <SprintClient />;
}
