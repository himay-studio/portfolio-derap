'use client';

import { useId, useState } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { Checkbox, Stepper } from '@/components/ui/Controls';
import { Select } from '@/components/ui/Select';
import { WARNA_TONE } from '@/components/views/types';
import { labels } from '@/data/taxonomy';
import type { PrioritasId, Tugas } from '@/data/types';
import { opsiAnggota, opsiPrioritas, opsiProyek, opsiSprint } from '@/lib/adapters';
import { HARI_INI, tambahHari } from '@/lib/dates';

export interface TugasFormState {
  judul: string;
  setJudul: (v: string) => void;
  deskripsi: string;
  setDeskripsi: (v: string) => void;
  proyekId: string;
  setProyekId: (v: string) => void;
  sprintId: string;
  setSprintId: (v: string) => void;
  pj: string;
  setPj: (v: string) => void;
  prioritas: PrioritasId;
  setPrioritas: (v: PrioritasId) => void;
  labelIds: string[];
  toggleLabel: (id: string) => void;
  mulai: string | null;
  setMulai: (v: string | null) => void;
  tenggat: string | null;
  setTenggat: (v: string | null) => void;
  estimasiJam: number;
  setEstimasiJam: (v: number) => void;
  valid: boolean;
}

/** State form Tambah dan Ubah Tugas, dipakai bersama supaya kedua modal tidak bercabang. */
export function useTugasForm(awal?: Partial<Tugas>): TugasFormState {
  const [judul, setJudul] = useState(awal?.judul ?? '');
  const [deskripsi, setDeskripsi] = useState(awal?.deskripsi ?? '');
  const [proyekId, setProyekId] = useState(awal?.proyekId ?? 'semua');
  const [sprintId, setSprintId] = useState(awal?.sprintId ?? 'kosong');
  const [pj, setPj] = useState(awal?.penanggungJawabId ?? 'kosong');
  const [prioritas, setPrioritas] = useState<PrioritasId>(awal?.prioritas ?? 'sedang');
  const [labelIds, setLabelIds] = useState<string[]>(awal?.labelIds ?? []);
  const [mulai, setMulai] = useState<string | null>(awal?.mulai ?? HARI_INI);
  const [tenggat, setTenggat] = useState<string | null>(awal?.tenggat ?? tambahHari(HARI_INI, 7));
  const [estimasiJam, setEstimasiJam] = useState(awal?.estimasiJam ?? 8);

  const toggleLabel = (id: string) =>
    setLabelIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return {
    judul, setJudul,
    deskripsi, setDeskripsi,
    proyekId, setProyekId,
    sprintId, setSprintId,
    pj, setPj,
    prioritas, setPrioritas,
    labelIds, toggleLabel,
    mulai, setMulai,
    tenggat, setTenggat,
    estimasiJam, setEstimasiJam,
    valid: judul.trim().length > 2 && proyekId !== 'semua' && Boolean(mulai) && Boolean(tenggat),
  };
}

const opsiProyekForm = opsiProyek.filter((o) => o.nilai !== 'semua');
const opsiSprintForm = opsiSprint.filter((o) => o.nilai !== 'semua');
const opsiPjForm = opsiAnggota.filter((o) => o.nilai !== 'semua');
const opsiPrioritasForm = opsiPrioritas.filter((o) => o.nilai !== 'semua');

export function TugasFormFields({ form }: { form: TugasFormState }) {
  const idJudul = useId();
  const idDeskripsi = useId();

  return (
    <div className="stack gap-4">
      <div className="field">
        <label htmlFor={idJudul}>Judul tugas</label>
        <input
          id={idJudul}
          className="input"
          value={form.judul}
          onChange={(e) => form.setJudul(e.target.value)}
          placeholder="Contoh, Desain ulang halaman checkout"
          maxLength={120}
        />
      </div>

      <div className="field">
        <label htmlFor={idDeskripsi}>Deskripsi</label>
        <textarea
          id={idDeskripsi}
          className="textarea"
          value={form.deskripsi}
          onChange={(e) => form.setDeskripsi(e.target.value)}
          placeholder="Jelaskan apa yang perlu selesai, dan bagaimana tahu tugas ini sudah beres."
        />
      </div>

      <div className="row-wrap gap-3">
        <Select label="Proyek" nilai={form.proyekId} opsi={opsiProyekForm} onUbah={form.setProyekId} lebar={220} placeholder="Pilih proyek" />
        <Select label="Sprint" nilai={form.sprintId} opsi={opsiSprintForm} onUbah={form.setSprintId} lebar={200} />
        <Select label="Penanggung jawab" nilai={form.pj} opsi={opsiPjForm} onUbah={form.setPj} lebar={220} />
      </div>

      <div className="row-wrap gap-3">
        <Select label="Prioritas" nilai={form.prioritas} opsi={opsiPrioritasForm} onUbah={(v) => form.setPrioritas(v as PrioritasId)} lebar={160} />
        <DatePicker label="Mulai" nilai={form.mulai} onUbah={form.setMulai} bisaDikosongkan={false} max={form.tenggat ?? undefined} lebar={190} />
        <DatePicker label="Tenggat" nilai={form.tenggat} onUbah={form.setTenggat} bisaDikosongkan={false} min={form.mulai ?? undefined} lebar={190} />
        <Stepper label="Estimasi jam" nilai={form.estimasiJam} onUbah={form.setEstimasiJam} min={1} max={200} satuan=" j" />
      </div>

      <div className="field">
        <span className="sel-label" style={{ display: 'block' }}>Label</span>
        <div className="row-wrap gap-3" role="group" aria-label="Pilih label tugas">
          {labels.map((l) => (
            <Checkbox
              key={l.id}
              label={l.nama}
              checked={form.labelIds.includes(l.id)}
              onChange={() => form.toggleLabel(l.id)}
            />
          ))}
        </div>
      </div>

      {!form.valid ? (
        <p className="t-caption text-muted" style={{ color: WARNA_TONE.warning }}>
          Judul minimal 3 huruf, proyek, tanggal mulai, dan tenggat wajib diisi sebelum disimpan.
        </p>
      ) : null}
    </div>
  );
}

export function tugasFormKeData(form: TugasFormState): Omit<
  Tugas,
  'id' | 'kode' | 'subtugas' | 'ceklis' | 'komentar' | 'lampiran' | 'urutan' | 'jamTercatat'
> {
  return {
    judul: form.judul.trim(),
    deskripsi: form.deskripsi.trim() || 'Belum ada deskripsi.',
    proyekId: form.proyekId,
    sprintId: form.sprintId === 'kosong' ? null : form.sprintId,
    penanggungJawabId: form.pj === 'kosong' ? null : form.pj,
    statusId: 'backlog',
    prioritas: form.prioritas,
    labelIds: form.labelIds,
    mulai: form.mulai ?? HARI_INI,
    tenggat: form.tenggat ?? HARI_INI,
    estimasiJam: form.estimasiJam,
  };
}

/** Dipakai modal Ubah Tugas. Tidak menyentuh statusId, itu urusan Kanban dan aksi massal. */
export function tugasFormKePatch(form: TugasFormState): Partial<Tugas> {
  return {
    judul: form.judul.trim(),
    deskripsi: form.deskripsi.trim() || 'Belum ada deskripsi.',
    proyekId: form.proyekId,
    sprintId: form.sprintId === 'kosong' ? null : form.sprintId,
    penanggungJawabId: form.pj === 'kosong' ? null : form.pj,
    prioritas: form.prioritas,
    labelIds: form.labelIds,
    mulai: form.mulai ?? HARI_INI,
    tenggat: form.tenggat ?? HARI_INI,
    estimasiJam: form.estimasiJam,
  };
}
