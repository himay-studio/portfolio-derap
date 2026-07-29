'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Chip, EmptyState, Placeholder } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { WARNA_TONE } from '@/components/views/types';
import { tasks } from '@/data/tasks';
import { labels } from '@/data/taxonomy';
import type { Tone } from '@/data/types';

const OPSI_TONE: { nilai: Tone; label: string; warna: string }[] = [
  { nilai: 'neutral', label: 'Netral', warna: WARNA_TONE.neutral },
  { nilai: 'brand', label: 'Brand', warna: WARNA_TONE.brand },
  { nilai: 'info', label: 'Info', warna: WARNA_TONE.info },
  { nilai: 'success', label: 'Sukses', warna: WARNA_TONE.success },
  { nilai: 'warning', label: 'Peringatan', warna: WARNA_TONE.warning },
  { nilai: 'danger', label: 'Bahaya', warna: WARNA_TONE.danger },
];

export function LabelEditor() {
  const [cari, setCari] = useState('');
  const [tone, setTone] = useState<Record<string, Tone>>(
    Object.fromEntries(labels.map((l) => [l.id, l.tone])),
  );
  const [modal, setModal] = useState(false);

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return labels.filter((l) => (q ? l.nama.toLowerCase().includes(q) : true));
  }, [cari]);

  const pemakaian = (id: string) => tasks.filter((t) => t.labelIds.includes(id)).length;

  return (
    <>
      <div className="row-wrap gap-3" style={{ marginBottom: 'var(--sp-4)' }}>
        <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} aria-hidden="true" />
          <span>Tambah Label</span>
        </button>
        <SearchInput nilai={cari} onUbah={setCari} label="Cari label" placeholder="Cari label" lebar={220} />
        <span className="grow" />
        <span className="t-caption text-muted">{tersaring.length} dari {labels.length} label</span>
      </div>

      {tersaring.length === 0 ? (
        <EmptyState
          ragam="kotak"
          judul="Tidak ada label yang cocok"
          penjelasan="Coba kata kunci lain, atau buat label baru untuk kebutuhan ini."
          aksi={<button type="button" className="btn btn-primary" onClick={() => setModal(true)}>Tambah Label</button>}
        />
      ) : (
        <ul className="stack gap-2">
          {tersaring.map((l) => {
            const dipakai = pemakaian(l.id);
            return (
              <li key={l.id} className="card card-pad">
                <div className="row-wrap gap-4">
                  <Chip warna={WARNA_TONE[tone[l.id]]}>{l.nama}</Chip>
                  <span className="item-text grow" style={{ minWidth: 160 }}>
                    <span className="title t-body-strong">{l.nama}</span>
                    <span className="meta">Dipakai di {dipakai} tugas</span>
                  </span>
                  <Select
                    label={`Warna label ${l.nama}`}
                    labelTersembunyi
                    nilai={tone[l.id]}
                    opsi={OPSI_TONE.map((o) => ({ nilai: o.nilai, label: o.label, warna: o.warna }))}
                    onUbah={(v) => setTone((t) => ({ ...t, [l.id]: v as Tone }))}
                    ukuran="sm"
                    lebar={160}
                    jangkar="kanan"
                  />
                  <span className="row gap-1">
                    <button type="button" className="btn btn-secondary btn-icon btn-sm" aria-label={`Ubah label ${l.nama}`}>
                      <Pencil size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-icon btn-sm"
                      aria-label={`Hapus label ${l.nama}`}
                      disabled={dipakai > 0}
                      title={dipakai > 0 ? 'Lepaskan label ini dari semua tugas dulu sebelum menghapusnya.' : undefined}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Label"
        keterangan="Kerangka form Stage 3. Stage 5 yang menyambungkannya ke state dan localStorage."
        aksi={
          <>
            <button type="button" className="btn btn-primary" onClick={() => setModal(false)}>Simpan Label</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <Placeholder
          label="Form tambah label"
          catatan="Field: nama label dan warna. Warna dipilih lewat Select, bukan input warna bawaan browser."
          tinggi={140}
        />
      </Modal>
    </>
  );
}
