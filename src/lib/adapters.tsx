import Link from 'next/link';
import { Avatar, AvatarStack, Badge, Progress } from '@/components/ui/Primitives';
import { TandaPrioritas, TandaTenggat } from '@/components/views/ItemCard';
import type { AdapterView } from '@/components/views/types';
import { projects, proyekById } from '@/data/projects';
import { sprintById, sprints } from '@/data/sprints';
import { anggotaById, team } from '@/data/team';
import { labelById, prioritasById, statusById, statusUrut } from '@/data/taxonomy';
import type { Proyek, Sprint, Tugas } from '@/data/types';
import { rentangTanggal, tanggalPendek } from './dates';
import {
  LABEL_KESEHATAN,
  TONE_KESEHATAN,
  jamTercatatProyek,
  kesehatanProyek,
  progresPersen,
  tugasProyek,
  tugasSprint,
} from './derived';
import { jam } from './format';

/**
 * Adapter menerjemahkan baris milik satu modul menjadi `ViewItem` netral plus
 * definisi kolom dan grup. Renderer view TIDAK PERNAH tahu bentuk asli data,
 * jadi menambah view baru cukup sekali di lapisan view, bukan sekali per modul.
 */

const orangRingkas = (id: string | null) => {
  const a = anggotaById(id);
  return a ? { id: a.id, nama: a.nama, inisial: a.inisial, warna: a.warna } : null;
};

/* -------------------------------------------------------------------------- */
/* Tugas. Modul yang paling menuntut, empat view setara.                      */
/* -------------------------------------------------------------------------- */

export const adapterTugas: AdapterView<Tugas> = {
  modul: 'tugas',
  labelItem: 'tugas',
  viewTersedia: ['kanban', 'tabel', 'kalender', 'timeline'],
  viewBawaan: 'kanban',
  bisaPindahGrup: true,
  kunci: (t) => t.id,
  grup: statusUrut.map((s) => ({ id: s.id, nama: s.nama, tone: s.tone, batasWip: s.batasWip })),
  keItem: (t) => {
    const p = proyekById(t.proyekId);
    const s = statusById(t.statusId);
    return {
      id: t.id,
      kode: t.kode,
      judul: t.judul,
      keterangan: p ? `${p.nama}, ${p.klien}` : undefined,
      grup: t.statusId,
      mulai: t.mulai,
      tenggat: t.tenggat,
      href: `/app/tugas/${t.id}/`,
      prioritas: t.prioritas,
      orang: orangRingkas(t.penanggungJawabId),
      chips: t.labelIds.map((id) => ({ teks: labelById(id)?.nama ?? id })),
      badge: s && t.statusId === 'blokir' ? { teks: s.nama, tone: 'danger', pekat: true } : undefined,
      metrik: [{ label: 'Jam tercatat dibanding estimasi', nilai: `${jam(t.jamTercatat)} / ${jam(t.estimasiJam)}` }],
    };
  },
  kolom: [
    {
      id: 'kode',
      judul: 'Kode',
      lebar: 92,
      wajib: true,
      nilaiUrut: (t) => t.kode,
      render: (t) => <span className="t-mono kb-kode">{t.kode}</span>,
    },
    {
      id: 'judul',
      judul: 'Tugas',
      wajib: true,
      nilaiUrut: (t) => t.judul,
      render: (t) => {
        const p = proyekById(t.proyekId);
        return (
          <Link href={`/app/tugas/${t.id}/`} className="item-text tbl-sel-judul">
            <span className="title">{t.judul}</span>
            {p ? <span className="meta">{p.nama}</span> : null}
          </Link>
        );
      },
    },
    {
      id: 'status',
      judul: 'Status',
      lebar: 150,
      nilaiUrut: (t) => statusById(t.statusId)?.urutan ?? 99,
      render: (t) => {
        const s = statusById(t.statusId);
        if (!s) return null;
        return <Badge tone={s.tone} pekat={s.id === 'blokir'}>{s.nama}</Badge>;
      },
    },
    {
      id: 'prioritas',
      judul: 'Prioritas',
      lebar: 110,
      nilaiUrut: (t) => prioritasById(t.prioritas)?.urutan ?? 9,
      render: (t) => <TandaPrioritas prioritas={t.prioritas} />,
    },
    {
      id: 'pj',
      judul: 'Penanggung Jawab',
      lebar: 190,
      nilaiUrut: (t) => anggotaById(t.penanggungJawabId)?.nama ?? 'zz',
      render: (t) => {
        const a = anggotaById(t.penanggungJawabId);
        if (!a) return <span className="text-muted t-ui-sm">Belum ada PJ</span>;
        return (
          <Link href={`/app/tim/${a.slug}/`} className="row gap-2">
            <Avatar inisial={a.inisial} warna={a.warna} ukuran={24} />
            <span className="truncate">{a.nama}</span>
          </Link>
        );
      },
    },
    {
      id: 'sprint',
      judul: 'Sprint',
      lebar: 150,
      bawaanTersembunyi: true,
      nilaiUrut: (t) => sprintById(t.sprintId)?.nama ?? 'zz',
      render: (t) => {
        const s = sprintById(t.sprintId);
        return s ? <Link href={`/app/sprint/${s.slug}/`}>{s.nama}</Link> : <span className="text-muted">Tanpa sprint</span>;
      },
    },
    {
      id: 'label',
      judul: 'Label',
      lebar: 190,
      bawaanTersembunyi: true,
      render: (t) => (
        <span className="row-wrap gap-1">
          {t.labelIds.map((id) => (
            <span key={id} className="chip">{labelById(id)?.nama ?? id}</span>
          ))}
        </span>
      ),
    },
    {
      id: 'tenggat',
      judul: 'Tenggat',
      lebar: 150,
      nilaiUrut: (t) => t.tenggat,
      render: (t) => <TandaTenggat iso={t.tenggat} />,
    },
    {
      id: 'estimasi',
      judul: 'Estimasi',
      lebar: 96,
      rata: 'kanan',
      nilaiUrut: (t) => t.estimasiJam,
      render: (t) => <span className="t-mono t-num">{jam(t.estimasiJam)}</span>,
    },
    {
      id: 'tercatat',
      judul: 'Tercatat',
      lebar: 96,
      rata: 'kanan',
      nilaiUrut: (t) => t.jamTercatat,
      render: (t) => (
        <span className={`t-mono t-num ${t.jamTercatat > t.estimasiJam ? 'prio-tinggi' : ''}`}>{jam(t.jamTercatat)}</span>
      ),
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Proyek                                                                     */
/* -------------------------------------------------------------------------- */

export const adapterProyek: AdapterView<Proyek> = {
  modul: 'proyek',
  labelItem: 'proyek',
  viewTersedia: ['kartu', 'tabel', 'timeline', 'kalender'],
  viewBawaan: 'kartu',
  // Kesehatan proyek DIHITUNG dari tenggat dan progres, jadi tidak boleh
  // dipindahkan dengan tangan. Kanban sengaja tidak ditawarkan di sini.
  bisaPindahGrup: false,
  kunci: (p) => p.id,
  grup: [
    { id: 'on_track', nama: 'On Track', tone: 'success' },
    { id: 'at_risk', nama: 'Berisiko', tone: 'warning' },
    { id: 'late', nama: 'Telat', tone: 'danger' },
  ],
  keItem: (p) => {
    const list = tugasProyek(p.id);
    const k = kesehatanProyek(p);
    return {
      id: p.id,
      kode: p.kode,
      judul: p.nama,
      keterangan: `${p.klien}, ${list.length} tugas`,
      grup: k,
      mulai: p.mulai,
      tenggat: p.tenggat,
      href: `/app/proyek/${p.slug}/`,
      badge: { teks: LABEL_KESEHATAN[k], tone: TONE_KESEHATAN[k] },
      orang: orangRingkas(p.pemilikId),
      progres: progresPersen(list),
      metrik: [{ label: 'Jam tercatat dibanding anggaran', nilai: `${jam(jamTercatatProyek(p.id))} / ${jam(p.anggaranJam)}` }],
    };
  },
  kolom: [
    {
      id: 'kode',
      judul: 'Kode',
      lebar: 72,
      wajib: true,
      nilaiUrut: (p) => p.kode,
      render: (p) => <span className="t-mono kb-kode">{p.kode}</span>,
    },
    {
      id: 'nama',
      judul: 'Proyek',
      wajib: true,
      nilaiUrut: (p) => p.nama,
      render: (p) => (
        <Link href={`/app/proyek/${p.slug}/`} className="item-text tbl-sel-judul">
          <span className="title">{p.nama}</span>
          <span className="meta">{p.klien}</span>
        </Link>
      ),
    },
    {
      id: 'kesehatan',
      judul: 'Kesehatan',
      lebar: 120,
      nilaiUrut: (p) => kesehatanProyek(p),
      render: (p) => {
        const k = kesehatanProyek(p);
        return <Badge tone={TONE_KESEHATAN[k]}>{LABEL_KESEHATAN[k]}</Badge>;
      },
    },
    {
      id: 'progres',
      judul: 'Progres',
      lebar: 150,
      nilaiUrut: (p) => progresPersen(tugasProyek(p.id)),
      render: (p) => {
        const n = progresPersen(tugasProyek(p.id));
        return (
          <span className="beban">
            <span className="beban-bar"><Progress nilai={n} label={`Progres ${p.nama}`} /></span>
            <span className="beban-angka">{n}%</span>
          </span>
        );
      },
    },
    {
      id: 'pemilik',
      judul: 'Pemilik',
      lebar: 170,
      nilaiUrut: (p) => anggotaById(p.pemilikId)?.nama ?? '',
      render: (p) => {
        const a = anggotaById(p.pemilikId);
        if (!a) return null;
        return (
          <Link href={`/app/tim/${a.slug}/`} className="row gap-2">
            <Avatar inisial={a.inisial} warna={a.warna} ukuran={24} />
            <span className="truncate">{a.nama}</span>
          </Link>
        );
      },
    },
    {
      id: 'anggota',
      judul: 'Anggota',
      lebar: 120,
      bawaanTersembunyi: true,
      render: (p) => (
        <AvatarStack
          orang={p.anggotaIds
            .map((id) => anggotaById(id))
            .filter((a): a is NonNullable<typeof a> => Boolean(a))
            .map((a) => ({ id: a.id, nama: a.nama, inisial: a.inisial, warna: a.warna }))}
        />
      ),
    },
    {
      id: 'tenggat',
      judul: 'Tenggat',
      lebar: 150,
      nilaiUrut: (p) => p.tenggat,
      render: (p) => <TandaTenggat iso={p.tenggat} />,
    },
    {
      id: 'jam',
      judul: 'Jam',
      lebar: 130,
      rata: 'kanan',
      bawaanTersembunyi: true,
      nilaiUrut: (p) => jamTercatatProyek(p.id),
      render: (p) => <span className="t-mono t-num">{jam(jamTercatatProyek(p.id))} / {jam(p.anggaranJam)}</span>,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Sprint                                                                     */
/* -------------------------------------------------------------------------- */

const LABEL_SPRINT: Record<Sprint['status'], string> = {
  berjalan: 'Berjalan',
  selesai: 'Selesai',
  akan_datang: 'Akan Datang',
};

export const adapterSprint: AdapterView<Sprint> = {
  modul: 'sprint',
  labelItem: 'sprint',
  viewTersedia: ['kartu', 'tabel', 'timeline'],
  viewBawaan: 'kartu',
  bisaPindahGrup: false,
  kunci: (s) => s.id,
  grup: [
    { id: 'berjalan', nama: 'Berjalan', tone: 'info' },
    { id: 'akan_datang', nama: 'Akan Datang', tone: 'neutral' },
    { id: 'selesai', nama: 'Selesai', tone: 'success' },
  ],
  keItem: (s) => {
    const list = tugasSprint(s.id);
    const p = proyekById(s.proyekId);
    return {
      id: s.id,
      judul: s.nama,
      keterangan: p ? `${p.nama}, ${list.length} tugas` : undefined,
      grup: s.status,
      mulai: s.mulai,
      tenggat: s.selesai,
      href: `/app/sprint/${s.slug}/`,
      badge: {
        teks: LABEL_SPRINT[s.status],
        tone: s.status === 'berjalan' ? 'info' : s.status === 'selesai' ? 'success' : 'neutral',
      },
      progres: progresPersen(list),
    };
  },
  kolom: [
    {
      id: 'nama',
      judul: 'Sprint',
      wajib: true,
      nilaiUrut: (s) => s.nama,
      render: (s) => {
        const p = proyekById(s.proyekId);
        return (
          <Link href={`/app/sprint/${s.slug}/`} className="item-text tbl-sel-judul">
            <span className="title">{s.nama}</span>
            {p ? <span className="meta">{p.nama}</span> : null}
          </Link>
        );
      },
    },
    {
      id: 'status',
      judul: 'Status',
      lebar: 130,
      nilaiUrut: (s) => s.status,
      render: (s) => (
        <Badge tone={s.status === 'berjalan' ? 'info' : s.status === 'selesai' ? 'success' : 'neutral'}>
          {LABEL_SPRINT[s.status]}
        </Badge>
      ),
    },
    {
      id: 'rentang',
      judul: 'Periode',
      lebar: 210,
      nilaiUrut: (s) => s.mulai,
      render: (s) => <span className="t-ui-sm text-muted">{rentangTanggal(s.mulai, s.selesai)}</span>,
    },
    {
      id: 'tugas',
      judul: 'Tugas',
      lebar: 80,
      rata: 'kanan',
      nilaiUrut: (s) => tugasSprint(s.id).length,
      render: (s) => <span className="t-num">{tugasSprint(s.id).length}</span>,
    },
    {
      id: 'progres',
      judul: 'Progres',
      lebar: 150,
      nilaiUrut: (s) => progresPersen(tugasSprint(s.id)),
      render: (s) => {
        const n = progresPersen(tugasSprint(s.id));
        return (
          <span className="beban">
            <span className="beban-bar"><Progress nilai={n} label={`Progres ${s.nama}`} /></span>
            <span className="beban-angka">{n}%</span>
          </span>
        );
      },
    },
    {
      id: 'sasaran',
      judul: 'Sasaran',
      bawaanTersembunyi: true,
      render: (s) => <span className="t-ui-sm text-muted">{s.sasaran}</span>,
    },
  ],
};

/* Opsi penyaring bersama, dibangun dari data supaya tidak ada nama status atau
   proyek yang ditulis harfiah di halaman. */

export const opsiProyek = [
  { nilai: 'semua', label: 'Semua proyek' },
  ...projects.map((p) => ({ nilai: p.id, label: p.nama, keterangan: p.klien })),
];

export const opsiAnggota = [
  { nilai: 'semua', label: 'Semua anggota' },
  { nilai: 'kosong', label: 'Belum ada PJ' },
  ...team.map((a) => ({ nilai: a.id, label: a.nama, keterangan: a.peran })),
];

export const opsiStatus = [
  { nilai: 'semua', label: 'Semua status' },
  ...statusUrut.map((s) => ({ nilai: s.id, label: s.nama })),
];

export const opsiPrioritas = [
  { nilai: 'semua', label: 'Semua prioritas' },
  { nilai: 'tinggi', label: 'Tinggi' },
  { nilai: 'sedang', label: 'Sedang' },
  { nilai: 'rendah', label: 'Rendah' },
];

export const opsiSprint = [
  { nilai: 'semua', label: 'Semua sprint' },
  { nilai: 'kosong', label: 'Tanpa sprint' },
  ...sprints.map((s) => ({ nilai: s.id, label: s.nama, keterangan: proyekById(s.proyekId)?.nama })),
];

export const ringkasPeriode = (mulai: string, selesai: string) =>
  `${tanggalPendek(mulai)} sampai ${tanggalPendek(selesai)}`;
