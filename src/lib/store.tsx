'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { tasks as tasksBase } from '@/data/tasks';
import { timesheet as timesheetBase } from '@/data/timesheet';
import { projects as projectsBase } from '@/data/projects';
import { sprints as sprintsBase } from '@/data/sprints';
import { labels as labelsBase, statuses as statusesBase } from '@/data/taxonomy';
import type { CatatanJam, KomentarTugas, Label, Lampiran, Proyek, Sprint, StatusKolom, Tugas } from '@/data/types';
import { useStickyState } from './storage';

/**
 * Lapisan mutasi demo. Data dasar di `src/data/*.ts` TIDAK PERNAH diubah di
 * runtime. Setiap tambahan dan perubahan disimpan sebagai lapisan terpisah di
 * localStorage lalu digabung di atas data dasar saat dibaca, dengan pola yang
 * sama seperti override papan Kanban yang sudah dibangun Stage 3
 * (`DataViews.tsx`, kunci `derap.board.moves.*`).
 *
 * Kenapa bukan menulis ulang array dasar: static export merender data dasar
 * di server, jadi render pertama klien HARUS identik. Lapisan tambahan baru
 * dibaca setelah mount (lihat `useStickyState`), jadi tidak pernah ada beda
 * markup server dan klien.
 */

let idBerikut = 1;
function idBaru(prefix: string): string {
  idBerikut += 1;
  return `${prefix}-baru-${idBerikut}-${Math.random().toString(36).slice(2, 7)}`;
}

interface StoreValue {
  siap: boolean;

  tasks: Tugas[];
  isTugasBaru: (id: string) => boolean;
  tambahTugas: (
    data: Omit<Tugas, 'id' | 'kode' | 'subtugas' | 'ceklis' | 'komentar' | 'lampiran' | 'urutan' | 'jamTercatat'>,
  ) => Tugas;
  ubahTugas: (id: string, patch: Partial<Tugas>) => void;
  tambahKomentar: (tugasId: string, isi: string, penulisId: string) => void;
  toggleSubtugas: (tugasId: string, subId: string) => void;
  toggleCeklis: (tugasId: string, itemId: string) => void;
  tambahSubtugas: (tugasId: string, judul: string) => void;
  tambahLampiran: (tugasId: string, nama: string, jenis: Lampiran['jenis']) => void;
  pindahBanyakStatus: (ids: string[], statusId: string) => void;
  tetapkanBanyakPj: (ids: string[], pjId: string | null) => void;

  timesheet: CatatanJam[];
  tambahCatatanJam: (data: Omit<CatatanJam, 'id'>) => void;

  projects: Proyek[];
  isProyekBaru: (id: string) => boolean;
  tambahProyek: (data: Omit<Proyek, 'id' | 'arsip'>) => Proyek;
  arsipkanProyek: (ids: string[]) => void;

  sprints: Sprint[];
  isSprintBaru: (id: string) => boolean;
  tambahSprint: (data: Omit<Sprint, 'id'>) => Sprint;

  labels: Label[];
  tambahLabel: (data: Omit<Label, 'id'>) => Label;

  statuses: StatusKolom[];
  tambahStatus: (data: Omit<StatusKolom, 'id' | 'urutan'>) => StatusKolom;
}

const StoreContext = createContext<StoreValue | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [tugasBaru, setTugasBaru, siap1] = useStickyState<Tugas[]>('derap.data.tugas.baru', []);
  const [tugasPatch, setTugasPatch] = useStickyState<Record<string, Partial<Tugas>>>('derap.data.tugas.patch', {});
  const [jamBaru, setJamBaru, siap2] = useStickyState<CatatanJam[]>('derap.data.timesheet.baru', []);
  const [proyekBaru, setProyekBaru, siap3] = useStickyState<Proyek[]>('derap.data.proyek.baru', []);
  const [proyekArsip, setProyekArsip, siap4] = useStickyState<string[]>('derap.data.proyek.arsip', []);
  const [sprintBaru, setSprintBaru, siap5] = useStickyState<Sprint[]>('derap.data.sprint.baru', []);
  const [labelBaru, setLabelBaru, siap6] = useStickyState<Label[]>('derap.data.label.baru', []);
  const [statusBaru, setStatusBaru, siap7] = useStickyState<StatusKolom[]>('derap.data.status.baru', []);

  const idTugasBaru = useMemo(() => new Set(tugasBaru.map((t) => t.id)), [tugasBaru]);
  const idProyekBaru = useMemo(() => new Set(proyekBaru.map((p) => p.id)), [proyekBaru]);
  const idSprintBaru = useMemo(() => new Set(sprintBaru.map((s) => s.id)), [sprintBaru]);

  const tasks = useMemo(() => {
    const gabung = [...tasksBase, ...tugasBaru];
    return gabung.map((t) => (tugasPatch[t.id] ? { ...t, ...tugasPatch[t.id] } : t));
  }, [tugasBaru, tugasPatch]);

  const tugasSaatIni = useCallback(
    (id: string): Tugas | undefined => tasks.find((t) => t.id === id),
    [tasks],
  );

  const tambahTugas: StoreValue['tambahTugas'] = useCallback(
    (data) => {
      const n = tasksBase.length + tugasBaru.length + 1;
      const t: Tugas = {
        ...data,
        id: idBaru('t'),
        kode: `DRP-${100 + n}`,
        subtugas: [],
        ceklis: [],
        komentar: [],
        lampiran: [],
        jamTercatat: 0,
        urutan: 999 + n,
      };
      setTugasBaru((s) => [...s, t]);
      return t;
    },
    [tugasBaru.length, setTugasBaru],
  );

  const ubahTugas = useCallback(
    (id: string, patch: Partial<Tugas>) => {
      setTugasPatch((s) => ({ ...s, [id]: { ...s[id], ...patch } }));
    },
    [setTugasPatch],
  );

  const tambahKomentar = useCallback(
    (tugasId: string, isi: string, penulisId: string) => {
      const t = tugasSaatIni(tugasId);
      if (!t || !isi.trim()) return;
      const komentar: KomentarTugas = {
        id: idBaru('kmt'),
        penulisId,
        waktu: `${new Date().toISOString().slice(0, 10)} ${new Date().toISOString().slice(11, 16)}`,
        isi: isi.trim(),
      };
      ubahTugas(tugasId, { komentar: [...t.komentar, komentar] });
    },
    [tugasSaatIni, ubahTugas],
  );

  const toggleSubtugas = useCallback(
    (tugasId: string, subId: string) => {
      const t = tugasSaatIni(tugasId);
      if (!t) return;
      ubahTugas(tugasId, {
        subtugas: t.subtugas.map((s) => (s.id === subId ? { ...s, selesai: !s.selesai } : s)),
      });
    },
    [tugasSaatIni, ubahTugas],
  );

  const toggleCeklis = useCallback(
    (tugasId: string, itemId: string) => {
      const t = tugasSaatIni(tugasId);
      if (!t) return;
      ubahTugas(tugasId, {
        ceklis: t.ceklis.map((c) => (c.id === itemId ? { ...c, selesai: !c.selesai } : c)),
      });
    },
    [tugasSaatIni, ubahTugas],
  );

  const tambahSubtugas = useCallback(
    (tugasId: string, judul: string) => {
      const t = tugasSaatIni(tugasId);
      if (!t || !judul.trim()) return;
      ubahTugas(tugasId, {
        subtugas: [...t.subtugas, { id: idBaru('sub'), judul: judul.trim(), selesai: false }],
      });
    },
    [tugasSaatIni, ubahTugas],
  );

  const tambahLampiran = useCallback(
    (tugasId: string, nama: string, jenis: Lampiran['jenis']) => {
      const t = tugasSaatIni(tugasId);
      if (!t || !nama.trim()) return;
      ubahTugas(tugasId, {
        lampiran: [...t.lampiran, { id: idBaru('lmp'), nama: nama.trim(), jenis, ukuran: 'mock' }],
      });
    },
    [tugasSaatIni, ubahTugas],
  );

  const pindahBanyakStatus = useCallback(
    (ids: string[], statusId: string) => {
      setTugasPatch((s) => {
        const berikut = { ...s };
        ids.forEach((id) => { berikut[id] = { ...berikut[id], statusId }; });
        return berikut;
      });
    },
    [setTugasPatch],
  );

  const tetapkanBanyakPj = useCallback(
    (ids: string[], pjId: string | null) => {
      setTugasPatch((s) => {
        const berikut = { ...s };
        ids.forEach((id) => { berikut[id] = { ...berikut[id], penanggungJawabId: pjId }; });
        return berikut;
      });
    },
    [setTugasPatch],
  );

  const timesheet = useMemo(() => [...timesheetBase, ...jamBaru], [jamBaru]);

  const tambahCatatanJam = useCallback(
    (data: Omit<CatatanJam, 'id'>) => {
      setJamBaru((s) => [...s, { ...data, id: idBaru('ts') }]);
      // Menambah jam tercatat pada tugas terkait, supaya rincian tugas dan
      // rekap timesheet tidak pernah berbeda.
      const t = tugasSaatIni(data.tugasId);
      if (t) ubahTugas(data.tugasId, { jamTercatat: Math.round((t.jamTercatat + data.jam) * 10) / 10 });
    },
    [setJamBaru, tugasSaatIni, ubahTugas],
  );

  const projects = useMemo(() => {
    const gabung = [...projectsBase, ...proyekBaru];
    return gabung.map((p) => (proyekArsip.includes(p.id) ? { ...p, arsip: true } : p));
  }, [proyekBaru, proyekArsip]);

  const tambahProyek: StoreValue['tambahProyek'] = useCallback(
    (data) => {
      const p: Proyek = { ...data, id: idBaru('p'), arsip: false };
      setProyekBaru((s) => [...s, p]);
      return p;
    },
    [setProyekBaru],
  );

  const arsipkanProyek = useCallback(
    (ids: string[]) => setProyekArsip((s) => Array.from(new Set([...s, ...ids]))),
    [setProyekArsip],
  );

  const sprints = useMemo(() => [...sprintsBase, ...sprintBaru], [sprintBaru]);

  const tambahSprint: StoreValue['tambahSprint'] = useCallback(
    (data) => {
      const s: Sprint = { ...data, id: idBaru('s') };
      setSprintBaru((x) => [...x, s]);
      return s;
    },
    [setSprintBaru],
  );

  const labels = useMemo(() => [...labelsBase, ...labelBaru], [labelBaru]);

  const tambahLabel: StoreValue['tambahLabel'] = useCallback(
    (data) => {
      const l: Label = { ...data, id: idBaru('lb') };
      setLabelBaru((s) => [...s, l]);
      return l;
    },
    [setLabelBaru],
  );

  const statuses = useMemo(() => [...statusesBase, ...statusBaru], [statusBaru]);

  const tambahStatus: StoreValue['tambahStatus'] = useCallback(
    (data) => {
      const urutan = Math.max(0, ...statusesBase.map((s) => s.urutan), ...statusBaru.map((s) => s.urutan)) + 1;
      const s: StatusKolom = { ...data, id: idBaru('st'), urutan };
      setStatusBaru((x) => [...x, s]);
      return s;
    },
    [statusBaru, setStatusBaru],
  );

  const value: StoreValue = {
    siap: siap1 && siap2 && siap3 && siap4 && siap5 && siap6 && siap7,
    tasks,
    isTugasBaru: (id) => idTugasBaru.has(id),
    tambahTugas,
    ubahTugas,
    tambahKomentar,
    toggleSubtugas,
    toggleCeklis,
    tambahSubtugas,
    tambahLampiran,
    pindahBanyakStatus,
    tetapkanBanyakPj,
    timesheet,
    tambahCatatanJam,
    projects,
    isProyekBaru: (id) => idProyekBaru.has(id),
    tambahProyek,
    arsipkanProyek,
    sprints,
    isSprintBaru: (id) => idSprintBaru.has(id),
    tambahSprint,
    labels,
    tambahLabel,
    statuses,
    tambahStatus,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDataStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useDataStore dipanggil di luar DataStoreProvider.');
  return ctx;
}
