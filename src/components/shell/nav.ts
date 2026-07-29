import {
  CalendarRange,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Settings,
  Tags,
  Timer,
  Users,
} from 'lucide-react';

export interface ItemNav {
  href: string;
  label: string;
  ikon: typeof LayoutDashboard;
  /** Cocok persis, dipakai rute induk yang menjadi awalan rute lain. */
  persis?: boolean;
}

export interface KelompokNav {
  judul: string;
  item: ItemNav[];
}

/**
 * Struktur sidebar. Sembilan item, jadi dikelompokkan dengan label seksi
 * sesuai standar aplikasi Himay Studio (kelompokkan bila lebih dari sekitar 7).
 */
export const NAV: KelompokNav[] = [
  {
    judul: 'Pekerjaan',
    item: [
      { href: '/app/', label: 'Dashboard', ikon: LayoutDashboard, persis: true },
      { href: '/app/proyek/', label: 'Proyek', ikon: FolderKanban },
      { href: '/app/tugas/', label: 'Tugas', ikon: ListChecks },
      { href: '/app/sprint/', label: 'Sprint', ikon: CalendarRange },
    ],
  },
  {
    judul: 'Tim',
    item: [
      { href: '/app/tim/', label: 'Tim', ikon: Users },
      { href: '/app/timesheet/', label: 'Timesheet', ikon: Timer },
    ],
  },
  {
    judul: 'Pengaturan',
    item: [
      { href: '/app/pengaturan/', label: 'Workspace', ikon: Settings, persis: true },
      { href: '/app/pengaturan/status/', label: 'Kolom Status', ikon: ClipboardList },
      { href: '/app/pengaturan/label/', label: 'Label', ikon: Tags },
    ],
  },
];

export function judulRute(pathname: string): string {
  const semua = NAV.flatMap((k) => k.item);
  const cocok = semua
    .filter((i) => (i.persis ? pathname === i.href : pathname.startsWith(i.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return cocok?.label ?? 'Derap';
}

export function aktif(item: ItemNav, pathname: string): boolean {
  return item.persis ? pathname === item.href : pathname.startsWith(item.href);
}
