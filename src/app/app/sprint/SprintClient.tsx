'use client';

import { Plus, RotateCcw } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { SearchInput } from '@/components/ui/Controls';
import { DatePicker } from '@/components/ui/DatePicker';
import { Modal } from '@/components/ui/Overlay';
import { Select } from '@/components/ui/Select';
import { DataViews } from '@/components/views/DataViews';
import type { StatusSprint } from '@/data/types';
import { adapterSprint, opsiProyek } from '@/lib/adapters';
import { HARI_INI, tambahHari } from '@/lib/dates';
import { useDataStore } from '@/lib/store';

const OPSI_STATUS_SPRINT = [
  { nilai: 'semua', label: 'Semua status' },
  { nilai: 'berjalan', label: 'Berjalan' },
  { nilai: 'akan_datang', label: 'Akan Datang' },
  { nilai: 'selesai', label: 'Selesai' },
];

const OPSI_STATUS_FORM = OPSI_STATUS_SPRINT.filter((o) => o.nilai !== 'semua');
const OPSI_PROYEK_FORM = opsiProyek.filter((o) => o.nilai !== 'semua');

export function SprintClient() {
  const store = useDataStore();
  const [cari, setCari] = useState('');
  const [status, setStatus] = useState('semua');
  const [proyek, setProyek] = useState('semua');
  const [modal, setModal] = useState(false);

  const [namaBaru, setNamaBaru] = useState('');
  const [proyekBaru, setProyekBaru] = useState(OPSI_PROYEK_FORM[0]?.nilai ?? '');
  const [sasaran, setSasaran] = useState('');
  const [mulaiBaru, setMulaiBaru] = useState<string | null>(HARI_INI);
  const [selesaiBaru, setSelesaiBaru] = useState<string | null>(tambahHari(HARI_INI, 14));
  const [statusBaru, setStatusBaru] = useState<StatusSprint>('akan_datang');
  const idNama = useId();
  const idSasaran = useId();

  const tersaring = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return store.sprints.filter((s) => {
      if (q && !`${s.nama} ${s.sasaran}`.toLowerCase().includes(q)) return false;
      if (status !== 'semua' && s.status !== status) return false;
      if (proyek !== 'semua' && s.proyekId !== proyek) return false;
      return true;
    });
  }, [store.sprints, cari, status, proyek]);

  const adaPenyaring = cari !== '' || status !== 'semua' || proyek !== 'semua';
  const valid = namaBaru.trim().length > 2 && Boolean(proyekBaru) && Boolean(mulaiBaru) && Boolean(selesaiBaru);

  const simpan = () => {
    if (!valid) return;
    store.tambahSprint({
      slug: namaBaru.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'sprint-baru',
      nama: namaBaru.trim(),
      proyekId: proyekBaru,
      mulai: mulaiBaru ?? HARI_INI,
      selesai: selesaiBaru ?? HARI_INI,
      status: statusBaru,
      sasaran: sasaran.trim() || 'Belum ada sasaran ditulis.',
    });
    setNamaBaru(''); setSasaran(''); setMulaiBaru(HARI_INI); setSelesaiBaru(tambahHari(HARI_INI, 14)); setStatusBaru('akan_datang');
    setModal(false);
  };

  return (
    <>
      <DataViews
        judul="Sprint"
        keterangan="Kelompok pekerjaan berjangka. Buka satu sprint untuk melihat burndown-nya."
        adapter={adapterSprint}
        baris={tersaring}
        ringkasan={`${tersaring.length} sprint, ${tersaring.filter((s) => s.status === 'berjalan').length} berjalan`}
        aksiUtama={
          <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={15} aria-hidden="true" />
            <span>Tambah Sprint</span>
          </button>
        }
        penyaring={
          <>
            <SearchInput nilai={cari} onUbah={setCari} label="Cari sprint" placeholder="Cari nama atau sasaran" lebar={220} />
            <Select label="Status" labelTersembunyi nilai={status} opsi={OPSI_STATUS_SPRINT} onUbah={setStatus} ukuran="sm" lebar={170} />
            <Select label="Proyek" labelTersembunyi nilai={proyek} opsi={opsiProyek} onUbah={setProyek} ukuran="sm" lebar={200} />
            {adaPenyaring ? (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCari(''); setStatus('semua'); setProyek('semua'); }}>
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset penyaring</span>
              </button>
            ) : null}
          </>
        }
      />

      <Modal
        terbuka={modal}
        tutup={() => setModal(false)}
        judul="Tambah Sprint"
        keterangan="Tersimpan di sesi demo ini."
        aksi={
          <>
            <button type="button" className="btn btn-primary" disabled={!valid} onClick={simpan}>Simpan Sprint</button>
            <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Batal</button>
          </>
        }
      >
        <div className="stack gap-4">
          <div className="field">
            <label htmlFor={idNama}>Nama sprint</label>
            <input id={idNama} className="input" value={namaBaru} onChange={(e) => setNamaBaru(e.target.value)} placeholder="Contoh, WPR Sprint 12" />
          </div>
          <div className="row-wrap gap-3">
            <Select label="Proyek" nilai={proyekBaru} opsi={OPSI_PROYEK_FORM} onUbah={setProyekBaru} lebar={220} />
            <Select label="Status" nilai={statusBaru} opsi={OPSI_STATUS_FORM} onUbah={(v) => setStatusBaru(v as StatusSprint)} lebar={170} />
          </div>
          <div className="row-wrap gap-3">
            <DatePicker label="Mulai" nilai={mulaiBaru} onUbah={setMulaiBaru} bisaDikosongkan={false} max={selesaiBaru ?? undefined} lebar={190} />
            <DatePicker label="Selesai" nilai={selesaiBaru} onUbah={setSelesaiBaru} bisaDikosongkan={false} min={mulaiBaru ?? undefined} lebar={190} />
          </div>
          <div className="field">
            <label htmlFor={idSasaran}>Sasaran sprint</label>
            <textarea id={idSasaran} className="textarea" value={sasaran} onChange={(e) => setSasaran(e.target.value)} placeholder="Apa yang ingin dicapai sprint ini." />
          </div>
          {!valid ? <p className="t-caption text-muted">Nama, proyek, tanggal mulai, dan selesai wajib diisi.</p> : null}
        </div>
      </Modal>
    </>
  );
}
