'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Checkbox, Stepper } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Badge, Placeholder } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { WARNA_TONE } from '@/components/views/types';
import { statusUrut } from '@/data/taxonomy';
import { tasks } from '@/data/tasks';
import type { Tone } from '@/data/types';

const OPSI_TONE: { nilai: Tone; label: string; warna: string }[] = [
  { nilai: 'neutral', label: 'Netral', warna: WARNA_TONE.neutral },
  { nilai: 'brand', label: 'Brand', warna: WARNA_TONE.brand },
  { nilai: 'info', label: 'Info', warna: WARNA_TONE.info },
  { nilai: 'success', label: 'Sukses', warna: WARNA_TONE.success },
  { nilai: 'warning', label: 'Peringatan', warna: WARNA_TONE.warning },
  { nilai: 'danger', label: 'Bahaya', warna: WARNA_TONE.danger },
];

/**
 * Editor kolom status.
 *
 * Papan Kanban, badge tabel, warna kalender, dan warna timeline semuanya
 * membaca daftar ini, jadi mengubah kolom di sini mengubah keempat view
 * sekaligus tanpa satu baris pun perubahan di lapisan view.
 */
export function StatusEditor() {
  const [urutan, setUrutan] = useState(statusUrut.map((s) => s.id));
  const [tone, setTone] = useState<Record<string, Tone>>(
    Object.fromEntries(statusUrut.map((s) => [s.id, s.tone])),
  );
  const [selesai, setSelesai] = useState<Record<string, boolean>>(
    Object.fromEntries(statusUrut.map((s) => [s.id, s.selesai])),
  );
  const [wip, setWip] = useState<Record<string, number>>(
    Object.fromEntries(statusUrut.map((s) => [s.id, s.batasWip ?? 0])),
  );
  const [modal, setModal] = useState(false);

  const geser = (id: string, arah: -1 | 1) => {
    setUrutan((s) => {
      const i = s.indexOf(id);
      const j = i + arah;
      if (i < 0 || j < 0 || j >= s.length) return s;
      const berikut = [...s];
      [berikut[i], berikut[j]] = [berikut[j], berikut[i]];
      return berikut;
    });
  };

  return (
    <>
      <div className="row gap-3" style={{ marginBottom: 'var(--sp-4)' }}>
        {/* Aksi utama di KIRI, konsisten dengan seluruh aplikasi. */}
        <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} aria-hidden="true" />
          <span>Tambah Kolom</span>
        </button>
        <span className="t-caption text-muted">{urutan.length} kolom, dipakai di seluruh papan dan tabel.</span>
      </div>

      <ul className="stack gap-2">
        {urutan.map((id, i) => {
          const s = statusUrut.find((x) => x.id === id);
          if (!s) return null;
          const jumlah = tasks.filter((t) => t.statusId === id).length;
          return (
            <li key={id} className="card card-pad">
              <div className="row-wrap gap-4">
                <span className="chip-dot kb-dot" style={{ background: WARNA_TONE[tone[id]] }} aria-hidden="true" />
                <span className="item-text grow" style={{ minWidth: 180 }}>
                  <span className="title t-body-strong">{s.nama}</span>
                  <span className="meta">{jumlah} tugas di kolom ini</span>
                </span>

                <Badge tone={tone[id]}>{s.nama}</Badge>

                <Select
                  label={`Warna kolom ${s.nama}`}
                  labelTersembunyi
                  nilai={tone[id]}
                  opsi={OPSI_TONE.map((o) => ({ nilai: o.nilai, label: o.label, warna: o.warna }))}
                  onUbah={(v) => setTone((t) => ({ ...t, [id]: v as Tone }))}
                  ukuran="sm"
                  lebar={160}
                />

                <span className="row gap-2">
                  <span className="t-caption text-muted">Batas WIP</span>
                  <Stepper
                    label={`Batas kerja berjalan kolom ${s.nama}`}
                    nilai={wip[id]}
                    onUbah={(v) => setWip((w) => ({ ...w, [id]: v }))}
                    min={0}
                    max={30}
                  />
                </span>

                <Checkbox
                  label="Dihitung selesai"
                  checked={selesai[id]}
                  onChange={(v) => setSelesai((x) => ({ ...x, [id]: v }))}
                />

                <span className="row gap-1">
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon btn-sm"
                    onClick={() => geser(id, -1)}
                    disabled={i === 0}
                    aria-label={`Naikkan urutan kolom ${s.nama}`}
                  >
                    <ArrowUp size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon btn-sm"
                    onClick={() => geser(id, 1)}
                    disabled={i === urutan.length - 1}
                    aria-label={`Turunkan urutan kolom ${s.nama}`}
                  >
                    <ArrowDown size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon btn-sm"
                    aria-label={`Hapus kolom ${s.nama}`}
                    disabled={jumlah > 0}
                    title={jumlah > 0 ? 'Kosongkan kolom ini dulu sebelum menghapusnya.' : undefined}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="t-caption text-muted seksi">
        Kolom yang masih berisi tugas tidak bisa dihapus. Pindahkan dulu isinya, baru kolomnya bisa dibuang.
      </p>

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Kolom Status"
        keterangan="Kerangka form Stage 3. Stage 5 yang menyambungkannya ke state dan localStorage."
        aksi={
          <>
            <button type="button" className="btn btn-primary" onClick={() => setModal(false)}>Simpan Kolom</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <Placeholder
          label="Form tambah kolom status"
          catatan="Field: nama kolom, warna, posisi, batas kerja berjalan, dan tanda dihitung selesai."
          tinggi={160}
        />
      </Modal>
    </>
  );
}
