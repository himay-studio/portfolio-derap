'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { Checkbox, Stepper } from '@/components/ui/Controls';
import { Modal } from '@/components/ui/Overlay';
import { Badge } from '@/components/ui/Primitives';
import { Select } from '@/components/ui/Select';
import { WARNA_TONE } from '@/components/views/types';
import { statuses as statusesBase } from '@/data/taxonomy';
import type { Tone } from '@/data/types';
import { useDataStore } from '@/lib/store';

const idStatusDasar = new Set(statusesBase.map((s) => s.id));

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
 * Papan Kanban tugas membaca daftar status DASAR (`data/taxonomy.ts`), jadi
 * kolom baru yang ditambahkan di sini muncul di daftar ini dan siap dipakai
 * pemilik workspace, tapi belum otomatis membuka kolom baru di papan Kanban
 * pada sesi yang sama, itu batas jujur yang disebut di komentar DONE Stage 5.
 * Urutan, warna, dan batas WIP kolom dasar tetap bisa diubah di sesi ini
 * seperti bawaan Stage 3, disimpan sebagai state halaman.
 */
export function StatusEditor() {
  const store = useDataStore();
  const daftar = useMemo(() => [...store.statuses].sort((a, b) => a.urutan - b.urutan), [store.statuses]);

  const [urutan, setUrutan] = useState(() => daftar.map((s) => s.id));
  const [tone, setTone] = useState<Record<string, Tone>>({});
  const [selesai, setSelesai] = useState<Record<string, boolean>>({});
  const [wip, setWip] = useState<Record<string, number>>({});
  const [modal, setModal] = useState(false);

  const [namaBaru, setNamaBaru] = useState('');
  const [toneBaru, setToneBaru] = useState<Tone>('neutral');
  const [wipBaru, setWipBaru] = useState(8);
  const [selesaiBaru, setSelesaiBaru] = useState(false);
  const idNama = useId();

  const urutanLengkap = [...urutan, ...daftar.map((s) => s.id).filter((id) => !urutan.includes(id))];

  const geser = (id: string, arah: -1 | 1) => {
    setUrutan((s) => {
      const daftarUrutan = s.includes(id) ? s : [...s, id];
      const i = daftarUrutan.indexOf(id);
      const j = i + arah;
      if (i < 0 || j < 0 || j >= daftarUrutan.length) return daftarUrutan;
      const berikut = [...daftarUrutan];
      [berikut[i], berikut[j]] = [berikut[j], berikut[i]];
      return berikut;
    });
  };

  const simpan = () => {
    if (!namaBaru.trim()) return;
    store.tambahStatus({ nama: namaBaru.trim(), tone: toneBaru, selesai: selesaiBaru, batasWip: wipBaru || null });
    setUrutan((s) => [...s]); // biarkan efek berikutnya menata ulang lewat urutanLengkap
    setNamaBaru('');
    setToneBaru('neutral');
    setWipBaru(8);
    setSelesaiBaru(false);
    setModal(false);
  };

  return (
    <>
      <div className="row gap-3" style={{ marginBottom: 'var(--sp-4)' }}>
        {/* Aksi utama di KIRI, konsisten dengan seluruh aplikasi. */}
        <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} aria-hidden="true" />
          <span>Tambah Kolom</span>
        </button>
        <span className="t-caption text-muted">{urutanLengkap.length} kolom, dipakai di seluruh papan dan tabel.</span>
      </div>

      <ul className="stack gap-2">
        {urutanLengkap.map((id, i) => {
          const s = daftar.find((x) => x.id === id);
          if (!s) return null;
          const jumlah = store.tasks.filter((t) => t.statusId === id).length;
          const toneNow = tone[id] ?? s.tone;
          const wipNow = wip[id] ?? s.batasWip ?? 0;
          const selesaiNow = selesai[id] ?? s.selesai;
          const baru = !idStatusDasar.has(id);
          return (
            <li key={id} className="card card-pad">
              <div className="row-wrap gap-4">
                <span className="chip-dot kb-dot" style={{ background: WARNA_TONE[toneNow] }} aria-hidden="true" />
                <span className="item-text grow" style={{ minWidth: 180 }}>
                  <span className="title t-body-strong">{s.nama}</span>
                  <span className="meta">{jumlah} tugas di kolom ini{baru ? ', baru ditambahkan sesi ini' : ''}</span>
                </span>

                <Badge tone={toneNow}>{s.nama}</Badge>

                <Select
                  label={`Warna kolom ${s.nama}`}
                  labelTersembunyi
                  nilai={toneNow}
                  opsi={OPSI_TONE.map((o) => ({ nilai: o.nilai, label: o.label, warna: o.warna }))}
                  onUbah={(v) => setTone((t) => ({ ...t, [id]: v as Tone }))}
                  ukuran="sm"
                  lebar={160}
                />

                <span className="row gap-2">
                  <span className="t-caption text-muted">Batas WIP</span>
                  <Stepper
                    label={`Batas kerja berjalan kolom ${s.nama}`}
                    nilai={wipNow}
                    onUbah={(v) => setWip((w) => ({ ...w, [id]: v }))}
                    min={0}
                    max={30}
                  />
                </span>

                <Checkbox
                  label="Dihitung selesai"
                  checked={selesaiNow}
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
                    disabled={i === urutanLengkap.length - 1}
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
        Kolom yang masih berisi tugas tidak bisa dihapus. Pindahkan dulu isinya, baru kolomnya bisa dibuang. Kolom
        baru langsung tersimpan di daftar ini, dan siap dipakai tugas baru lewat form Tambah Tugas pada rilis
        berikutnya, papan Kanban yang sudah terbuka pada sesi ini tetap memakai enam kolom dasar.
      </p>

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Kolom Status"
        keterangan="Tersimpan di sesi demo ini."
        aksi={
          <>
            <button type="button" className="btn btn-primary" disabled={!namaBaru.trim()} onClick={simpan}>Simpan Kolom</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <div className="stack gap-3">
          <div className="field">
            <label htmlFor={idNama}>Nama kolom</label>
            <input id={idNama} className="input" value={namaBaru} onChange={(e) => setNamaBaru(e.target.value)} placeholder="Contoh, Menunggu Klien" />
          </div>
          <div className="row-wrap gap-3">
            <Select label="Warna" nilai={toneBaru} opsi={OPSI_TONE.map((o) => ({ nilai: o.nilai, label: o.label, warna: o.warna }))} onUbah={(v) => setToneBaru(v as Tone)} lebar={190} />
            <Stepper label="Batas kerja berjalan" nilai={wipBaru} onUbah={setWipBaru} min={0} max={30} />
          </div>
          <Checkbox label="Tugas di kolom ini dihitung selesai" checked={selesaiBaru} onChange={setSelesaiBaru} />
        </div>
      </Modal>
    </>
  );
}
